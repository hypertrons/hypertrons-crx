export const saveToken = (token: string) => {
    localStorage.setItem('github_token', token);
  };
  
export const getToken = (): string => {
return localStorage.getItem('github_token') || '';
};
  
