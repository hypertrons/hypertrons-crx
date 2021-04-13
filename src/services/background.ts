import { updateInformation } from '../mock/background.data';
import { sleep } from "../utils/utils"
const url_update="http://static.liuchangfreeman.xyz/files/static/update_information.json";

export const getUpdateInfor = async () => {
  let result=null;
  if (process.env.NODE_ENV !== 'production') {
    await sleep(1000);
    result=updateInformation;
  }
  else{
    const response = await fetch(url_update);
    result= await response.json();
  }
  return result;
}

export const createNotification = (id:string, options:{ [key: string]: string; }, callback:any=null) => {
  return chrome.notifications.create(id, options, callback);
};