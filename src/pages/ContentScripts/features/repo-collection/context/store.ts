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

const defaultCollections: Collection[] = [
  {
    id: 'X-lab',
    name: 'X-lab',
  },
  {
    id: 'Hypertrons',
    name: 'Hypertrons',
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

class RepoCollectionStore {
  private static instance: RepoCollectionStore;

  public static getInstance(): RepoCollectionStore {
    if (!RepoCollectionStore.instance) {
      RepoCollectionStore.instance = new RepoCollectionStore();
    }
    return RepoCollectionStore.instance;
  }

  public async addCollection(collection: Collection): Promise<void> {
    const collections = await this.getAllCollections();
    collections.push(collection);
    await chrome.storage.sync.set({
      [COLLECTIONS_STORE_KEY]: collections,
    });
  }

  public async removeCollection(collectionId: Collection['id']): Promise<void> {
    const collections = await this.getAllCollections();
    const index = collections.findIndex((c) => c.id === collectionId);
    if (index === -1) {
      return;
    }
    // remove its relations first
    const relations = await this.getAllRelations();
    relations.forEach((r) => {
      if (r.collectionId === collectionId) {
        this.removeRelation(r);
      }
    });
    // then remove the collection
    collections.splice(index, 1);
    await chrome.storage.sync.set({
      [COLLECTIONS_STORE_KEY]: collections,
    });
  }

  public async getAllCollections(): Promise<Collection[]> {
    const collections = await chrome.storage.sync.get({
      [COLLECTIONS_STORE_KEY]: defaultCollections,
    });
    return collections[COLLECTIONS_STORE_KEY];
  }

  public async addRelations(relations: Relation[]): Promise<void> {
    const allRelations = await this.getAllRelations();
    // remove duplicate relations
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
  }

  public async removeRelation(relation: Relation): Promise<void> {
    const relations = await this.getAllRelations();
    const index = relations.findIndex(
      (r) =>
        r.repositoryId === relation.repositoryId &&
        r.collectionId === relation.collectionId
    );
    if (index === -1) {
      return;
    }
    relations.splice(index, 1);
    await chrome.storage.sync.set({
      [RELATIONS_STORE_KEY]: relations,
    });
  }

  public async getAllRelations(): Promise<Relation[]> {
    const relations = await chrome.storage.sync.get({
      [RELATIONS_STORE_KEY]: defaultRelations,
    });
    return relations[RELATIONS_STORE_KEY];
  }
}

export const repoCollectionStore = RepoCollectionStore.getInstance();
