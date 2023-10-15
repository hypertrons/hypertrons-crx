import { CollectionList } from './CollectionList';
import { AddToCollections } from './AddToCollections';

import React from 'react';
import { FundProjectionScreenOutlined } from '@ant-design/icons';

/**
 * The entry of the repo collections feature
 */
export const CollectionButton = () => {
  /** How many collections the repo belongs to */
  const collectionCount = 2;

  return (
    <div className="f5 position-relative">
      <details
        id="collection-button-details"
        className="details-reset details-overlay f5 position-relative"
      >
        <summary className="btn-sm btn" role="button">
          <span>
            <FundProjectionScreenOutlined
              style={{ fontSize: '14px', color: 'var(--color-fg-muted)' }}
            />
            {' Collections '}
          </span>
          <span
            data-pjax-replace="true" // not confirmed to be necessary
            data-turbo-replace="true" // this one, either.
            className="Counter"
          >
            {collectionCount}
          </span>
          <span className="dropdown-caret"></span>
        </summary>
        <CollectionList />
        <AddToCollections />
      </details>
    </div>
  );
};
