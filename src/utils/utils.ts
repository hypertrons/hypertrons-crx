export function elementExists(obj: null | JQuery) {
  return obj !== null && obj.length > 0;
}

export function getMetaContent(index: any) {
  const ele = document.getElementsByTagName('meta')[index];
  if (ele && ele.content) {
    return ele.content;
  }
  return null;
}

export function isNull(object: any) {
  if(
    object === null ||
    typeof object === 'undefined' ||
    object === '' ||
    JSON.stringify(object) === '[]'||
    JSON.stringify(object) === '{}'
  ) {
    return true;
  }
  return false;
}

export async function chromeSet(key:string, value:any){
  const items: { [key: string] : any; } = {};
  items[key]=value;
  return new Promise<void>((resolve, reject) => {
    chrome.storage.local.set(items, ()=>{
      resolve();
    })
  });
}

export async function chromeGet(key:string){
  return new Promise<{ [key: string] : any; }>((resolve, reject) => {
    chrome.storage.local.get(key, (result)=>{
      resolve(result[key]);
    })
  });
}

export function getMessageI18n(key:string){
  return chrome.i18n.getMessage(key);
}

export const isPerceptor = (): boolean => window.location.search.includes('perceptor');