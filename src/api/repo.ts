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

export const getActivity = async (repo: string) => {
  return getMetricByName(repo, metricNameMap, 'activity');
};

export const getOpenrank = async (repo: string) => {
  return getMetricByName(repo, metricNameMap, 'openrank');
};

export const getParticipant = async (repo: string) => {
  return getMetricByName(repo, metricNameMap, 'participant');
};

export const getContributor = async (repo: string) => {
  return getMetricByName(repo, metricNameMap, 'contributor');
};

export const getForks = async (repo: string) => {
  return getMetricByName(repo, metricNameMap, 'forks');
};

export const getStars = async (repo: string) => {
  return getMetricByName(repo, metricNameMap, 'stars');
};

export const getIssuesOpened = async (repo: string) => {
  return getMetricByName(repo, metricNameMap, 'issues_opened');
};

export const getIssuesClosed = async (repo: string) => {
  return getMetricByName(repo, metricNameMap, 'issues_closed');
};

export const getIssueComments = async (repo: string) => {
  return getMetricByName(repo, metricNameMap, 'issue_comments');
};

export const getPROpened = async (repo: string) => {
  return getMetricByName(repo, metricNameMap, 'PR_opened');
};

export const getPRMerged = async (repo: string) => {
  return getMetricByName(repo, metricNameMap, 'PR_merged');
};

export const getPRReviews = async (repo: string) => {
  return getMetricByName(repo, metricNameMap, 'PR_reviews');
};

export const getMergedCodeAddition = async (repo: string) => {
  return getMetricByName(repo, metricNameMap, 'merged_code_addition');
};

export const getMergedCodeDeletion = async (repo: string) => {
  return getMetricByName(repo, metricNameMap, 'merged_code_deletion');
};

export const getMergedCodeSum = async (repo: string) => {
  return getMetricByName(repo, metricNameMap, 'merged_code_sum');
};

export const getDeveloperNetwork = async (repo: string) => {
  return getMetricByName(repo, metricNameMap, 'developer_network');
};

export const getRepoNetwork = async (repo: string) => {
  return getMetricByName(repo, metricNameMap, 'repo_network');
};

export const getActivityDetails = async (repo: string) => {
  return getMetricByName(repo, metricNameMap, 'activity_details');
};
