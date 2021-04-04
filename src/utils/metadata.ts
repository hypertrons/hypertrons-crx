import { chromeGet, isNull } from './utils';

class MetaData {
  timeLastNoticeNewUpdate: number;

  constructor() {
    this.timeLastNoticeNewUpdate=new Date().valueOf()-24*60*60*1000;
  }

  loadFromJson(data: { [key: string]: any; }): void {
    if ("timeLastNoticeNewUpdate" in data) {
      this.timeLastNoticeNewUpdate = data["timeLastNoticeNewUpdate"];
    }
  }

  toJson(): { [key: string]: any; } {
    const result: { [key: string]: any; } = {};
    result["timeLastNoticeNewUpdate"] = this.timeLastNoticeNewUpdate;
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