import React from 'react';

const SigmaIcon = ({ className = "w-6 h-6", color = "currentColor" }) => {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        d="M18 4H6L12 10L6 16H18V18H4V16L10 10L4 4V2H18V4Z" 
        fill={color}
      />
    </svg>
  );
};

export default SigmaIcon;
