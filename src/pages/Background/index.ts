// @ts-ignore
export enum BackgroundTasks {
  update = 'check_for_updates'
}

chrome.alarms.create(BackgroundTasks.update,{periodInMinutes:60*24});

chrome.alarms.onAlarm.addListener((alarm) => {
  const name=alarm.name;
  if(name===BackgroundTasks.update){
    console.log("check for updates")
  }
});