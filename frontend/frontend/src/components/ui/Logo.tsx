import React from 'react';

interface LogoProps {
  size?: number;
  className?: string;
}

export function Logo({ size = 40, className = '' }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Gradient definitions */}
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#6366F1" />
        </linearGradient>
      </defs>
      
      {/* Filter/Sieve shape */}
      <circle cx="50" cy="50" r="45" fill="url(#logoGradient)" opacity="0.1" />
      
      {/* Funnel/Sieve top */}
      <path
        d="M30 25 L70 25 L60 45 L40 45 Z"
        fill="url(#logoGradient)"
      />
      
      {/* Funnel middle */}
      <path
        d="M40 45 L60 45 L55 65 L45 65 Z"
        fill="url(#logoGradient)"
        opacity="0.8"
      />
      
      {/* Dots representing filtered content */}
      <circle cx="50" cy="72" r="3" fill="url(#logoGradient)" />
      <circle cx="42" cy="77" r="2" fill="url(#logoGradient)" opacity="0.7" />
      <circle cx="58" cy="77" r="2" fill="url(#logoGradient)" opacity="0.7" />
      
      {/* AI sparkle */}
      <path
        d="M75 20 L77 25 L82 27 L77 29 L75 34 L73 29 L68 27 L73 25 Z"
        fill="#FBBF24"
      />
    </svg>
  );
}