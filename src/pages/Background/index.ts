import { chromeSet, compareVersion, getMessageI18n } from '../../utils/utils';
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
              title: getMessageI18n('notification_title_newUpdate'),
              message: getMessageI18n('notification_message_newUpdate').replace('%v', latestVersion),
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
      chrome.tabs.create({url:metaData.updateUrl});
      break;
    default:
      break;
  }
  chrome.notifications.clear(notificationId);
});