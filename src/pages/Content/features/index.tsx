import elementReady from 'element-ready';
import * as pageDetect from 'github-url-detection';

const globalReady = async (): Promise<void> => {

  await elementReady('body', { waitForChildren: false });

  if (pageDetect.is404() || pageDetect.is500()) {
    return;
  }
}

const add = async (name: string, loader: any): Promise<void> => {
  await globalReady();
  const {
    include = [() => true], // Default: every page
    init
  } = loader;
  // If every `include` is false, don’t run the feature
  if (include.every((c: () => any) => !c())) {
    return;
  }
  try {
    console.log('loading ', name);
    await init();
  } catch (error: unknown) {
    console.error(error)
  }
}

const features = {
  add
};
export default features;