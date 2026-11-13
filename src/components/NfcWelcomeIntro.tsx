import { useEffect } from 'react';

export const NFC_WELCOME_DURATION_MS = 2250;

interface NfcWelcomeIntroProps {
  onComplete: () => void;
}

/**
 * Timing only: the original Three.js medallion performs the arrival turn.
 * Never duplicate the brand logo with an HTML image or a second 3D scene.
 */
export function NfcWelcomeIntro({ onComplete }: NfcWelcomeIntroProps) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const timeoutId = window.setTimeout(onComplete, NFC_WELCOME_DURATION_MS);
    const skipOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onComplete();
    };
    window.addEventListener('keydown', skipOnEscape);

    return () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener('keydown', skipOnEscape);
      document.body.style.overflow = previousOverflow;
    };
  }, [onComplete]);

  return null;
}
