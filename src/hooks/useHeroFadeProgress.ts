import { useEffect, useState } from 'react';

function getFadeProgress(distance: number) {
  if (typeof window === 'undefined') {
    return 0;
  }

  return Math.min(window.scrollY / distance, 1);
}

export function useHeroFadeProgress(distance = 180) {
  const [progress, setProgress] = useState(() => getFadeProgress(distance));

  useEffect(() => {
    const handleScroll = () => {
      setProgress(getFadeProgress(distance));
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [distance]);

  return progress;
}
