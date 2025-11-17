import { useEffect, useState } from 'react';

interface CountdownProps {
  onComplete: () => void;
}

export function Countdown({ onComplete }: CountdownProps) {
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (count === 0) {
      onComplete();
      return;
    }

    const timer = setTimeout(() => {
      setCount(count - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [count, onComplete]);

  if (count === 0) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/80 rounded z-50">
      <div 
        className="text-white text-9xl animate-pulse"
        style={{
          fontFamily: 'monospace',
          textShadow: '0 0 30px rgba(168, 85, 247, 0.9)',
          animation: 'pulse 0.5s ease-in-out'
        }}
      >
        {count}
      </div>
    </div>
  );
}
