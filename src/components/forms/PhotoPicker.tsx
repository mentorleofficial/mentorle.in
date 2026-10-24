"use client";

import { useRef, useState } from "react";
import { Spinner, outlineButtonClasses } from "@/components/forms/fields";
import { Avatar } from "@/components/layout/AccountMenu";
import { onboardingCopy } from "@/data/onboarding";
import { useAuth } from "@/lib/auth/AuthProvider";
import { authService } from "@/lib/auth/service";

const copy = onboardingCopy;
const MAX_PHOTO_BYTES = 5 * 1024 * 1024;

// Profile photo: saved as soon as it's picked (onboarding and Account), to the platform's avatar folder.
export function PhotoPicker({ name }: { name: string }) {
  const { user, refresh } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [photoError, setPhotoError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const onFile = async (file: File | undefined) => {
    if (!file || !user) return;
    if (!/^image\/(png|jpe?g|webp)$/.test(file.type)) return setPhotoError(copy.photo.notImage);
    if (file.size > MAX_PHOTO_BYTES) return setPhotoError(copy.photo.tooLarge);
    setPhotoError("");
    setUploading(true);
    try {
      const url = await authService.uploadAvatar(file);
      await authService.upsertMenteeProfile(user.id, { avatar_url: url });
      await refresh();
    } catch {
      setPhotoError(copy.errors.save);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-5">
      <div className="relative">
        <Avatar name={name} url={user?.avatar_url ?? null} className="size-20 text-2xl" />
        {uploading && (
          <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
            <Spinner />
          </span>
        )}
      </div>
      <div>
        <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading} className={outlineButtonClasses("disabled:opacity-60")}>
          {user?.avatar_url ? copy.photo.change : copy.photo.add}
        </button>
        <p className="mt-2 text-xs text-muted">{copy.photo.hint}</p>
        {photoError && <p className="mt-1 text-xs text-brand-dark">{photoError}</p>}
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="sr-only"
          tabIndex={-1}
          aria-hidden
          onChange={(event) => void onFile(event.target.files?.[0])}
        />
      </div>
    </div>
  );
}
