import { CollectionContext } from '../context';

import React, { useContext } from 'react';

/**
 * The modal for quickly adding the current repository to exsiting collections (also for removing)
 */
export const AddToCollections = () => {
  const contextValue = useContext(CollectionContext);
  const {
    hideAddToCollections,
    setHideAddToCollections,
    setHideCollectionList,
  } = contextValue;

  const goToCollectionList = () => {
    setHideAddToCollections(true);
    setHideCollectionList(false);
  };

  const apply = () => {
    // TODO
  };

  const cancel = () => {
    // resetCheckboxes();
    goToCollectionList();
  };

  return (
    <div
      className="notifications-component-dialog"
      hidden={hideAddToCollections}
    >
      <div className="SelectMenu-modal notifications-component-dialog-modal overflow-visible">
        <header className="d-none d-sm-flex flex-items-start pt-1">
          <button
            className="border-0 px-2 pt-1 m-0 Link--secondary f5"
            style={{ backgroundColor: 'transparent' }}
            type="button"
            onClick={goToCollectionList}
          >
            <svg
              style={{ position: 'relative', left: '2px', top: '1px' }}
              aria-hidden="true"
              height="16"
              viewBox="0 0 16 16"
              version="1.1"
              width="16"
              className="octicon octicon-arrow-left"
            >
              <path d="M7.78 12.53a.75.75 0 0 1-1.06 0L2.47 8.28a.75.75 0 0 1 0-1.06l4.25-4.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042L4.81 7h7.44a.75.75 0 0 1 0 1.5H4.81l2.97 2.97a.75.75 0 0 1 0 1.06Z"></path>
            </svg>
          </button>

          <h1 className="pt-1 pr-4 pb-0 pl-0 f5 text-bold">
            Add to collections
          </h1>
        </header>
        <legend>
          <div className="text-small color-fg-muted pt-0 pr-3 pb-3 pl-6 pl-sm-5 border-bottom mb-3">
            Select collections you want the current repository to be added to.
          </div>
        </legend>
        <div className="form-checkbox mr-3 ml-6 ml-sm-5 mb-2 mt-0">
          <label className="f5 text-normal">
            <input type="checkbox" value="Hypertrons" checked />
            Hypertrons
          </label>
        </div>
        <div className="form-checkbox mr-3 ml-6 ml-sm-5 mb-2 mt-0">
          <label className="f5 text-normal">
            <input type="checkbox" value="X-lab" checked />
            X-lab
          </label>
        </div>
        <div className="form-checkbox mr-3 ml-6 ml-sm-5 mb-2 mt-0">
          <label className="f5 text-normal">
            <input type="checkbox" value="Mulan" />
            Mulan
          </label>
        </div>
        <div className="pt-2 pb-3 px-3 d-flex flex-justify-start flex-row-reverse">
          <button
            disabled={false}
            className="btn-primary btn-sm btn ml-2"
            onClick={apply}
          >
            Apply
          </button>
          <button className="btn-sm btn" onClick={cancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
