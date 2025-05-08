// src/components/Logo.jsx
import React from 'react';

const Logo = () => {
  return (
    <div className="flex justify-center items-center py-6">
      <div className="relative w-64 h-64 flex justify-center items-center">
        <div className="absolute inset-0">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <defs>
              <radialGradient id="sunburstGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" stopColor="#FFF8E1" />
                <stop offset="70%" stopColor="#FFF2CC" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#FFF2CC" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="100" cy="100" r="40" fill="url(#sunburstGradient)" />
            {[...Array(36)].map((_, i) => {
              const angle = (i * 10) * (Math.PI / 180);
              const x1 = 100 + 38 * Math.cos(angle);
              const y1 = 100 + 38 * Math.sin(angle);
              const x2 = 100 + 90 * Math.cos(angle);
              const y2 = 100 + 90 * Math.sin(angle);
              return (
                <line 
                  key={i}
                  x1={x1} 
                  y1={y1} 
                  x2={x2} 
                  y2={y2} 
                  stroke="#FFF2CC" 
                  strokeWidth="1.5" 
                />
              );
            })}
          </svg>
        </div>
        <div className="absolute text-center z-10">
          <div className="font-script text-3xl leading-tight tracking-wide text-coral">
            Dr. Angelina Yee MD
          </div>
        </div>
      </div>
    </div>
  );
};

export default Logo;
