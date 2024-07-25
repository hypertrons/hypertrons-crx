import React from 'react';

interface TableProps {
  adjacentNodes: [string, number][];
}

const Table: React.FC<TableProps> = ({ adjacentNodes }) => {
  return (
    <div>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid white' }}>Related Repository</th>
            <th style={{ border: '1px solid white' }}>Relation value</th>
          </tr>
        </thead>
        <tbody>
          {adjacentNodes.map((node, index) => (
            <tr key={index}>
              <td style={{ border: '1px solid white', textAlign: 'center', verticalAlign: 'middle' }}>{node[0]}</td>
              <td style={{ border: '1px solid white', textAlign: 'center', verticalAlign: 'middle' }}>{node[1]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
