import { CollectionButton } from './CollectionButton';
import { CollectionManageModal } from './CollectionModal';
import { RepoCollectionProvider } from './context';

import React from 'react';

interface Props {
  repoName: string;
}

const View = ({ repoName }: Props) => {
  return (
    <RepoCollectionProvider currentRepositoryId={repoName}>
      <CollectionButton />
      <CollectionManageModal />
    </RepoCollectionProvider>
  );
};

export default View;
