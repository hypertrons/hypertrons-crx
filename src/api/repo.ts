import { getMetricByName } from './common';

// metric names and their implementation names in OpenDigger
const metricNameMap = new Map([
  ['activity', 'activity'],
  ['openrank', 'openrank'],
  ['participant', 'participants'],
  ['contributor', 'contributors'],
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
  ['activity_details', 'activity_details'],
]);

export const getActivity = async (platform: string, repo: string) => {
  return getMetricByName(platform, repo, metricNameMap, 'activity');
};

export const getOpenrank = async (platform: string, repo: string) => {
  return getMetricByName(platform, repo, metricNameMap, 'openrank');
};

export const getParticipant = async (platform: string, repo: string) => {
  return getMetricByName(platform, repo, metricNameMap, 'participant');
};

export const getContributor = async (platform: string, repo: string) => {
  return getMetricByName(platform, repo, metricNameMap, 'contributor');
};

export const getForks = async (platform: string, repo: string) => {
  return getMetricByName(platform, repo, metricNameMap, 'forks');
};

export const getStars = async (platform: string, repo: string) => {
  return getMetricByName(platform, repo, metricNameMap, 'stars');
};

export const getIssuesOpened = async (platform: string, repo: string) => {
  return getMetricByName(platform, repo, metricNameMap, 'issues_opened');
};

export const getIssuesClosed = async (platform: string, repo: string) => {
  return getMetricByName(platform, repo, metricNameMap, 'issues_closed');
};

export const getIssueComments = async (platform: string, repo: string) => {
  return getMetricByName(platform, repo, metricNameMap, 'issue_comments');
};

export const getPROpened = async (platform: string, repo: string) => {
  return getMetricByName(platform, repo, metricNameMap, 'PR_opened');
};

export const getPRMerged = async (platform: string, repo: string) => {
  return getMetricByName(platform, repo, metricNameMap, 'PR_merged');
};

export const getPRReviews = async (platform: string, repo: string) => {
  return getMetricByName(platform, repo, metricNameMap, 'PR_reviews');
};

export const getMergedCodeAddition = async (platform: string, repo: string) => {
  return getMetricByName(platform, repo, metricNameMap, 'merged_code_addition');
};

export const getMergedCodeDeletion = async (platform: string, repo: string) => {
  return getMetricByName(platform, repo, metricNameMap, 'merged_code_deletion');
};

export const getMergedCodeSum = async (platform: string, repo: string) => {
  return getMetricByName(platform, repo, metricNameMap, 'merged_code_sum');
};

export const getDeveloperNetwork = async (platform: string, repo: string) => {
  return getMetricByName(platform, repo, metricNameMap, 'developer_network');
};

export const getRepoNetwork = async (platform: string, repo: string) => {
  return getMetricByName(platform, repo, metricNameMap, 'repo_network');
};

export const getActivityDetails = async (platform: string, repo: string) => {
  return getMetricByName(platform, repo, metricNameMap, 'activity_details');
};
