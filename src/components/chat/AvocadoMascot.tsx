import { motion } from 'framer-motion';

interface AvocadoMascotProps {
  className?: string;
}

export function AvocadoMascot({ className }: AvocadoMascotProps) {
  return (
    <motion.svg
      viewBox="0 0 100 120"
      className={className}
      initial={{ scale: 1 }}
      animate={{ 
        y: [0, -3, 0],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {/* Shadow */}
      <ellipse cx="50" cy="115" rx="20" ry="4" fill="rgba(0,0,0,0.2)">
        <animate
          attributeName="rx"
          values="20;18;20"
          dur="1.5s"
          repeatCount="indefinite"
        />
      </ellipse>

      {/* Left Leg */}
      <motion.g
        animate={{ rotate: [-5, 5, -5] }}
        transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
        style={{ originX: "35px", originY: "85px" }}
      >
        <rect x="32" y="85" width="8" height="18" rx="4" fill="#5D4037" />
        {/* Left Shoe - Stylish Sneaker */}
        <path d="M28 100 Q28 108 35 108 L42 108 Q48 108 48 102 L48 100 Q48 96 40 96 L32 96 Q28 96 28 100Z" fill="#E53935" />
        <path d="M30 102 L46 102" stroke="white" strokeWidth="1.5" />
        <circle cx="33" cy="104" r="1" fill="white" />
        <circle cx="37" cy="104" r="1" fill="white" />
        <circle cx="41" cy="104" r="1" fill="white" />
      </motion.g>

      {/* Right Leg */}
      <motion.g
        animate={{ rotate: [5, -5, 5] }}
        transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
        style={{ originX: "65px", originY: "85px" }}
      >
        <rect x="60" y="85" width="8" height="18" rx="4" fill="#5D4037" />
        {/* Right Shoe - Stylish Sneaker */}
        <path d="M52 100 Q52 108 60 108 L67 108 Q73 108 73 102 L73 100 Q73 96 65 96 L57 96 Q52 96 52 100Z" fill="#E53935" />
        <path d="M54 102 L70 102" stroke="white" strokeWidth="1.5" />
        <circle cx="57" cy="104" r="1" fill="white" />
        <circle cx="61" cy="104" r="1" fill="white" />
        <circle cx="65" cy="104" r="1" fill="white" />
      </motion.g>

      {/* Avocado Body */}
      <ellipse cx="50" cy="55" rx="28" ry="35" fill="#8BC34A" />
      <ellipse cx="50" cy="58" rx="22" ry="28" fill="#9CCC65" />
      
      {/* Pit (belly) */}
      <ellipse cx="50" cy="62" rx="12" ry="14" fill="#5D4037" />
      <ellipse cx="48" cy="60" rx="4" ry="5" fill="#6D4C41" opacity="0.5" />

      {/* Left Arm */}
      <motion.g
        animate={{ rotate: [-10, 20, -10] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        style={{ originX: "22px", originY: "50px" }}
      >
        <rect x="12" y="45" width="14" height="6" rx="3" fill="#7CB342" />
        {/* Hand */}
        <circle cx="10" cy="48" r="5" fill="#7CB342" />
        <ellipse cx="6" cy="46" rx="2" ry="1.5" fill="#7CB342" />
      </motion.g>

      {/* Right Arm - Waving */}
      <motion.g
        animate={{ rotate: [-20, 30, -20] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
        style={{ originX: "78px", originY: "50px" }}
      >
        <rect x="74" y="45" width="14" height="6" rx="3" fill="#7CB342" />
        {/* Hand */}
        <circle cx="90" cy="48" r="5" fill="#7CB342" />
        <ellipse cx="94" cy="46" rx="2" ry="1.5" fill="#7CB342" />
      </motion.g>

      {/* Ice Crown */}
      <g>
        {/* Crown Base */}
        <path 
          d="M30 25 L35 10 L42 22 L50 5 L58 22 L65 10 L70 25 Z" 
          fill="url(#iceGradient)"
          stroke="#B3E5FC"
          strokeWidth="1"
        />
        {/* Crown sparkles */}
        <motion.circle 
          cx="50" cy="12" r="2" 
          fill="#ffffff"
          animate={{ opacity: [1, 0.3, 1], scale: [1, 1.3, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
        <motion.circle 
          cx="38" cy="18" r="1.5" 
          fill="#E1F5FE"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
        />
        <motion.circle 
          cx="62" cy="18" r="1.5" 
          fill="#E1F5FE"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
        />
        {/* Ice crystals on crown */}
        <path d="M42 20 L42 15 M40 17 L44 17" stroke="#B3E5FC" strokeWidth="1" />
        <path d="M58 20 L58 15 M56 17 L60 17" stroke="#B3E5FC" strokeWidth="1" />
      </g>

      {/* Face */}
      {/* Eyes */}
      <motion.g
        animate={{ scaleY: [1, 0.1, 1] }}
        transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
      >
        <ellipse cx="42" cy="42" rx="4" ry="5" fill="#3E2723" />
        <ellipse cx="58" cy="42" rx="4" ry="5" fill="#3E2723" />
        <circle cx="43" cy="40" r="1.5" fill="white" />
        <circle cx="59" cy="40" r="1.5" fill="white" />
      </motion.g>

      {/* Happy Smile */}
      <path 
        d="M42 52 Q50 60 58 52" 
        fill="none" 
        stroke="#3E2723" 
        strokeWidth="2.5" 
        strokeLinecap="round"
      />

      {/* Rosy Cheeks */}
      <ellipse cx="35" cy="48" rx="4" ry="2.5" fill="#FFAB91" opacity="0.6" />
      <ellipse cx="65" cy="48" rx="4" ry="2.5" fill="#FFAB91" opacity="0.6" />

      {/* Gradient definitions */}
      <defs>
        <linearGradient id="iceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#E1F5FE" />
          <stop offset="50%" stopColor="#81D4FA" />
          <stop offset="100%" stopColor="#4FC3F7" />
        </linearGradient>
      </defs>
    </motion.svg>
  );
}
