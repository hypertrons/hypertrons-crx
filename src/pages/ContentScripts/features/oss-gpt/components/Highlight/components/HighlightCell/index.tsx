import classNames from 'classnames';
import { useStyles } from './style';
import React from 'react';
export interface HighlightCellProps {
  data: { index: number; value: string };
  emptyText?: string;
  onMouseDown?: React.MouseEventHandler;
  lineNumber?: boolean;
}

export default function HighlightCell({ data, emptyText, lineNumber = false, onMouseDown }: HighlightCellProps) {
  const { styles } = useStyles();
  const rowIndex: number = data?.index;

  return (
    <>
      {lineNumber ? <td className={classNames(styles.index)}>{rowIndex}</td> : null}
      <td
        onMouseDown={onMouseDown}
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: data?.value ?? (emptyText || '') }}
      />
    </>
  );
}
