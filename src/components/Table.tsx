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
    whiteSpace: 'nowrap',
    padding: '3px',
  };

  const containerStyle: React.CSSProperties = {
    maxHeight: '360px',
    overflowY: 'auto',
    margin: '10px 0 20px 20px',
  };

  const column1Style: React.CSSProperties = {
    ...cellStyle,
    flex: '1 1 70%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };

  const column2Style: React.CSSProperties = {
    ...cellStyle,
    flex: '0 0 30%',
    textAlign: 'center',
  };

  return (
    <div style={containerStyle}>
      <table style={tableStyle}>
        <thead>
          <tr style={{ display: 'flex' }}>
            <th style={column1Style}>Related Repository</th>
            <th style={column2Style}>Relation value</th>
          </tr>
        </thead>
        <tbody>
          {adjacentNodes.map((node, index) => (
            <tr key={index} style={{ display: 'flex' }}>
              <td style={column1Style}>
                <a
                  href={`https://github.com/${node[0]}`}
                  style={{ color: 'inherit' }}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={node[0]}
                >
                  <img
                    src={`https://avatars.githubusercontent.com/${node[0].split('/')[0]}`}
                    alt="avatar"
                    style={{ width: '20px', height: '20px', marginRight: '10px', verticalAlign: 'middle' }}
                  />
                  {node[0]}
                </a>
              </td>
              <td style={column2Style}>{node[1]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
