import { useEffect } from 'react';

export const NFC_WELCOME_DURATION_MS = 2250;

interface NfcWelcomeIntroProps {
  logoUrl: string;
  nameEn: string;
  nameAr: string;
  onComplete: () => void;
}

/** A short, non-interactive arrival sequence for physical NFC keychains only. */
export function NfcWelcomeIntro({
  logoUrl,
  nameEn,
  nameAr,
  onComplete,
}: NfcWelcomeIntroProps) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const timeoutId = window.setTimeout(onComplete, NFC_WELCOME_DURATION_MS);

    return () => {
      window.clearTimeout(timeoutId);
      document.body.style.overflow = previousOverflow;
    };
  }, [onComplete]);

  return (
    <div
      className="nfc-welcome fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
      role="status"
      aria-label={`Opening ${nameEn}'s portfolio`}
      aria-live="polite"
    >
      <div className="nfc-welcome__halo" aria-hidden="true" />
      <div className="nfc-welcome__emblem" aria-hidden="true">
        <div className="nfc-welcome__coin">
          <div className="nfc-welcome__face nfc-welcome__face--front">
            <img src={logoUrl} alt="" />
          </div>
          <div className="nfc-welcome__face nfc-welcome__face--back">
            <img src={logoUrl} alt="" />
          </div>
        </div>
      </div>
      <div className="nfc-welcome__identity text-center">
        <div className="font-display text-xl sm:text-2xl font-extrabold tracking-[0.18em] text-white">
          {nameEn.toUpperCase()}
        </div>
        <div className="font-arabic-display mt-2 text-base sm:text-lg font-extrabold text-[#FFB629]">
          {nameAr}
        </div>
        <div className="nfc-welcome__rule mt-6" aria-hidden="true" />
      </div>
    </div>
  );
}
