import { chromeSet, compareVersion, getMessageByLocale } from '../../utils/utils';
import { createNotification } from "../../services/background"
import { checkUpdate } from "../../services/common"
import { loadSettings } from '../../utils/settings';
import { loadMetaData } from '../../utils/metadata';

export enum BackgroundTasks {
  update = 'check_for_updates'
}

// in develop-version, we can do this every 0.1 min, but not in store-version
if (process.env.NODE_ENV !== 'production') {
  chrome.alarms.create(BackgroundTasks.update, { periodInMinutes: 0.1 });
}
else{
  chrome.alarms.create(BackgroundTasks.update, { periodInMinutes: 10 });
}

chrome.alarms.onAlarm.addListener(async (alarm) => {
  const name=alarm.name;

  const settings=await loadSettings();
  const metaData=await loadMetaData();

  if(!settings.isEnabled){
    return
  }

  if(name===BackgroundTasks.update){
    if(settings.checkForUpdates){
      const [currentVersion,latestVersion,updateUrl]=await checkUpdate();
      if(compareVersion(currentVersion,latestVersion)===-1){
        const timeNow=new Date().valueOf();
        const duration=timeNow-metaData.timeLastNoticeNewUpdate;
        console.log(duration);
        if(duration>=24*60*60*1000){
          // only notice people once within 24 hours
          metaData.updateUrl=updateUrl;
          metaData.timeLastNoticeNewUpdate=timeNow;
          await chromeSet("meta_data", metaData.toJson());
          createNotification('check_for_updates',
            {
              type: 'basic',
              iconUrl: 'main.png',
              title: getMessageByLocale('notification_title_newUpdate', settings.locale),
              message: getMessageByLocale('notification_message_newUpdate', settings.locale).replace('%v', latestVersion),
            }
          )
        }
      }
    }
  }
});

chrome.notifications.onClicked.addListener(async function(notificationId){
  switch (notificationId){
    case "check_for_updates":
      const metaData=await loadMetaData();
      window.open(metaData.updateUrl);
      break;
    default:
      break;
  }
  chrome.notifications.clear(notificationId);
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const type = request.task_type
  if(type==="get_username_from_cookie"){
    chrome.cookies.get({
      url : "https://github.com",
      name : "dotcom_user"
    }, function(cookie) {
      let message;
      if(cookie){
        message=cookie.value;
      }
      else{
        message=null;
      }
      sendResponse({
        message: message
      });
    });
  }
  // must return true in async mode
  return true;
})
