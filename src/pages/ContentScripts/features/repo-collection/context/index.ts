import { Repository } from './store';
import { useStore } from './useStore';

import { useState } from 'react';
import constate from 'constate';

const useRepoCollection = ({
  currentRepositoryId,
}: {
  currentRepositoryId: Repository['id'];
}) => {
  const { allCollections, allRelations, updaters } = useStore();
  // get all related collections for the current repository
  const currentRepositoryRelations = allRelations.filter(
    (r) => r.repositoryId === currentRepositoryId
  );
  const currentRepositoryCollections = allCollections.filter((c) =>
    currentRepositoryRelations.some((r) => r.collectionId === c.id)
  );

  const [hideCollectionList, setHideCollectionList] = useState(false);
  const [hideAddToCollections, setHideAddToCollections] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<string>();

  return {
    currentRepositoryId,
    currentRepositoryCollections,
    allCollections,
    allRelations,
    updaters,

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
