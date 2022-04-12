export interface Command {
  command: string;
}

export const LabelStyles: string[] = [
  '--label-r:17;--label-g:238;--label-b:17;--label-h:120;--label-s:86;--label-l:50',
  '--label-r:3;--label-g:102;--label-b:214;--label-h:211;--label-s:97;--label-l:42',
  '--label-r:199;--label-g:222;--label-b:248;--label-h:211;--label-s:77;--label-l:87',
  '--label-r:184;--label-g:20;--label-b:91;--label-h:334;--label-s:80;--label-l:40',
  '--label-r:95;--label-g:221;--label-b:164;--label-h:152;--label-s:64;--label-l:61',
  '--label-r:112;--label-g:87;--label-b:255;--label-h:248;--label-s:100;--label-l:67',
  '--label-r:252;--label-g:41;--label-b:41;--label-h:0;--label-s:97;--label-l:57',
  '--label-r:251;--label-g:202;--label-b:4;--label-h:48;--label-s:96;--label-l:50',
  '--label-r:246;--label-g:180;--label-b:222;--label-h:321;--label-s:78;--label-l:83',
  '--label-r:67;--label-g:1;--label-b:137;--label-h:269;--label-s:98;--label-l:27',
  '--label-r:237;--label-g:237;--label-b:237;--label-h:0;--label-s:0;--label-l:92',
  '--label-r:147;--label-g:245;--label-b:168;--label-h:132;--label-s:83;--label-l:76',
];

export function Label2Style(lable: string) {
  let result: { [key: string]: number } = {};
  const group = lable.split(';');
  for (const kv of group) {
    const kvp = kv.split(':');
    result[kvp[0]] = parseInt(kvp[1]);
  }
  return result;
}

export async function getUserNameFromCookie() {
  return new Promise<string | null>((resolve, reject) => {
    chrome.runtime.sendMessage(
      {
        task_type: 'get_username_from_cookie',
      },
      (response) => {
        resolve(response);
      }
    );
  });
}
