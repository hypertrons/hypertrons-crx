import { repoCollectionStore, Collection, Relation } from './store';

import { useState, useEffect } from 'react';

export const useStore = () => {
  const [allCollections, setAllCollections] = useState<Collection[]>([]);
  const [allRelations, setAllRelations] = useState<Relation[]>([]);

  const fetchAllCollections = async () => {
    const collections = await repoCollectionStore.getAllCollections();
    setAllCollections(collections);
  };

  const fetchAllRelations = async () => {
    const relations = await repoCollectionStore.getAllRelations();
    setAllRelations(relations);
  };

  const addRelations = async (relations: Relation[]) => {
    await repoCollectionStore.addRelations(relations);
    fetchAllRelations();
  };

  const removeRelations = async (relations: Relation[]) => {
    await repoCollectionStore.removeRelations(relations);
    fetchAllRelations();
  };

  const addCollection = async (collection: Collection) => {
    await repoCollectionStore.addCollection(collection);
    fetchAllCollections();
  };

  const removeCollection = async (collectionId: Collection['id']) => {
    await repoCollectionStore.removeCollection(collectionId);
    fetchAllCollections();
  };

  const updaters = {
    addRelations,
    removeRelations,
    addCollection,
    removeCollection,
  };

  useEffect(() => {
    fetchAllCollections();
    fetchAllRelations();
  }, []);

  return {
    allCollections,
    allRelations,
    updaters,
  };
};
