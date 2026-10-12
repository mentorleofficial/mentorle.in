"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState(""); // honeypot
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, company }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "Something went wrong. Please try again.");
        return;
      }

      setStatus("success");
      setMessage(
        data.doubleOptIn
          ? "Almost there — check your inbox to confirm your email."
          : "You're on the list. We'll email you the moment we launch."
      );
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Network error. Please check your connection and try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md" noValidate>
      <div className="flex flex-col sm:flex-row gap-3">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <Input
          id="newsletter-email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "loading"}
          className="h-12 sm:h-12 rounded-full bg-white px-5 text-base border-gray-300"
        />
        {/* Honeypot: hidden from people, filled in by bots */}
        <input
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="hidden"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="bg-black text-white text-sm md:text-base hover:bg-[#222222] rounded-full px-6 h-12 font-bold whitespace-nowrap disabled:opacity-60 transition-colors"
        >
          {status === "loading" ? "Joining…" : "Notify me"}
        </button>
      </div>
      <p
        aria-live="polite"
        className={`mt-3 min-h-[1.5rem] text-sm text-center sm:text-left ${
          status === "error" ? "text-red-600" : "text-black/70"
        }`}
      >
        {message}
      </p>
    </form>
  );
}
