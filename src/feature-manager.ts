import $ from 'jquery';
import domLoaded from 'dom-loaded';
import stripIndent from 'strip-indent';
import { Promisable } from 'type-fest';
import * as pageDetect from 'github-url-detection';

import waitFor from './helpers/wait-for';
import { shouldFeatureRun } from './github-helpers';

type BooleanFunction = () => boolean;
type FeatureInit = () => Promisable<void>;

type FeatureLoader = {
  /** Whether to wait for DOM ready before running `init`. `false` makes `init` run right as soon as `body` is found.
   * @default true
   */
  awaitDomReady?: boolean;

  /** When pressing the back button, DOM changes and listeners are still there. Using a selector here would use the integrated deduplication logic.
   * @default false
   */
  deduplicate?: string;

  init: FeatureInit; // Repeated here because this interface is Partial<>
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

  if ($('html.hypercrx').length > 0) {
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

const getFeatureID = (url: string): FeatureID =>
  `hypercrx-${url.split('/').pop()!.split('.')[0]}` as FeatureID;

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
      awaitDomReady = true,
      deduplicate = false,
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
      void setupPageLoad(id, details);
    }

    document.addEventListener('turbo:render', () => {
      if (!deduplicate || !($(deduplicate).length > 0)) {
        void setupPageLoad(id, details);
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
