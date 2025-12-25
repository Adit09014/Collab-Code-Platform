import React from "react";

export default function VoiceIframe({ token, url }) {
  if (!token || !url) return null;

  const vcUrl = `http://localhost:3000/vc?token=${encodeURIComponent(
    token
  )}&url=${encodeURIComponent(url)}`;

  return (
    <iframe
      src={vcUrl}
      className="w-full h-full border-none"
      allow="camera; microphone; fullscreen"
    />
  );
}
