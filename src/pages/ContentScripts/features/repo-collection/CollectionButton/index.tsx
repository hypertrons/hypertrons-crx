import { Summary } from './Summary';

import React, { useState } from 'react';

/**
 * The entry of the repo collections feature
 */
export const CollectionButton = () => {
  return (
    <div className="f5 position-relative">
      <details className="details-reset details-overlay f5 position-relative">
        <Summary />
      </details>
    </div>
  );
};
