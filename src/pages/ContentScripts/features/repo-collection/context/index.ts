import { useState } from 'react';
import constate from 'constate';

const useRepoCollection = () => {
  const [hideCollectionList, setHideCollectionList] = useState(false);
  const [hideAddToCollections, setHideAddToCollections] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<string>();

  return {
    hideCollectionList,
    setHideCollectionList,
    hideAddToCollections,
    setHideAddToCollections,

    showModal,
    setShowModal,
    selectedCollection,
    setSelectedCollection,
  };
};

export const [RepoCollectionProvider, useRepoCollectionContext] =
  constate(useRepoCollection);
