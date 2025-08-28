import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassDock from './components/GlassDock';
import ARScene from './components/ARScene';
import NavigationPanel from './components/NavigationPanel';
import './App.css';

interface Destination {
  id: string;
  name: string;
  floor: string;
  position: [number, number, number];
}

const destinations: Destination[] = [
  { id: 'entrance', name: 'Main Entrance', floor: 'Ground Floor', position: [0, 0, 0] },
  { id: 'cafeteria', name: 'Cafeteria', floor: 'Ground Floor', position: [5, 0, 3] },
  { id: 'library', name: 'Library', floor: 'First Floor', position: [-3, 0, 4] },
  { id: 'auditorium', name: 'Auditorium', floor: 'Ground Floor', position: [8, 0, -2] },
  { id: 'lab', name: 'Computer Lab', floor: 'Second Floor', position: [-5, 0, -3] },
];

function App() {
  const [activeMode, setActiveMode] = useState<string>('navigate');
  const [isNavigating, setIsNavigating] = useState(false);
  const [currentDestination, setCurrentDestination] = useState<Destination | null>(null);
  const [showPanel, setShowPanel] = useState(false);
  const [arConnected, setArConnected] = useState(true);
  const [userPosition, setUserPosition] = useState<[number, number, number]>([0, 0, 0]);

  const handleDockAction = (action: string) => {
    setActiveMode(action);
    
    switch (action) {
      case 'qr':
        // Simulate QR code scanning
        setTimeout(() => {
          setArConnected(true);
          setUserPosition([Math.random() * 4 - 2, 0, Math.random() * 4 - 2]);
        }, 1500);
        break;
      case 'map':
        setShowPanel(true);
        break;
      case 'navigate':
        if (!currentDestination) {
          setShowPanel(true);
        }
        break;
      case 'compass':
        // Compass functionality
        break;
      case 'settings':
        // Settings functionality
        break;
    }
  };

  const handleDestinationSelect = (destination: Destination) => {
    setCurrentDestination(destination);
    setIsNavigating(true);
    setShowPanel(false);
  };

  const calculateDistance = () => {
    if (!currentDestination) return 0;
    const [x1, y1, z1] = userPosition;
    const [x2, y2, z2] = currentDestination.position;
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2 + (z2 - z1) ** 2);
  };

  return (
    <div className="app">
      {/* Status Bar */}
      <div className="status-bar">
        <div className="status-left">
          <div className={`ar-status ${arConnected ? 'connected' : 'disconnected'}`}>
            <div className="status-dot"></div>
            AR {arConnected ? 'Connected' : 'Disconnected'}
          </div>
        </div>
        <div className="status-center">
          {currentDestination && (
            <div className="destination-info">
              <span className="destination-name">{currentDestination.name}</span>
              <span className="destination-distance">{calculateDistance().toFixed(1)}m</span>
            </div>
          )}
        </div>
        <div className="status-right">
          <div className="battery">100%</div>
        </div>
      </div>

      {/* AR Scene */}
      <ARScene 
        userPosition={userPosition}
        destination={currentDestination}
        isNavigating={isNavigating}
        onPositionUpdate={setUserPosition}
      />

      {/* Navigation Panel */}
      <AnimatePresence>
        {showPanel && (
          <NavigationPanel
            destinations={destinations}
            onDestinationSelect={handleDestinationSelect}
            onClose={() => setShowPanel(false)}
          />
        )}
      </AnimatePresence>

      {/* Glass Dock */}
      <GlassDock onAction={handleDockAction} activeMode={activeMode} />

      {/* Compass Widget */}
      <div className="compass-widget">
        <div className="compass-ring">
          <div className="compass-needle"></div>
          <div className="compass-label">N</div>
        </div>
      </div>
    </div>
  );
}

export default App;