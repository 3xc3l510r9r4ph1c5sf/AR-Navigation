import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Destination {
  id: string;
  name: string;
  floor: string;
  position: [number, number, number];
}

interface ARSceneProps {
  userPosition: [number, number, number];
  destination: Destination | null;
  isNavigating: boolean;
  onPositionUpdate: (position: [number, number, number]) => void;
}

const ARScene: React.FC<ARSceneProps> = ({ 
  userPosition, 
  destination, 
  isNavigating, 
  onPositionUpdate 
}) => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const [pathPoints, setPathPoints] = useState<[number, number, number][]>([]);

  // Simulate user movement
  useEffect(() => {
    if (!isNavigating) return;

    const interval = setInterval(() => {
      onPositionUpdate(prev => [
        prev[0] + (Math.random() - 0.5) * 0.1,
        prev[1],
        prev[2] + (Math.random() - 0.5) * 0.1
      ]);
    }, 1000);

    return () => clearInterval(interval);
  }, [isNavigating, onPositionUpdate]);

  // Generate navigation path
  useEffect(() => {
    if (!destination) {
      setPathPoints([]);
      return;
    }

    const points: [number, number, number][] = [];
    const [startX, startY, startZ] = userPosition;
    const [endX, endY, endZ] = destination.position;
    
    // Simple path generation - in reality this would use the vertex graph
    const steps = 10;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      points.push([
        startX + (endX - startX) * t,
        startY + (endY - startY) * t,
        startZ + (endZ - startZ) * t
      ]);
    }
    
    setPathPoints(points);
  }, [userPosition, destination]);

  const to3DPosition = (pos: [number, number, number]) => {
    const scale = 40; // Scale factor for visualization
    const centerX = 300;
    const centerY = 300;
    
    return {
      left: centerX + pos[0] * scale,
      top: centerY + pos[2] * scale, // Use Z for top position
      transform: `translateZ(${pos[1] * scale}px)`
    };
  };

  return (
    <div className="ar-scene" ref={sceneRef}>
      {/* Grid Background */}
      <div className="ar-grid">
        {Array.from({ length: 20 }, (_, i) => (
          <div key={`h-${i}`} className="grid-line horizontal" style={{ top: `${i * 5}%` }} />
        ))}
        {Array.from({ length: 20 }, (_, i) => (
          <div key={`v-${i}`} className="grid-line vertical" style={{ left: `${i * 5}%` }} />
        ))}
      </div>

      {/* User Position */}
      <motion.div 
        className="user-marker"
        style={to3DPosition(userPosition)}
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 360]
        }}
        transition={{ 
          scale: { duration: 2, repeat: Infinity },
          rotate: { duration: 4, repeat: Infinity, ease: "linear" }
        }}
      >
        <div className="user-dot"></div>
        <div className="user-pulse"></div>
      </motion.div>

      {/* Destination Marker */}
      {destination && (
        <motion.div 
          className="destination-marker"
          style={to3DPosition(destination.position)}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="destination-icon">📍</div>
          <div className="destination-label">{destination.name}</div>
        </motion.div>
      )}

      {/* Navigation Path */}
      {isNavigating && pathPoints.length > 0 && (
        <svg className="navigation-path" width="100%" height="100%">
          <defs>
            <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#007AFF" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#FF9500" stopOpacity="0.8" />
            </linearGradient>
          </defs>
          <path
            d={`M ${pathPoints.map(point => {
              const pos = to3DPosition(point);
              return `${pos.left},${pos.top}`;
            }).join(' L ')}`}
            stroke="url(#pathGradient)"
            strokeWidth="3"
            fill="none"
            strokeDasharray="10,5"
            className="animated-path"
          />
        </svg>
      )}

      {/* Navigation Arrows */}
      {isNavigating && pathPoints.slice(1, -1).map((point, index) => (
        <motion.div
          key={index}
          className="nav-arrow"
          style={to3DPosition(point)}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: [0.8, 1, 0.8], 
            opacity: [0.6, 1, 0.6] 
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            delay: index * 0.2 
          }}
        >
          ➤
        </motion.div>
      ))}

      {/* Floating Icons (Points of Interest) */}
      <motion.div 
        className="poi-marker"
        style={to3DPosition([3, 0.5, 2])}
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <div className="poi-icon">🏪</div>
        <div className="poi-label">Shop</div>
      </motion.div>

      <motion.div 
        className="poi-marker"
        style={to3DPosition([-2, 0.5, -3])}
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, delay: 1 }}
      >
        <div className="poi-icon">🚻</div>
        <div className="poi-label">Restroom</div>
      </motion.div>
    </div>
  );
};

export default ARScene;