import React from 'react';

const Spinner = ({ size = 12, color = 'bg-blue-600', className = '' }) => {
  // Compute spacing based on dot size for structural harmony
  const gapSize = Math.max(4, Math.round(size / 3));

  // Style object applied to each dot to enable staggered modern pulse animation
  const dotStyle = {
    width: `${size}px`,
    height: `${size}px`,
  };

  return (
    <div 
      className={`flex items-center justify-center ${className}`} 
      style={{ gap: `${gapSize}px` }}
      role="status" 
      aria-label="loading"
    >
      <style>{`
        @keyframes customPulse {
          0%, 100% { transform: scale(0.6); opacity: 0.4; }
          50% { transform: scale(1.2); opacity: 1; }
        }
        .animate-modern-pulse {
          animation: customPulse 1.2s ease-in-out infinite;
        }
      `}</style>
      
      <div className={`rounded-full ${color} animate-modern-pulse`} style={{ ...dotStyle, animationDelay: '0s' }} />
      <div className={`rounded-full ${color} animate-modern-pulse`} style={{ ...dotStyle, animationDelay: '0.2s' }} />
      <div className={`rounded-full ${color} animate-modern-pulse`} style={{ ...dotStyle, animationDelay: '0.4s' }} />
      
    </div>
  );
};

export default Spinner;