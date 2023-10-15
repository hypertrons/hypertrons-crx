import React, { useState } from 'react';
import { FundProjectionScreenOutlined } from '@ant-design/icons';

export const CollectionButton = () => {
  return (
    <div className="f5 position-relative">
      <details className="details-reset details-overlay f5 position-relative">
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
            2
          </span>
          <span className="dropdown-caret"></span>
        </summary>
      </details>
    </div>
  );
};
