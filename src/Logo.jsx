import React from 'react';

const Logo = ({ size = 80, className = "" }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="bookGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#2563eb', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#7c3aed', stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="pageGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: '#60a5fa', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#a78bfa', stopOpacity: 1 }} />
        </linearGradient>
      </defs>

      <circle cx="50" cy="50" r="48" fill="url(#bookGradient)" opacity="0.1"/>

      <g transform="translate(25, 20)">
        <rect x="0" y="0" width="50" height="60" rx="3" fill="url(#bookGradient)"/>

        <rect x="5" y="8" width="40" height="2" fill="white" opacity="0.9" rx="1"/>
        <rect x="5" y="15" width="35" height="2" fill="white" opacity="0.8" rx="1"/>
        <rect x="5" y="22" width="38" height="2" fill="white" opacity="0.7" rx="1"/>
        <rect x="5" y="29" width="32" height="2" fill="white" opacity="0.6" rx="1"/>

        <path
          d="M 25 0 L 25 60"
          stroke="white"
          strokeWidth="1.5"
          opacity="0.3"
        />

        <circle cx="40" cy="50" r="8" fill="#fbbf24" opacity="0.95"/>
        <path
          d="M 36 50 L 38 52 L 44 46"
          stroke="white"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};

export default Logo;
