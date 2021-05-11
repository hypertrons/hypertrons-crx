import { chromeGet, isNull } from './utils';

class MetaData {
  timeLastNoticeNewUpdate: number;
  updateUrl:string;
  token:string;
  avatar:string;
  name:string;
  id:string;
  showTeachingBubble:boolean;

  constructor() {
    this.timeLastNoticeNewUpdate=new Date().valueOf()-24*60*60*1000;
    this.updateUrl="https://github.com/hypertrons/hypertrons-crx";
    this.token="";
    this.avatar="";
    this.name="";
    this.id="";
    this.showTeachingBubble=true;
  }

  loadFromJson(data: { [key: string]: any; }): void {
    if ("timeLastNoticeNewUpdate" in data) {
      this.timeLastNoticeNewUpdate = data["timeLastNoticeNewUpdate"];
    }
    if ("updateUrl" in data) {
      this.updateUrl = data["updateUrl"];
    }
    if ("token" in data) {
      this.token = data["token"];
    }
    if ("avatar" in data) {
      this.avatar = data["avatar"];
    }
    if ("name" in data) {
      this.name = data["name"];
    }
    if ("id" in data) {
      this.id = data["id"];
    }
    if("showTeachingBubble" in data){
      this.showTeachingBubble=data["showTeachingBubble"];
    }
  }

  toJson(): { [key: string]: any; } {
    const result: { [key: string]: any; } = {};
    result["timeLastNoticeNewUpdate"] = this.timeLastNoticeNewUpdate;
    result["updateUrl"] = this.updateUrl;
    result["token"] = this.token;
    result["avatar"] = this.avatar;
    result["name"] = this.name;
    result["id"] = this.id;
    result["showTeachingBubble"]=this.showTeachingBubble;
    return result;
  }
}

export const loadMetaData=async ()=>{
  const metaData=new MetaData()
  let obj = await chromeGet("meta_data");
  if (isNull(obj)) {
    obj = {};
  }
  metaData.loadFromJson(obj);
  return metaData
}

export default MetaData;