import { CollectionButton } from './CollectionButton';
import { CollectionModal } from './CollectionModal';
import { RepoCollectionProvider } from './context';

import React from 'react';

interface Props {
  repoName: string;
}

const View = ({ repoName }: Props) => {
  return (
    <RepoCollectionProvider currentRepositoryId={repoName}>
      <CollectionButton />
      <CollectionModal />
    </RepoCollectionProvider>
  );
};

export default View;
