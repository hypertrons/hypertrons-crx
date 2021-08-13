import React from 'react';
import { Stack } from '@fluentui/react';

interface SimpleTableProps {
  theme: 'light' | 'dark';
  title: string;
  keys: string[];
  values: number[];
}

const SimpleTable: React.FC<SimpleTableProps> = (props) => {
  const { theme, title, keys, values } = props;

  const tableContainerStyle: React.CSSProperties = {
    width: '90%',
    marginLeft: '5%',
    marginRight: '5%',
  };

  const tableTitleStyle: React.CSSProperties = {
    margin: 0,
    marginBottom: 5,
    color: theme == 'light' ? '#010409' : '#f0f6fc',
  };

  const tableLineStyle: React.CSSProperties = {
    height: '2px',
    backgroundColor: theme == 'light' ? 'darkblue' : '#58a6ff',
    marginTop: '1px',
    marginBottom: '1px',
  };

  const tableKeyStyle: React.CSSProperties = {
    fontSize: 15,
    color: theme == 'light' ? '#010409' : '#f0f6fc',
    fontWeight: 'bold',
  };

  const tableValueStyle: React.CSSProperties = {
    fontSize: 15,
    color: theme == 'light' ? '#010409' : '#f0f6fc',
    fontStyle: 'italic',
  };

  return (
    <div style={tableContainerStyle}>
      <Stack>
        <Stack.Item align="center">
          <h3 style={tableTitleStyle}>{title}</h3>
        </Stack.Item>
      </Stack>
      <div style={tableLineStyle} />
      {keys.map((item: any, index: any) => {
        return (
          <Stack
            horizontal
            horizontalAlign="space-between"
            key={`keys-${index}`}
          >
            <div style={tableKeyStyle}>{item}</div>
            <div style={tableValueStyle}>{numFormat(values[index], 1)}</div>
          </Stack>
        );
      })}
      <div style={tableLineStyle} />
    </div>
  );
};

const numFormat = (num: number, digits: number) => {
  let si = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'k' },
  ];
  let rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  let i;
  for (i = si.length - 1; i > 0; i--) {
    if (num >= si[i].value) {
      break;
    }
  }
  return (num / si[i].value).toFixed(digits).replace(rx, '$1') + si[i].symbol;
};

export default SimpleTable;
