import { useRepoCollectionContext } from '../context';
import { Collection } from '../context/store';

import React from 'react';

const ListItem = (
  collection: Collection,
  onClick: (collectionId: Collection['id']) => void
) => {
  const handleClick = () => {
    onClick(collection.id);
  };

  return (
    <div
      key={collection.id}
      className="SelectMenu-item flex-items-start btn border-0 rounded-0"
      onClick={handleClick}
    >
      <span className="text-small text-normal wb-break-all">
        {collection.name}
      </span>
    </div>
  );
};

/**
 * The modal that shows the collections that the repo belongs to
 */
export const CollectionList = () => {
  const {
    currentRepositoryCollections,
    hideCollectionList,
    setHideAddToCollections,
    setHideCollectionList,
    setSelectedCollection,
    setShowDisplayModal,
  } = useRepoCollectionContext();

  const handleCollectionClick = (collectionId: Collection['id']) => {
    setSelectedCollection(collectionId);
    setShowDisplayModal(true);
  };

  const goToAddToCollections = () => {
    setHideAddToCollections(false);
    setHideCollectionList(true);
  };

  return (
    <div className="SelectMenu" hidden={hideCollectionList}>
      <div className="SelectMenu-modal">
        <button
          className="SelectMenu-closeButton position-absolute right-0 m-2"
          type="button"
          data-toggle-for="collection-button-details"
        >
          <svg
            aria-hidden="true"
            height="16"
            viewBox="0 0 16 16"
            version="1.1"
            width="16"
            data-view-component="true"
            className="octicon octicon-x"
          >
            <path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L9.06 8l3.22 3.22a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L8 9.06l-3.22 3.22a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z"></path>
          </svg>
        </button>
        <div className="d-flex flex-column flex-1 overflow-hidden">
          <div className="SelectMenu-list">
            {/* header */}
            <header className="SelectMenu-header">
              <h3 className="SelectMenu-title">
                Contained in these collections
              </h3>
              <button
                className="SelectMenu-closeButton"
                type="button"
                aria-label="Close menu"
                data-toggle-for="collection-button-details"
              >
                <svg
                  aria-hidden="true"
                  height="16"
                  viewBox="0 0 16 16"
                  version="1.1"
                  width="16"
                  data-view-component="true"
                  className="octicon octicon-x"
                >
                  <path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L9.06 8l3.22 3.22a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L8 9.06l-3.22 3.22a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z"></path>
                </svg>
              </button>
            </header>
            {/* list */}
            <div className="overflow-y-auto" style={{ maxHeight: '340px' }}>
              {currentRepositoryCollections.map((collection) =>
                ListItem(collection, handleCollectionClick)
              )}
            </div>
            {/* footer */}
            <footer className="SelectMenu-footer p-0 position-sticky">
              <div
                className="SelectMenu-item btn rounded-0 border-bottom-0 text-normal f6"
                onClick={goToAddToCollections}
              >
                <svg
                  width="20"
                  aria-hidden="true"
                  height="16"
                  viewBox="0 0 16 16"
                  version="1.1"
                  data-view-component="true"
                  className="octicon octicon-plus mr-2 text-center"
                >
                  <path d="M7.75 2a.75.75 0 0 1 .75.75V7h4.25a.75.75 0 0 1 0 1.5H8.5v4.25a.75.75 0 0 1-1.5 0V8.5H2.75a.75.75 0 0 1 0-1.5H7V2.75A.75.75 0 0 1 7.75 2Z"></path>
                </svg>
                Add to collections
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};
