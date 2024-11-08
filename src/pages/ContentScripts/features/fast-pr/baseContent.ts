export const PR_TITLE = (file: string) => `docs: Update ${file}`;
export const PR_CONTENT = (file: string) => `Update ${file} by [FastPR](https://github.com/hypertrons/hypertrons-crx).`;
export const generateBranchName = () => `fastPR-${new Date().toISOString().replace(/:/g, '-').replace(/\..+/, '')}`;
export const COMMIT_MESSAGE_DOC = (branch: string, userName: string, userEmail: string) =>
  `docs: ${branch}\n\nSigned-off-by: ${userName.trim()} <${userEmail.trim()}>`.trim();
export const COMMIT_MESSAGE = (branch: string) => `docs: ${branch}`;
