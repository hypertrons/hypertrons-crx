import { Octokit } from "@octokit/core";
import { loadMetaData } from '../utils/metadata';

export const getConfigFromGithub = async (owner: string, repo: string) => {
  const metaData=await loadMetaData();
  let octokit;
  if(metaData.token!==""){
    octokit = new Octokit({ auth:metaData.token });
  }
  else{
    octokit = new Octokit();
  }
  try {
    const response = await octokit.request('GET /repos/{owner}/{repo}/contents/.github/hypertrons.json', { owner, repo });
    const res = response.data as any;
    res.content = Buffer.from(res.content, 'base64').toString('ascii');
    return JSON.parse(res.content)["hypertrons-crx"];
  } catch (error: unknown) {
    return {};
  }
}