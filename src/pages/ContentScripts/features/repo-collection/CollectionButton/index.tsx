import { ButtonContent } from './ButtonCotent';
import { CollectionList } from './CollectionList';
import { AddToCollections } from './AddToCollections';

import React, { useState } from 'react';

/**
 * The entry of the repo collections feature
 */
export const CollectionButton = () => {
  return (
    <div className="f5 position-relative">
      <details
        id="collection-button-details"
        className="details-reset details-overlay f5 position-relative"
      >
        <summary className="btn-sm btn" role="button">
          <ButtonContent />
        </summary>
        <CollectionList />
        {/* <AddToCollections /> */}
      </details>
    </div>
  );
};
