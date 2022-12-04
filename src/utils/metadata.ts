import { chromeGet, isNull } from './utils';

class MetaData {
  showTeachingBubble: boolean;

  constructor() {
    this.showTeachingBubble = true;
  }

  loadFromJson(data: { [key: string]: any }): void {
    if ('showTeachingBubble' in data) {
      this.showTeachingBubble = data['showTeachingBubble'];
    }
  }

  toJson(): { [key: string]: any } {
    const result: { [key: string]: any } = {};
    result['showTeachingBubble'] = this.showTeachingBubble;
    return result;
  }
}

export const loadMetaData = async () => {
  const metaData = new MetaData();
  let obj = await chromeGet('meta_data');
  if (isNull(obj)) {
    obj = {};
  }
  metaData.loadFromJson(obj);
  return metaData;
};

export default MetaData;
