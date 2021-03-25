class Settings {
  checkForUpdates: boolean | undefined;

  loadFromJson(data:{ [key: string] : any; }):void{
    if("checkForUpdates" in data){
      this.checkForUpdates=data["checkForUpdates"];
    }
    else{
      this.checkForUpdates=false;
    }
  }

  toJson():{ [key: string] : any; } {
    const result: { [key: string] : any; } = {};
    result["checkForUpdates"]=this.checkForUpdates;
    return result;
  }


}

export default Settings;