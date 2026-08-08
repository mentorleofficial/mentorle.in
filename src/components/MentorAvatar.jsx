"use client";

import { useState } from "react";
import Image from "next/image";

export default function MentorAvatar({
  src,
  name,
  className = "object-cover w-full h-full bg-black",
  sizes = "(max-width: 768px) 100vw, 25vw",
}) {
  const [failed, setFailed] = useState(false);
  const initials = name
    ? name
        .split(" ")
        .map((n) => n.charAt(0))
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  if (!src || failed) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-200">
        <span className="text-6xl font-bold text-gray-400">{initials}</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={name || "Mentor Profile"}
      className={className}
      fill
      sizes={sizes}
      unoptimized
      onError={() => setFailed(true)}
    />
  );
}
