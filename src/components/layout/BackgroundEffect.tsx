'use client';

import Lightfall from '@/components/ui/Lightfall';

export default function BackgroundEffect() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
      <Lightfall
        colors={['#144272', '#0A2647', '#FF6B35']}
        backgroundColor="#0A2647"
        speed={0.4}
        streakCount={4}
        streakWidth={1.2}
        streakLength={1.5}
        glow={1.2}
        density={0.5}
        twinkle={0.6}
        zoom={2.5}
        backgroundGlow={0.6}
        opacity={0.55}
        mouseInteraction={true}
        mouseStrength={0.3}
        mouseRadius={0.8}
        mouseDampening={0.2}
      />
    </div>
  );
}
