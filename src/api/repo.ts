import { OSS_XLAB_ENDPOINT } from '../constant';
import request from '../utils/request';

// metric names and their implementation names in OpenDigger
const metricNameMap = new Map([
  ['activity', 'activity'],
  ['openrank', 'openrank'],
  ['participant', 'participants'],
  ['forks', 'technical_fork'],
  ['stars', 'stars'],
  ['issues_opened', 'issues_new'],
  ['issues_closed', 'issues_closed'],
  ['issue_comments', 'issue_comments'],
  ['PR_opened', 'change_requests'],
  ['PR_merged', 'change_requests_accepted'],
  ['PR_reviews', 'change_requests_reviews'],
  ['merged_code_addition', 'code_change_lines_add'],
  ['merged_code_deletion', 'code_change_lines_remove'],
  ['merged_code_sum', 'code_change_lines_sum'],
  ['developer_network', 'developer_network'],
  ['repo_network', 'repo_network'],
]);

const getMetricByName = async (repo: string, metric: string) => {
  const res = await request(
    `${OSS_XLAB_ENDPOINT}/open_digger/github/${repo}/${metricNameMap.get(
      metric
    )}.json`
  );
  return res.data;
};

export const getActivity = async (repo: string) => {
  return getMetricByName(repo, 'activity');
};

export const getOpenrank = async (repo: string) => {
  return getMetricByName(repo, 'openrank');
};

export const getParticipant = async (repo: string) => {
  return getMetricByName(repo, 'participant');
};

export const getForks = async (repo: string) => {
  return getMetricByName(repo, 'forks');
};

export const getStars = async (repo: string) => {
  return getMetricByName(repo, 'stars');
};

export const getIssuesOpened = async (repo: string) => {
  return getMetricByName(repo, 'issues_opened');
};

export const getIssuesClosed = async (repo: string) => {
  return getMetricByName(repo, 'issues_closed');
};

export const getIssueComments = async (repo: string) => {
  return getMetricByName(repo, 'issue_comments');
};

export const getPROpened = async (repo: string) => {
  return getMetricByName(repo, 'PR_opened');
};

export const getPRMerged = async (repo: string) => {
  return getMetricByName(repo, 'PR_merged');
};

export const getPRReviews = async (repo: string) => {
  return getMetricByName(repo, 'PR_reviews');
};

export const getMergedCodeAddition = async (repo: string) => {
  return getMetricByName(repo, 'merged_code_addition');
};

export const getMergedCodeDeletion = async (repo: string) => {
  return getMetricByName(repo, 'merged_code_deletion');
};

export const getMergedCodeSum = async (repo: string) => {
  return getMetricByName(repo, 'merged_code_sum');
};

export const getDeveloperNetwork = async (repo: string) => {
  return getMetricByName(repo, 'developer_network');
};

export const getRepoNetwork = async (repo: string) => {
  return getMetricByName(repo, 'repo_network');
};
