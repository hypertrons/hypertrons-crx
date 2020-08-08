import React from 'react';
import './index.less';

export type UserNameType = string | ((index: string) => string | null);
export type RepoNameType = string | ((index: string) => string | null);

export interface WelcomeProps {
  // 用户名
  userName?: UserNameType;
  // 仓库名
  repoName?: RepoNameType;
  // 角色
  role?: string;
  // 自定义 render
  welcomeMsg?: (userName: UserNameType, repoName: RepoNameType, role: string) => string;
}

const Welcome: React.FC<WelcomeProps> = ({
  userName = 'user',
  repoName = 'repo',
  role = 'role',
  // eslint-disable-next-line no-shadow
  welcomeMsg = (userName: UserNameType, repoName: RepoNameType, role: string) => {
    let msg = 'Hello, ';
    if (userName) {
      msg += `${userName}, `;
    }
    if (repoName) {
      msg += `welcome to ${repoName}. `;
    } else {
      msg += 'welcome. ';
    }
    if (role) {
      msg += `You are ${role} of this repo.`;
    }
    return msg;
  },
}) => {
  return (
    <div className="hypertrons-welcome-div">
      {welcomeMsg && welcomeMsg(userName, repoName, role)}
    </div>
  );
};

export default Welcome;
