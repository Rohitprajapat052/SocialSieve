import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Logo({ size = 'md', className = '' }: LogoProps) {
  const sizeMap = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-20 h-20',
  };

  return (
    <svg
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="SocialSieve logo"
      className={`${sizeMap[size]} ${className}`}
    >
      <defs>
        <linearGradient id="ssGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
      </defs>

      <rect width="100%" height="100%" rx="36" fill="url(#ssGrad)" />

      <text
        x="50%"
        y="55%"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="Inter, system-ui, -apple-system, 'Segoe UI', Roboto, Arial"
        fontWeight={700}
        fontSize={110}
        fill="#ffffff"
      >
        S
      </text>
    </svg>
  );
}