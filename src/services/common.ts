import { getUpdateInfor } from './background';
import { getBrowserType } from '../utils/utils';

export const checkUpdate= async ()=>{
  // @ts-ignore : we must ignore here
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
  return [currentVersion,latestVersion];
}