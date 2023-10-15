import { CollectionButton } from './CollectionButton';
import { CollectionModal } from './CollectionModal';
import { CollectionContext } from './context';

import React, { useState } from 'react';

const View = () => {
  const [hideCollectionList, setHideCollectionList] = useState(false);
  const [hideAddToCollections, setHideAddToCollections] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<string>();

  const contextValue = {
    hideCollectionList,
    setHideCollectionList,
    hideAddToCollections,
    setHideAddToCollections,

    showModal,
    setShowModal,
    selectedCollection,
    setSelectedCollection,
  };

  return (
    <CollectionContext.Provider value={contextValue}>
      <CollectionButton />
      <CollectionModal />
    </CollectionContext.Provider>
  );
};

export default View;
