import React from 'react';
import { motion } from 'framer-motion';
import { QrCode, Map, Navigation, Compass, Settings } from 'lucide-react';

interface GlassDockProps {
  onAction: (action: string) => void;
  activeMode: string;
}

const dockItems = [
  { id: 'qr', icon: QrCode, label: 'QR Scanner', color: '#007AFF' },
  { id: 'map', icon: Map, label: 'Map View', color: '#34C759' },
  { id: 'navigate', icon: Navigation, label: 'Navigate', color: '#FF9500' },
  { id: 'compass', icon: Compass, label: 'Compass', color: '#AF52DE' },
  { id: 'settings', icon: Settings, label: 'Settings', color: '#8E8E93' },
];

const GlassDock: React.FC<GlassDockProps> = ({ onAction, activeMode }) => {
  return (
    <div className="glass-dock">
      <motion.div 
        className="dock-container"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {dockItems.map((item, index) => (
          <motion.div
            key={item.id}
            className={`dock-item ${activeMode === item.id ? 'active' : ''}`}
            whileHover={{ 
              scale: 1.2, 
              y: -8,
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onAction(item.id)}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ 
              duration: 0.4, 
              delay: index * 0.1,
              ease: "easeOut" 
            }}
          >
            <div className="dock-item-background" style={{ backgroundColor: item.color + '20' }}>
              <item.icon 
                size={24} 
                color={activeMode === item.id ? '#ffffff' : item.color}
                strokeWidth={2}
              />
            </div>
            
            {/* Tooltip */}
            <motion.div 
              className="dock-tooltip"
              initial={{ opacity: 0, y: 10 }}
              whileHover={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {item.label}
            </motion.div>

            {/* Active indicator */}
            {activeMode === item.id && (
              <motion.div 
                className="active-indicator"
                layoutId="activeIndicator"
                transition={{ duration: 0.3, ease: "easeInOut" }}
              />
            )}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default GlassDock;