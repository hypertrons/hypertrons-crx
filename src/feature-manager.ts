import domLoaded from 'dom-loaded';
import stripIndent from 'strip-indent';
import { Promisable } from 'type-fest';
import * as pageDetect from 'github-url-detection';

import exists from './helpers/exists';
import waitFor from './helpers/wait-for';
import sleep from './helpers/sleep';
import isRestorationVisit from './helpers/is-restoration-visit';
import shouldFeatureRun, { ShouldRunConditions } from './helpers/should-feature-run';
import optionsStorage from './options-storage';
import { throttle } from 'lodash-es';

type FeatureInit = () => Promisable<void>;
type FeatureRestore = Function;

type FeatureLoader = {
  /**
   * Whether to wait for all DOMs to be ready before running `init`. Setting `false` makes `init` run
   * immediately when `body` is found.
   *
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

type InternalRunConfig = ShouldRunConditions & {
  init: FeatureInit;
};

const { version } = chrome.runtime.getManifest();

const logError = (id: string, error: unknown): void => {
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
const globalReady = new Promise<object>(async (resolve) => {
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

  const options = await optionsStorage.getAll();

  resolve(options);
});

const setupPageLoad = async (id: FeatureId, config: InternalRunConfig): Promise<void> => {
  const { asLongAs, include, exclude, init } = config;

  if (!(await shouldFeatureRun({ asLongAs, include, exclude }))) {
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
const getFeatureID = (url: string): FeatureId => {
  const prefix = 'hypercrx-';
  const pathComponents = url.split('/');
  let name = pathComponents.pop()!.split('.')[0];
  if (name === 'index' || name === 'gitee-index') {
    name = pathComponents.pop()!;
  }
  return `${prefix}${name}` as FeatureId;
};

/** Register a new feature */
const add = async (
  id: FeatureId,
  ...loaders: FeatureLoader[] // support multiple loaders for one feature, but currently only one is used
): Promise<void> => {
  /* Feature filtering and running */
  const options = await globalReady;

  // If the feature is disabled, skip it
  if (!options[id as keyof typeof options]) {
    log.info('↩️', 'Skipping', id);
    return;
  }

  for (const loader of loaders) {
    // Input defaults and validation
    const { asLongAs, include, exclude, init, restore, awaitDomReady = true } = loader;

    if (include?.length === 0) {
      throw new Error(`${id}: \`include\` cannot be an empty array, it means "run nowhere"`);
    }

    // 404 pages should only run 404-only features
    if (pageDetect.is404() && !include?.includes(pageDetect.is404) && !asLongAs?.includes(pageDetect.is404)) {
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

    const throttledHandler = throttle(async () => {
      if (isRestorationVisit()) {
        /** After experiments I believe turbo:render is fired after the render starts but not
         * after a render ends. So we need to wait for a while to make sure the DOM tree is
         * substituted with the cached one, otherwise all operations on DOM in restore() are
         * applied to the old DOM tree (before turbo:visit). turbo:load is also examined, but
         * it's fired after turbo:visit, not after a render ends. So it cannot be used as the
         * timing neither.
         */
        await sleep(10); // 10ms seems enough
      }
      // if a feature doesn't exist in DOM, try loading it since it might be expected in current page
      if (!exists(`#${id}`)) {
        setupPageLoad(id, details);
      } else {
        // if already exists, either it's not removed from DOM after a turbo:visit or the
        // current visit is a restoration visit. For the second case, we should handle.
        if (restore && isRestorationVisit()) {
          restore();
        }
      }
    }, 200);

    /**
     * Features are targeted to different GitHub pages, so they will not be all loaded at once.
     * They should be loaded as needed, however, `add()` only runs once for each feature. So
     * how to load features after a turbo:visit? The answer is to make use of turbo events.
     */
    document.addEventListener('turbo:render', throttledHandler);
  }
};

const features = {
  add,
  log,
  getFeatureID,
};

export default features;
