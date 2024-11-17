import React from 'react';

const DataNotFound = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'var(--color-fg-muted)',
      }}
    >
      <h3>Data Not Found</h3>
      <div style={{ width: '300px', margin: '2em' }}>
        <p>Possible reasons are:</p>
        <ul style={{ marginLeft: '1em' }}>
          <li>This repository is too new, so its data has not been generated</li>
          <li>This repository is not active enough, so its data are not generated</li>
        </ul>
      </div>
    </div>
  );
};

export default DataNotFound;
