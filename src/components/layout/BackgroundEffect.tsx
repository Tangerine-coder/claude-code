'use client';

import { Component } from 'react';
import dynamic from 'next/dynamic';

// Error boundary: if WebGL fails, don't crash the entire page
class SafeBackground extends Component<{ children: React.ReactNode }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.warn('[Background] WebGL init failed, falling back to static background:', error.message);
  }

  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

// ogl uses WebGL — must disable SSR and handle errors gracefully
const Lightfall = dynamic(() => import('@/components/ui/Lightfall'), {
  ssr: false,
  loading: () => null,
});

export default function BackgroundEffect() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
      <SafeBackground>
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
      </SafeBackground>
    </div>
  );
}
