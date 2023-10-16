import { createContext } from 'react';

export type CollectionDataType = {
  name: string;
  repos: string[];
  key: string;
};

export type CollectionTabType = {
  label: string;
  children: string;
  key: string;
};

// TODO: complete the interface
export const CollectionContext = createContext<any>(null);
