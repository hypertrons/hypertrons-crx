import { CollectionButton } from './CollectionButton';
import { CollectionManageModal } from './CollectionModal';
import { RepoCollectionProvider } from './context';
import { CollectionDisplayModal } from './CollectionModal/CollectionDisplayModal';

import React from 'react';

interface Props {
  repoName: string;
}

const View = ({ repoName }: Props) => {
  return (
    <RepoCollectionProvider currentRepositoryId={repoName}>
      <CollectionButton />
      <CollectionManageModal />
      <CollectionDisplayModal />
    </RepoCollectionProvider>
  );
};

export default View;
