import React from 'react';
const Overlay = ({ isActive, opacity, children }) => {
  return (
    <div
      className={`overlay ${isActive ? 'active' : ''}`}
      style={{ backgroundColor: `rgba(0, 0, 0, ${opacity ? opacity : 0.5})` }}
    >
      {children}
    </div>
  );
};

export default Overlay;
