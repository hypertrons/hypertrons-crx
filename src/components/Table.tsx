import React from 'react';

interface TableProps {
  adjacentNodes: [string, number][];
}

const Table: React.FC<TableProps> = ({ adjacentNodes }) => {
  const tableStyle: React.CSSProperties = {
    borderCollapse: 'collapse',
    width: '100%',
    margin: '10px 0',
  };

  const cellStyle: React.CSSProperties = {
    textAlign: 'left',
    verticalAlign: 'middle',
  };

  const containerStyle: React.CSSProperties = {
    maxHeight: '360px',
    overflowY: 'auto',
    margin: '10px 0 20px 20px',
  };

  return (
    <div style={containerStyle}>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={cellStyle}>Related Repository</th>
            <th style={{ ...cellStyle, textAlign: 'center' }}>Relation value</th>
          </tr>
        </thead>
        <tbody>
          {adjacentNodes.map((node, index) => (
            <tr key={index}>
              <td style={cellStyle}>
                <a
                  href={`https://github.com/${node[0]}`}
                  style={{ color: 'inherit' }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={`https://avatars.githubusercontent.com/${node[0].split('/')[0]}`}
                    alt="avatar"
                    style={{ width: '20px', height: '20px', marginRight: '10px', verticalAlign: 'middle' }}
                  />
                  {node[0]}
                </a>
              </td>
              <td style={{ ...cellStyle, textAlign: 'center' }}>{node[1]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
