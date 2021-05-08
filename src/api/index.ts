const URL_PREFIX = 'https://hypertrons-oss.x-lab.info/'

export const getGraphData = async (path: string) => {
  const url = URL_PREFIX + path;
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error: unknown) {
    console.error('Error occured when request to ', url);
    return {};
  }
}
