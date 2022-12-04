export const checkIsTokenAvailabe = async (token: string) => {
  const response = await fetch(`https://api.github.com/user`, {
    headers: { Authorization: `token ${token}` },
  });
  return await response.json();
};
