"use client";

import { useEffect, useRef, useState } from "react";
import { AuthLink, useAuthModal } from "@/components/auth/AuthModalContext";
import { AuthHeading, AuthStep, PlatformAccountStep, formColumn } from "@/components/auth/AuthStep";
import { FormAlert, PasswordField, SubmitButton } from "@/components/forms/fields";
import { authCopy, authErrors } from "@/data/auth";
import { newPasswordSchema } from "@/lib/auth/schema";
import { authService } from "@/lib/auth/service";
import type { AppRole } from "@/lib/auth/types";
import { useZodForm } from "@/lib/forms/useZodForm";
import { recoverySupabase } from "@/lib/supabase/browser";

const copy = authCopy.resetLink;

type Link = { client: ReturnType<typeof recoverySupabase>; email: string; role: AppRole };

// /reset-password, opened from the "Reset Password" button in the reset email (requested on this site; the
// platform's own requests land on the platform). The link carries a short-lived recovery session in the URL
// hash. It's used through a throwaway client, so it never becomes this browser's signed-in session: mentees are
// logged in normally with their new password afterwards, mentor and admin accounts are sent to the platform.
export function ResetLinkFlow() {
  const { finish } = useAuthModal();
  const [state, setState] = useState<"checking" | "form" | "expired" | "platform">("checking");
  const [link, setLink] = useState<Link | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const form = useZodForm(newPasswordSchema, { password: "", confirmPassword: "" }, "reset-link");
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const params = new URLSearchParams(window.location.hash.slice(1));
    // Take the tokens out of the address bar right away (history, screenshots, shared URLs).
    window.history.replaceState(null, "", window.location.pathname + window.location.search);
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");
    (async () => {
      // No recovery tokens: an expired link (Supabase sends #error=…), a used one, or a bare visit.
      if (params.get("type") !== "recovery" || !accessToken || !refreshToken) return setState("expired");
      const client = recoverySupabase();
      const { data, error } = await client.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
      if (error || !data.user) return setState("expired");
      const { data: row } = await client.from("users").select("role").eq("id", data.user.id).maybeSingle();
      setLink({ client, email: data.user.email ?? "", role: (row?.role as AppRole | undefined) ?? "mentee" });
      setState("form");
    })();
  }, []);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError("");
    const values = form.submit();
    if (!values || !link) return;
    setSaving(true);
    const { error } = await link.client.auth.updateUser({ password: values.password });
    if (error) {
      setSaving(false);
      const code = `${error.code ?? ""} ${error.message}`.toLowerCase();
      if (code.includes("same_password") || code.includes("different from the old")) form.setError("password", authErrors.samePassword);
      else if (code.includes("weak_password")) form.setError("password", authErrors.weakPassword);
      else if (code.includes("session") || code.includes("expired") || code.includes("jwt")) setState("expired");
      else setFormError(authErrors.generic);
      return;
    }
    await link.client.auth.signOut({ scope: "local" });
    if (link.role !== "mentee") return setState("platform");
    try {
      const session = await authService.signInWithPassword({ email: link.email, password: values.password });
      await finish(session.user.id);
    } catch {
      setSaving(false);
      setFormError(authErrors.generic);
    }
  };

  if (state === "checking") {
    return (
      <AuthStep>
        <AuthHeading title={copy.checking} />
      </AuthStep>
    );
  }

  if (state === "expired") {
    return (
      <AuthStep>
        <AuthHeading title={copy.expired.title}>{copy.expired.subtitle}</AuthHeading>
        <div className={formColumn}>
          <AuthLink href={copy.expired.href} className="flex h-12 w-full items-center justify-center bg-brand text-sm text-white transition-colors duration-300 hover:bg-brand-dark">
            {copy.expired.cta}
          </AuthLink>
        </div>
      </AuthStep>
    );
  }

  if (state === "platform" && link) {
    return <PlatformAccountStep role={link.role === "admin" ? "admin" : "mentor"} />;
  }

  const subtitle = copy.subtitle(link?.email ?? "");
  const { fields } = authCopy;
  return (
    <AuthStep>
      <AuthHeading title={copy.title}>
        {subtitle.before} <strong className="font-semibold break-all">{subtitle.email}</strong>
      </AuthHeading>
      <form noValidate onSubmit={onSubmit} className={formColumn}>
        <PasswordField
          {...form.field("password")}
          label={fields.newPassword}
          labelHidden
          autoComplete="new-password"
          showLabel={fields.showPassword}
          hideLabel={fields.hidePassword}
          value={form.values.password}
          onChange={(event) => form.setValue("password", event.target.value)}
        />
        <PasswordField
          {...form.field("confirmPassword")}
          label={fields.confirmPassword}
          labelHidden
          autoComplete="new-password"
          showLabel={fields.showPassword}
          hideLabel={fields.hidePassword}
          value={form.values.confirmPassword}
          onChange={(event) => form.setValue("confirmPassword", event.target.value)}
        />
        <FormAlert>{formError}</FormAlert>
        <SubmitButton loading={saving} loadingLabel={copy.submitting} className="mt-1">
          {copy.submit}
        </SubmitButton>
      </form>
    </AuthStep>
  );
}
