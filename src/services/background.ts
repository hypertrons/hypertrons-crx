import { updateInformation } from '../mock/background.data';
import { sleep } from "../utils/utils"
const url_update="";

export const getUpdateInfor = async () => {
  let result=null;
  // const response = await fetch(url_update);
  // return await response.json();
  await sleep(1000);
  result=updateInformation;
  return result;
}

export const createNotification = (id:string, options:{ [key: string]: string; }, callback:any=null) => {
  return chrome.notifications.create(id, options, callback);
};