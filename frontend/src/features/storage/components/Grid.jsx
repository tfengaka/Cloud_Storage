import React from 'react';
import PropTypes from 'prop-types';

function Grid({ col, mdCol, gap, children }) {
  const style = {
    gap: gap ? `${gap}px` : '0',
  };
  const gmdCol = mdCol ? `grid-col-md-${mdCol}` : '';
  const gcol = col ? `grid-col-${col}` : '';
  return (
    <div className={`grid ${gcol} ${gmdCol} `} style={style}>
      {children}
    </div>
  );
}

Grid.propTypes = {
  col: PropTypes.number.isRequired,
  mdCol: PropTypes.number,
  gap: PropTypes.number,
  children: PropTypes.node.isRequired,
};

export default Grid;
