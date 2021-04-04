import { chromeSet, compareVersion, getMessageI18n } from '../../utils/utils';
import { createNotification } from "../../services/background"
import { checkUpdate } from "../../services/common"
import { loadSettings } from '../../utils/settings';
import { loadMetaData } from '../../utils/metadata';

export enum BackgroundTasks {
  update = 'check_for_updates'
}

// in develop-version, we can do this every 0.1 min, but not in store-version
chrome.alarms.create(BackgroundTasks.update,{periodInMinutes:0.1});

chrome.alarms.onAlarm.addListener(async (alarm) => {
  const name=alarm.name;

  const settings=await loadSettings();
  const metaData=await loadMetaData();


  if(name===BackgroundTasks.update){
    if(settings.checkForUpdates){
      console.log("check for updates");
      const [currentVersion,latestVersion]=await checkUpdate();
      if(compareVersion(currentVersion,latestVersion)===-1){
        const timeNow=new Date().valueOf();
        const duration=timeNow-metaData.timeLastNoticeNewUpdate;
        console.log(duration);
        if(duration>=24*60*60*1000){
          // only notice people once within 24 hours
          createNotification('check_for_updates', {
            type: 'basic',
            iconUrl: 'main.png',
            title: getMessageI18n('notification_title_newUpdate'),
            message: getMessageI18n('notification_message_newUpdate').replace('%v', latestVersion),
          })
          metaData.timeLastNoticeNewUpdate=timeNow;
          await chromeSet("meta_data", metaData.toJson());
        }
      }
    }
  }
});