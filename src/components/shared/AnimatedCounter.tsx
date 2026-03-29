import { useState, useEffect, useRef } from 'react';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
}

const AnimatedCounter = ({ value, duration = 1200, prefix = '', suffix = '' }: AnimatedCounterProps) => {
  const [display, setDisplay] = useState(0);
  const startTime = useRef<number | null>(null);
  const animFrame = useRef<number>();

  useEffect(() => {
    const animate = (timestamp: number) => {
      if (!startTime.current) startTime.current = timestamp;
      const progress = Math.min((timestamp - startTime.current) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setDisplay(Math.floor(eased * value));
      if (progress < 1) animFrame.current = requestAnimationFrame(animate);
    };
    startTime.current = null;
    animFrame.current = requestAnimationFrame(animate);
    return () => { if (animFrame.current) cancelAnimationFrame(animFrame.current); };
  }, [value, duration]);

  return <span>{prefix}{display.toLocaleString('en-IN')}{suffix}</span>;
};

export default AnimatedCounter;
