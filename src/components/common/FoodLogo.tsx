import React from 'react'

interface FoodLogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export const FoodLogo: React.FC<FoodLogoProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  }

  return (
    <div
      className={`rounded-2xl bg-gradient-to-br from-[#8E2818] via-[#A8321F] to-[#69180C] text-white flex items-center justify-center shadow-sm shrink-0 border border-white/25 relative overflow-hidden select-none ${sizeClasses[size]} ${className}`}
    >
      {/* Decorative background glow */}
      <div className="absolute inset-0 bg-radial from-amber-400/20 to-transparent pointer-events-none" />

      {/* SVG Cloche Food Dome with Steam & Cutlery */}
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-3/4 h-3/4 text-amber-200 drop-shadow-xs"
      >
        {/* Steam wisps */}
        <path
          d="M20 9C19.5 7.5 21 6.5 20.5 5"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          className="opacity-70 animate-pulse"
        />
        <path
          d="M24 8.5C23.5 6.5 25.5 5.5 24.5 4"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          className="opacity-90"
        />
        <path
          d="M28 9C27.5 7.5 29 6.5 28.5 5"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          className="opacity-70 animate-pulse"
        />

        {/* Handle Knob on Cloche */}
        <circle cx="24" cy="13.5" r="2.5" fill="currentColor" />

        {/* Cloche Dome */}
        <path
          d="M10 28C10 19 16 16 24 16C32 16 38 19 38 28H10Z"
          fill="currentColor"
          fillOpacity="0.88"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Serving Platter Base Rim */}
        <rect
          x="7"
          y="28"
          width="34"
          height="3"
          rx="1.5"
          fill="#FFFDF7"
        />

        {/* Fork & Spoon crossed under base */}
        <path
          d="M16 34L20 42M20 34L16 42"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="opacity-80"
        />
        <circle cx="24" cy="37" r="1.5" fill="currentColor" />
        <path
          d="M28 34L32 42M32 34L28 42"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="opacity-80"
        />
      </svg>

      {/* Tiny Gold Badge Accent */}
      <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-amber-500 border border-[#FAF7F2] flex items-center justify-center text-[7px] text-white font-black shadow-xs">
        ✓
      </span>
    </div>
  )
}
