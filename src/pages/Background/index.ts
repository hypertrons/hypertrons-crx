import { compareVersion, getBrowserType} from '../../utils/utils';
import { getUpdateInfor } from "../../services/background"
import { loadSettings } from '../../utils/settings';

export enum BackgroundTasks {
  update = 'check_for_updates'
}

chrome.alarms.create(BackgroundTasks.update,{periodInMinutes:0.1});

chrome.alarms.onAlarm.addListener(async (alarm) => {
  const name=alarm.name;

  const settings=await loadSettings();

  if(name===BackgroundTasks.update ){
    if(settings.checkForUpdates){
      // @ts-ignore :we must ignore here
      const details=chrome.app.getDetails();
      const currentVersion=details["version"];
      const browserType=getBrowserType();
      const updateInformation=await getUpdateInfor();
      let latestVersion;

      if("key" in details){
        // the store-version installation
        if(browserType==="Edge"){
          latestVersion=updateInformation["edge"]["latest_version"];
        }
        else{
          latestVersion=updateInformation["chrome"]["latest_version"];
        }
      }
      else{
        latestVersion=updateInformation["develop"]["latest_version"];
      }

      if(compareVersion(currentVersion,latestVersion)===-1){
        console.log(`new ${browserType} update available, version:${latestVersion}`);
      }
    }
  }
});