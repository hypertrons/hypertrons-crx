new HypertronsDashboard({
  getInsertElement: () => $('.file-navigation.in-mid-page.mb-2.d-flex.flex-items-start'),
  insertType: 'before',
  welcome: true,
  userName: getMetaContent('user-login'),
  repoName: getMetaContent('octolytics-dimension-repository_nwo'),
  role: 'role',
  getWelcome: (userName, repoName, role) => `Welcome to ${repoName}, ${userName}, ${role} of this repo.`,
  tokenKey: 'github-personal-token',
  turnOnCmd: true,
});
