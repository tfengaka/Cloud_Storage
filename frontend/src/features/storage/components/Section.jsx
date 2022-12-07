import React from 'react';

function Section({ title, children }) {
  return (
    <div className='drive_content_list'>
      <div className='drive_content_list-title'>
        <h4>{title}</h4>
      </div>
      {children}
    </div>
  );
}

export default Section;
