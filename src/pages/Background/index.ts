import {compareVersion,getBrowserType} from "../../utils/utils"
import {getUpdateInfor} from "../../services/background"

export enum BackgroundTasks {
  update = 'check_for_updates'
}

chrome.alarms.create(BackgroundTasks.update,{periodInMinutes:0.1});

chrome.alarms.onAlarm.addListener(async (alarm) => {
  const name=alarm.name;
  if(name===BackgroundTasks.update){
    // @ts-ignore :we must ignore here
    const details=chrome.app.getDetails();
    const currentVersion=details["version"];
    const browserType=getBrowserType();
    const updateInformation=await getUpdateInfor();
    if("key" in details){
      // the store-version installation
      if(browserType==="Edge"){
        const edgeUpdateInformation=updateInformation["edge"];
        const latestVersion=edgeUpdateInformation["latest_version"];
        if(compareVersion(currentVersion,latestVersion)===-1){
          console.log("new edge update available");
        }
      }
      else{
        const chromeUpdateInformation=updateInformation["chrome"];
        const latestVersion=chromeUpdateInformation["latest_version"];
        if(compareVersion(currentVersion,latestVersion)===-1){
          console.log("new chrome update available");
        }
      }
    }
    else{
      const developUpdateInformation=updateInformation["develop"];
      const latestVersion=developUpdateInformation["latest_version"];
      if(compareVersion(currentVersion,latestVersion)===-1){
        console.log("new develop update available");
      }
    }
  }
});