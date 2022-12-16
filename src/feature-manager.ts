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
   * Clicking forward/back button in browser triggers a restoration turbo:visit, which will
   * restore a page directly from cache. Elements injected by Hypercrx, however, cannot be
   * all correctly restored. So we need to do some extra work to make features behave right.
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

    document.addEventListener('turbo:render', () => {
      if (!exists(`#${id}`)) {
        setupPageLoad(id, details);
      }
      if (restore && isRestorationVisit()) {
        restore();
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
