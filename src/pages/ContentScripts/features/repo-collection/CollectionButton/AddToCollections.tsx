import { useRepoCollectionContext } from '../context';
import { Collection } from '../context/store';

import React, { useEffect, useState } from 'react';

const CheckListItem = (
  collection: Collection,
  onChange: (collectionId: Collection['id'], checked: boolean) => void,
  checked: boolean
) => {
  const handleChange = () => {
    onChange(collection.id, checked);
  };

  return (
    <div
      key={collection.id}
      className="form-checkbox mr-3 ml-6 ml-sm-5 mb-2 mt-0"
    >
      <label className="f5 text-normal">
        <input
          type="checkbox"
          value={collection.id}
          checked={checked}
          onChange={handleChange}
        />
        {collection.name}
      </label>
    </div>
  );
};

/**
 * The modal for quickly adding the current repository to exsiting collections (also for removing)
 */
export const AddToCollections = () => {
  const {
    currentRepositoryId,
    currentRepositoryCollections,
    allCollections,
    updaters,
    hideAddToCollections,
    setHideAddToCollections,
    setHideCollectionList,
    setShowModal,
  } = useRepoCollectionContext();

  const [checkedCollectionIds, setCheckedCollectionIds] = useState<
    Collection['id'][]
  >([]);

  const resetCheckboxes = () => {
    setCheckedCollectionIds(currentRepositoryCollections.map((c) => c.id));
  };

  // reset checkboxes when currentRepositoryCollections changes
  useEffect(() => {
    resetCheckboxes();
  }, [currentRepositoryCollections]);

  const handleCheckChange = (
    collectionId: Collection['id'],
    checked: boolean
  ) => {
    if (checked) {
      setCheckedCollectionIds(
        checkedCollectionIds.filter((id) => id !== collectionId)
      );
    } else {
      setCheckedCollectionIds([...checkedCollectionIds, collectionId]);
    }
  };

  const goToCollectionList = () => {
    setHideAddToCollections(true);
    setHideCollectionList(false);
  };

  const apply = () => {
    // add/remove relations
    const toAdd = checkedCollectionIds.filter(
      (id) => !currentRepositoryCollections.some((c) => c.id === id)
    );
    const toRemove = currentRepositoryCollections.filter(
      (c) => !checkedCollectionIds.includes(c.id)
    );
    toAdd &&
      updaters.addRelations(
        toAdd.map((id) => ({
          collectionId: id,
          repositoryId: currentRepositoryId,
        }))
      );
    toRemove &&
      updaters.removeRelations(
        toRemove.map((c) => ({
          collectionId: c.id,
          repositoryId: currentRepositoryId,
        }))
      );

    goToCollectionList();
  };

  const cancel = () => {
    resetCheckboxes();

    goToCollectionList();
  };

  const manage = () => {
    // open modal to manage collections
    setShowModal(true);
  };

  // if the ids of currentRepositoryCollections are the same as the ids of selectedCollectionIds, then the "Apply" button should be disabled
  let isApplyDisabled = true;
  if (currentRepositoryCollections.length !== checkedCollectionIds.length) {
    isApplyDisabled = false;
  } else {
    isApplyDisabled = currentRepositoryCollections.every((c) =>
      checkedCollectionIds.includes(c.id)
    );
  }

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
        {/* Checklist */}
        <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
          {allCollections.map((collection) => {
            const checked = checkedCollectionIds.includes(collection.id);
            return CheckListItem(collection, handleCheckChange, checked);
          })}
        </div>
        {/* 3 buttons */}
        <div className="pt-2 pb-3 px-3 d-flex flex-justify-start flex-row-reverse">
          <button
            disabled={isApplyDisabled}
            className="btn-primary btn-sm btn ml-2"
            onClick={apply}
          >
            Apply
          </button>
          <button className="btn-sm btn ml-2" onClick={cancel}>
            Cancel
          </button>
          <button className="btn-sm btn" onClick={manage}>
            Manage
          </button>
        </div>
      </div>
    </div>
  );
};
