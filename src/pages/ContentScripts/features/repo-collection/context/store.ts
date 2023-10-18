export interface Repository {
  id: string;
  /** e.g. microsoft/vscode */
  fullName: string;
}

export interface Collection {
  id: string;
  name: string;
}

export interface Relation {
  repositoryId: Repository['id'];
  collectionId: Collection['id'];
}

const RELATIONS_STORE_KEY =
  'hypercrx:repo-collection:repository-collection-relations';
const COLLECTIONS_STORE_KEY = 'hypercrx:repo-collection:collections';

// TODO: delete other collections except for X-lab before the PR is merged
const defaultCollections: Collection[] = [
  {
    id: 'X-lab',
    name: 'X-lab',
  },
  {
    id: 'Hypertrons',
    name: 'Hypertrons',
  },
  {
    id: 'Mulan',
    name: 'Mulan',
  },
];
const defaultRelations: Relation[] = [
  {
    repositoryId: 'X-lab2017/open-digger',
    collectionId: 'X-lab',
  },
  {
    repositoryId: 'hypertrons/hypertrons-crx',
    collectionId: 'X-lab',
  },
  {
    repositoryId: 'hypertrons/hypertrons-crx',
    collectionId: 'Hypertrons',
  },
];

/**
 * Store for repo collection
 */
class RepoCollectionStore {
  private static instance: RepoCollectionStore;
  // a simple lock mechanism to prevent concurrent updates
  private isUpdatingRelations: boolean = false;
  private isUpdatingCollection: boolean = false;

  public static getInstance(): RepoCollectionStore {
    if (!RepoCollectionStore.instance) {
      RepoCollectionStore.instance = new RepoCollectionStore();
    }
    return RepoCollectionStore.instance;
  }

  public async addCollection(collection: Collection): Promise<void> {
    if (this.isUpdatingCollection) {
      // Another update is in progress, wait for it to finish
      await this.waitForUpdateToFinish();
    }

    this.isUpdatingCollection = true;

    try {
      const collections = await this.getAllCollections();
      collections.push(collection);
      await chrome.storage.sync.set({
        [COLLECTIONS_STORE_KEY]: collections,
      });
    } finally {
      this.isUpdatingCollection = false;
    }
  }

  public async removeCollection(collectionId: Collection['id']): Promise<void> {
    if (this.isUpdatingCollection) {
      // Another update is in progress, wait for it to finish
      await this.waitForUpdateToFinish();
    }

    this.isUpdatingCollection = true;

    try {
      const collections = await this.getAllCollections();
      const index = collections.findIndex((c) => c.id === collectionId);
      if (index === -1) {
        return;
      }
      // Remove its relations first
      const relations = await this.getAllRelations();
      relations.forEach((r) => {
        if (r.collectionId === collectionId) {
          this.removeRelations([r]);
        }
      });
      // Then remove the collection
      collections.splice(index, 1);
      await chrome.storage.sync.set({
        [COLLECTIONS_STORE_KEY]: collections,
      });
    } finally {
      this.isUpdatingCollection = false;
    }
  }

  public async getAllCollections(): Promise<Collection[]> {
    const collections = await chrome.storage.sync.get({
      [COLLECTIONS_STORE_KEY]: defaultCollections,
    });
    return collections[COLLECTIONS_STORE_KEY];
  }

  public async addRelations(relations: Relation[]): Promise<void> {
    if (this.isUpdatingRelations) {
      // Another update is in progress, wait for it to finish
      await this.waitForUpdateToFinish();
    }

    this.isUpdatingRelations = true;

    try {
      const allRelations = await this.getAllRelations();
      // Remove duplicate relations
      relations = relations.filter((r) => {
        return (
          allRelations.findIndex(
            (rr) =>
              rr.repositoryId === r.repositoryId &&
              rr.collectionId === r.collectionId
          ) === -1
        );
      });
      allRelations.push(...relations);
      await chrome.storage.sync.set({
        [RELATIONS_STORE_KEY]: allRelations,
      });
    } finally {
      this.isUpdatingRelations = false;
    }
  }

  public async removeRelations(relations: Relation[]): Promise<void> {
    if (this.isUpdatingRelations) {
      // Another update is in progress, wait for it to finish
      await this.waitForUpdateToFinish();
    }

    this.isUpdatingRelations = true;

    try {
      const allRelations = await this.getAllRelations();
      relations.forEach((r) => {
        const index = allRelations.findIndex(
          (rr) =>
            rr.repositoryId === r.repositoryId &&
            rr.collectionId === r.collectionId
        );
        if (index !== -1) {
          allRelations.splice(index, 1);
        }
      });
      await chrome.storage.sync.set({
        [RELATIONS_STORE_KEY]: allRelations,
      });
    } finally {
      this.isUpdatingRelations = false;
    }
  }

  public async getAllRelations(): Promise<Relation[]> {
    const relations = await chrome.storage.sync.get({
      [RELATIONS_STORE_KEY]: defaultRelations,
    });
    return relations[RELATIONS_STORE_KEY];
  }

  private async waitForUpdateToFinish(): Promise<void> {
    return new Promise((resolve) => {
      const check = () => {
        if (!this.isUpdatingRelations) {
          resolve();
        } else {
          setTimeout(check, 10); // Check again after a short delay
        }
      };
      check();
    });
  }
}

export const repoCollectionStore = RepoCollectionStore.getInstance();
