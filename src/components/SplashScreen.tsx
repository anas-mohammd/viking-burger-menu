'use client';

import { useEffect, useRef, useState } from 'react';

interface Props {
  onDone: () => void;
}

export default function SplashScreen({ onDone }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnd = () => {
      setFading(true);
      const t = setTimeout(onDone, 500);
      return () => clearTimeout(t);
    };

    video.addEventListener('ended', handleEnd);
    return () => video.removeEventListener('ended', handleEnd);
  }, [onDone]);

  return (
    <div style={{
      position: 'fixed', top: 0, right: 0, bottom: 0, left: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#000',
      opacity: fading ? 0 : 1,
      transition: 'opacity 0.5s ease',
    }}>
      <video
        ref={videoRef}
        src="/splash-screen.mp4"
        autoPlay
        muted
        playsInline
        style={{
          maxWidth: '100%',
          maxHeight: '100%',
          objectFit: 'contain',
        }}
      />
    </div>
  );
}
