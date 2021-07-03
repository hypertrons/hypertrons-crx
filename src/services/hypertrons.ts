export interface Command {
  key: string;
  command: string;
  icon:string;
}

export const CommandListDefault:Command[]=[
  {
    "key":"start_vote",
    "command":"/start-vote",
    "icon":"BarChartVertical"
  },
  {
    "key":"vote",
    "command":"/vote",
    "icon":"MobileReport"
  },
  {
    "key":"self_assign",
    "command":"/self-assign",
    "icon":"IssueTracking"
  },
  {
    "key":"complete_checklist",
    "command":"/complete-checklist",
    "icon":"CheckList"
  },
  {
    "key":"rerun",
    "command":"/rerun",
    "icon":"Rerun"
  },
  {
    "key":"approve",
    "command":"/approve",
    "icon":"BranchMerge"
  },
]

export async function getUserNameFromCookie() {
  return new Promise<string|null>((resolve, reject) => {
    chrome.runtime.sendMessage({
      task_type: "get_username_from_cookie"
    }, response => {
      resolve(response);
    })
  });
}
