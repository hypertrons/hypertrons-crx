import domLoaded from 'dom-loaded';
import stripIndent from 'strip-indent';
import { Promisable } from 'type-fest';
import * as pageDetect from 'github-url-detection';

import exists from './helpers/exsists';
import waitFor from './helpers/wait-for';
import isRestorationVisit from './helpers/is-restoration-visit';
import shouldFeatureRun from './helpers/should-feature-run';

type BooleanFunction = () => boolean;
type FeatureInit = () => Promisable<void>;
type FeatureRestore = Function;

type FeatureLoader = {
  /** Whether to wait for DOM ready before running `init`. `false` makes `init` run right as soon as `body` is found.
   * @default true
   */
  awaitDomReady?: boolean;
  init: FeatureInit; // Repeated here because this interface is Partial<>
  /**
   * Will be called after a restoration turbo:visit, if provided.
   *
   * Clicking forward/back button in browser triggers a restoration turbo:visit, which will restore
   * a page directly from cache. Some of the features injected by Hypercrx, however, cannot be fully
   * restored. Hence extra code(i.e. `restore`) is needed to keep features always behaving right.
   */
  restore?: FeatureRestore;
} & Partial<InternalRunConfig>;

type InternalRunConfig = {
  asLongAs: BooleanFunction[] | undefined;
  include: BooleanFunction[] | undefined;
  exclude: BooleanFunction[] | undefined;
  init: FeatureInit;
};

const { version } = chrome.runtime.getManifest();

const logError = (url: string, error: unknown): void => {
  const id = getFeatureID(url);
  const message = error instanceof Error ? error.message : String(error);

  if (message.includes('token')) {
    console.log('ℹ️', id, '→', message);
    return;
  }

  // Don't change this to `throw Error` because Firefox doesn't show extensions' errors in the console
  console.group(`❌ ${id}`); // Safari supports only one parameter
  console.log(`📕 ${version} →`, error); // One parameter improves Safari formatting
  console.groupEnd();
};

const log = {
  info: console.log,
  http: console.log,
  error: logError,
};

// eslint-disable-next-line no-async-promise-executor -- Rule assumes we don't want to leave it pending
const globalReady = new Promise<void>(async (resolve) => {
  await waitFor(() => document.body);

  if (pageDetect.is500() || pageDetect.isPasswordConfirmation()) {
    return;
  }

  if (exists('html.hypercrx')) {
    console.warn(
      stripIndent(`
      Hypercrx has been loaded twice. This may be because:

      • You also loaded the developer version

      If you see this at every load, please open an issue in our repository.`)
    );
    return;
  }

  document.documentElement.classList.add('hypercrx');

  resolve();
});

const setupPageLoad = async (
  id: FeatureID,
  config: InternalRunConfig
): Promise<void> => {
  const { asLongAs, include, exclude, init } = config;

  if (!shouldFeatureRun({ asLongAs, include, exclude })) {
    return;
  }

  const runFeature = async (): Promise<void> => {
    try {
      await init();
      log.info('✅', id);
    } catch (error) {
      log.error(id, error);
    }
  };

  await runFeature();
};

// url can be in forms of: "foo/bar/feature-name.tsx" or "foo/bar/feature-name/index.tsx".
// This function extracts "feature-name" in url and prefixes it with "hypercrx-".
const getFeatureID = (url: string): FeatureID => {
  const prefix = 'hyperxrx-';
  const pathComponents = url.split('/');
  let name = pathComponents.pop()!.split('.')[0];
  if (name === 'index') {
    name = pathComponents.pop()!;
  }
  return `${prefix}${name}` as FeatureID;
};

/** Register a new feature */
const add = async (
  id: FeatureID,
  ...loaders: FeatureLoader[]
): Promise<void> => {
  /* Feature filtering and running */
  await globalReady;

  for (const loader of loaders) {
    // Input defaults and validation
    const {
      asLongAs,
      include,
      exclude,
      init,
      restore,
      awaitDomReady = true,
    } = loader;

    if (include?.length === 0) {
      throw new Error(
        `${id}: \`include\` cannot be an empty array, it means "run nowhere"`
      );
    }

    // 404 pages should only run 404-only features
    if (
      pageDetect.is404() &&
      !include?.includes(pageDetect.is404) &&
      !asLongAs?.includes(pageDetect.is404)
    ) {
      continue;
    }

    const details = {
      asLongAs,
      include,
      exclude,
      init,
    };
    if (awaitDomReady) {
      (async () => {
        await domLoaded;
        await setupPageLoad(id, details);
      })();
    } else {
      setupPageLoad(id, details);
    }

    /**
     * Features are targeted to different GitHub pages, so they will not be all run at once.
     * They should be run as needed, however, `add()` only runs once for each feature. So
     * how to load features after a turbo:visit? The answer is to make use of turbo events.
     */
    document.addEventListener('turbo:render', () => {
      // if a feature doesn't exisit in DOM, try loading it since it might be expected in current page
      if (!exists(`#${id}`)) {
        setupPageLoad(id, details);
      } else {
        // if already exisits, either it's not removed from DOM after a turbo:visit or the
        // current visit is a restoration visit. For the second case, we should take care.
        if (restore && isRestorationVisit()) {
          restore();
        }
      }
    });
  }
};

const features = {
  add,
  log,
  getFeatureID,
};

export default features;
