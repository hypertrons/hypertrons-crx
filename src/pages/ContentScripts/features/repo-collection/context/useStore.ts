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

  const removeRelation = async (relation: Relation) => {
    await repoCollectionStore.removeRelation(relation);
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
    removeRelation,
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
