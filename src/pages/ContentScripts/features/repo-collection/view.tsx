import { CollectionButton } from './CollectionButton';
import { CollectionModal } from './CollectionModal';
import { RepoCollectionProvider } from './context';

import React from 'react';

const View = () => {
  return (
    <RepoCollectionProvider>
      <CollectionButton />
      <CollectionModal />
    </RepoCollectionProvider>
  );
};

export default View;
