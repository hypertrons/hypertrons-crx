import { chromeGet, isNull } from './utils';

class MetaData {
  timeLastNoticeNewUpdate: number;
  updateUrl:string;

  constructor() {
    this.timeLastNoticeNewUpdate=new Date().valueOf()-24*60*60*1000;
    this.updateUrl="https://github.com/hypertrons/hypertrons-crx";
  }

  loadFromJson(data: { [key: string]: any; }): void {
    if ("timeLastNoticeNewUpdate" in data) {
      this.timeLastNoticeNewUpdate = data["timeLastNoticeNewUpdate"];
    }
    if ("updateUrl" in data) {
      this.updateUrl = data["updateUrl"];
    }
  }

  toJson(): { [key: string]: any; } {
    const result: { [key: string]: any; } = {};
    result["timeLastNoticeNewUpdate"] = this.timeLastNoticeNewUpdate;
    result["updateUrl"] = this.updateUrl;
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