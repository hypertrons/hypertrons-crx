import React from 'react';
import { FundProjectionScreenOutlined } from '@ant-design/icons';

export const Summary = () => {
  /** How many collections the repo belongs to */
  const collectionCount = 2;

  return (
    <summary className="btn-sm btn" role="button">
      <span>
        <FundProjectionScreenOutlined
          style={{ fontSize: '14px', color: 'var(--color-fg-muted)' }}
        />
        {' Collections '}
      </span>
      <span
        data-pjax-replace="true"
        data-turbo-replace="true"
        title="14"
        className="Counter"
      >
        {collectionCount}
      </span>
      <span className="dropdown-caret"></span>
    </summary>
  );
};
