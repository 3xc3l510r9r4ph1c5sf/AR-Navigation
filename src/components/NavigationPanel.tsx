import React from 'react';
import { motion } from 'framer-motion';
import { X, MapPin, Building } from 'lucide-react';

interface Destination {
  id: string;
  name: string;
  floor: string;
  position: [number, number, number];
}

interface NavigationPanelProps {
  destinations: Destination[];
  onDestinationSelect: (destination: Destination) => void;
  onClose: () => void;
}

const NavigationPanel: React.FC<NavigationPanelProps> = ({
  destinations,
  onDestinationSelect,
  onClose
}) => {
  return (
    <motion.div 
      className="navigation-panel-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className="navigation-panel"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="panel-header">
          <h2>Select Destination</h2>
          <button className="close-button" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="destinations-list">
          {destinations.map((destination, index) => (
            <motion.div
              key={destination.id}
              className="destination-item"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onDestinationSelect(destination)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="destination-icon">
                <MapPin size={20} color="#007AFF" />
              </div>
              <div className="destination-info">
                <h3>{destination.name}</h3>
                <div className="destination-floor">
                  <Building size={14} />
                  <span>{destination.floor}</span>
                </div>
              </div>
              <div className="destination-arrow">→</div>
            </motion.div>
          ))}
        </div>

        <div className="panel-footer">
          <div className="search-section">
            <input 
              type="text" 
              placeholder="Search by room number or name..."
              className="search-input"
            />
          </div>
          
          <div className="quick-actions">
            <button className="quick-action-btn">
              <span>📱</span>
              Scan QR Code
            </button>
            <button className="quick-action-btn">
              <span>🗺️</span>
              View Full Map
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default NavigationPanel;