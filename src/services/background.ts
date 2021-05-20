import { notificationInformation, updateInformation } from '../mock/background.data';
import { sleep } from "../utils/utils"
const url_update = "https://hypertrons-oss.x-lab.info/crx-release/update_information.json";
const url_notification = "https://hypertrons-oss.x-lab.info/crx-release/notification.json";

export const getUpdateInfor = async () => {
  let result=null;
  if (process.env.NODE_ENV !== 'production') {
    await sleep(1000);
    result=updateInformation;
  }
  else{
    const response = await fetch(url_update,{mode:"cors"});
    result= await response.json();
  }
  return result;
}

export const getNotificationInformation = async () => {
  let result=null;
  if (process.env.NODE_ENV !== 'production') {
    await sleep(1000);
    result=notificationInformation;
  }
  else{
    const response = await fetch(url_notification,{mode:"cors"});
    result= await response.json();
  }
  return result;
}

export const createNotification = (id:string, options:{ [key: string]: string; }, callback:any=null) => {
  return chrome.notifications.create(id, options, callback);
};
