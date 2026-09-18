"use client";

import { memo } from "react";
import { Style, Avatar } from "@dicebear/core";
import definition from "@dicebear/styles/sprouts.json";

const style = new Style(definition);
const avatarUriCache = new Map();

const PASTEL_COLORS = [
  "b6e3f4",
  "c0aede",
  "d1d4f9",
  "ffd5dc",
  "ffdfbf",
  "d9f2d9",
];
const TAGS = ["animation"];

function getContactAvatarUri(seed) {
  const safeSeed = String(seed || "default").trim() || "default";
  const cached = avatarUriCache.get(safeSeed);
  if (cached) return cached;

  try {
    const avatar = new Avatar(style, {
      backgroundColor: PASTEL_COLORS,
      tags: TAGS,
      seed: safeSeed,
    });

    const uri = avatar.toDataUri();
    avatarUriCache.set(safeSeed, uri);
    return uri;
  } catch (err) {
    console.error("Failed to generate DiceBear avatar:", err);
    return null;
  }
}

function ContactAvatar({
  seed,
  className = "w-10 h-10 rounded-full",
  alt = "Avatar",
}) {
  const uri = getContactAvatarUri(seed);

  if (!uri) {
    const initial = (seed || "?").replace(/^@/, "").charAt(0).toUpperCase();
    return (
      <div
        className={`${className} bg-[#EBF1EB] dark:bg-[#18362B] border border-[#DEE7DF] dark:border-[#234235] flex items-center justify-center text-xs font-bold text-[#2D3E35] dark:text-[#D1DDD6] shrink-0 shadow-xs`}
      >
        {initial}
      </div>
    );
  }

  return (
    <img
      src={uri}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={`${className} object-cover shrink-0 border border-[#DEE7DF] dark:border-[#234235] shadow-xs select-none pointer-events-none`}
    />
  );
}

export default memo(ContactAvatar);
