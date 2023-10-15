import { CollectionButton } from './CollectionButton';
import { CollectionModal } from './CollectionModal';
import { CollectionContext } from './context';

import React, { useState } from 'react';

const View = () => {
  const [hideCollectionList, setHideCollectionList] = useState(false);
  const [hideAddToCollections, setHideAddToCollections] = useState(true);

  const contextValue = {
    hideCollectionList,
    setHideCollectionList,
    hideAddToCollections,
    setHideAddToCollections,
  };

  return (
    <CollectionContext.Provider value={contextValue}>
      <CollectionButton />
      <CollectionModal />
    </CollectionContext.Provider>
  );
};

export default View;
