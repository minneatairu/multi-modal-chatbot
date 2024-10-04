"use client";

import { useState } from "react";

export default function VideoPlayer() {
  const [muted, setMuted] = useState(true);

  const toggleMute = () => {
    setMuted(!muted);
  };

  return (
    <div className="video-container">
      <video width="100%" muted={muted} autoPlay loop>

      </video>
      <div className="video-controls">
        <span onClick={toggleMute} className="material-symbols-outlined">
          {muted ? "volume_off" : "volume_up"}
        </span>
      </div>
    </div>
  );
}
