import React from 'react';
import { motion } from 'framer-motion';

export const SplashAnimation = () => {
  const text = "BRAINOVA".split("");
  
  // Directions for text letters
  const textDirections = [
    { x: -100, y: -100 },
    { x: 100, y: -150 },
    { x: -150, y: 50 },
    { x: 150, y: 100 },
    { x: -50, y: 150 },
    { x: 50, y: -100 },
    { x: -100, y: 100 },
    { x: 100, y: 50 },
  ];

  // Brain SVG paths from lucide-react
  const brainPaths = [
    { d: "M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z", dir: { x: -100, y: -100 } },
    { d: "M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z", dir: { x: 100, y: -100 } },
    { d: "M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4", dir: { x: 0, y: 100 } },
    { d: "M17.599 6.5a3 3 0 0 0 .399-1.375", dir: { x: 150, y: -50 } },
    { d: "M6.003 5.125A3 3 0 0 0 6.401 6.5", dir: { x: -150, y: -50 } },
    { d: "M3.477 10.896a4 4 0 0 1 .585-.396", dir: { x: -150, y: 50 } },
    { d: "M19.938 10.5a4 4 0 0 1 .585.396", dir: { x: 150, y: 50 } },
    { d: "M6 18a4 4 0 0 1-1.967-.516", dir: { x: -100, y: 150 } },
    { d: "M19.967 17.484A4 4 0 0 1 18 18", dir: { x: 100, y: 150 } },
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center z-10 w-full px-6">
      <div className="relative mb-8 w-24 h-24">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="w-full h-full text-[#7b85f5]"
        >
          {brainPaths.map((path, index) => (
            <motion.path
              key={index}
              d={path.d}
              initial={{ x: path.dir.x, y: path.dir.y, opacity: 0, scale: 0.5, rotate: Math.random() * 90 - 45 }}
              animate={{ x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 }}
              transition={{ 
                duration: 1.2, 
                ease: "easeOut",
                delay: index * 0.1 
              }}
            />
          ))}
        </svg>
      </div>
      
      <h1 className="text-2xl font-bold mb-4 tracking-wider text-[#7b85f5] flex gap-[2px]">
        {text.map((char, index) => (
          <motion.span
            key={index}
            initial={{ 
              x: textDirections[index].x, 
              y: textDirections[index].y, 
              opacity: 0,
              rotate: Math.random() * 180 - 90
            }}
            animate={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
            transition={{ 
              duration: 1, 
              ease: "easeOut",
              delay: 0.5 + index * 0.1 
            }}
            className="inline-block"
          >
            {char}
          </motion.span>
        ))}
      </h1>
    </div>
  );
};
