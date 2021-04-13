import { Octokit } from "@octokit/core";

export const getConfigFromGithub = async (owner: string, repo: string) => {
  const octokit = new Octokit();
  try {
    const response = await octokit.request('GET /repos/{owner}/{repo}/contents/.github/hypertrons.json', { owner, repo });
    const res = response.data as any;
    res.content = Buffer.from(res.content, 'base64').toString('ascii');
    return JSON.parse(res.content)["hypertrons-crx"];
  } catch (error: unknown) {
    return {};
  }
}
