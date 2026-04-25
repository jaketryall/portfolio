"use client";

import { useState } from "react";

const EMAIL = "hello@jakeryall.com";

/**
 * Plain mailto-backed form — no backend required. The submit handler
 * builds a mailto: URL with the typed subject + body so the user's mail
 * client opens pre-filled. Replace with a real /api/contact + Resend if
 * you want server-side handling later.
 */
export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [project, setProject] = useState("");
  const [budget, setBudget] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const subject = encodeURIComponent(
      `${project || "Project"} — ${name || "From the website"}`
    );
    const body = encodeURIComponent(
      [
        `From: ${name} <${email}>`,
        budget ? `Budget: ${budget}` : null,
        ``,
        message,
      ]
        .filter(Boolean)
        .join("\n")
    );
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
  };

  const inputClasses =
    "w-full bg-transparent border-0 border-b border-line py-3 text-base text-ink placeholder:text-ink-mute focus:border-ink focus:outline-none transition-colors";

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6"
      aria-label="Contact form"
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-ink-soft font-semibold">
            Your name
          </span>
          <input
            type="text"
            name="name"
            required
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Maya Chen"
            className={inputClasses}
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-ink-soft font-semibold">
            Your email
          </span>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@studio.com"
            className={inputClasses}
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-ink-soft font-semibold">
            Project type
          </span>
          <input
            type="text"
            name="project"
            value={project}
            onChange={(e) => setProject(e.target.value)}
            placeholder="Brand site, product app, …"
            className={inputClasses}
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-ink-soft font-semibold">
            Budget (optional)
          </span>
          <input
            type="text"
            name="budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="$10–25k, $25–50k, $50k+"
            className={inputClasses}
          />
        </label>
      </div>

      <label className="flex flex-col gap-2">
        <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-ink-soft font-semibold">
          Tell me about it
        </span>
        <textarea
          name="message"
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="What are you working on, who's the team, when do you want to launch?"
          className="w-full bg-transparent border-0 border-b border-line py-3 text-base text-ink placeholder:text-ink-mute focus:border-ink focus:outline-none transition-colors resize-none"
        />
      </label>

      <div className="mt-4 flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-xs text-ink-mute">
          Submitting will open your mail app pre-filled to{" "}
          <span className="text-ink font-semibold">{EMAIL}</span>.
        </p>
        <button
          type="submit"
          data-cursor="view"
          data-cursor-label="SEND"
          className="rounded-full bg-ink px-7 py-4 font-mono text-[12px] tracking-[0.2em] uppercase text-canvas font-semibold transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98]"
        >
          Send message →
        </button>
      </div>
    </form>
  );
}
