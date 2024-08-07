import React, { CSSProperties } from 'react';

interface OSGraphProps {
  /**
   * shareId
   */
  readonly shareId: any;
  /**
   * `style` for OSGraph container
   */
  readonly style?: CSSProperties;
  /**
   * paramId
   */
  readonly paramId: any;
}

const OSGraphUrl = [
  'https://osgraph.com/result?shareId=1&shareParams={paramId},1405669423,1721288623,10&isShare=true',
  'https://osgraph.com/result?shareId=2&shareParams={paramId},10&isShare=true',
  'https://osgraph.com/result?shareId=3&shareParams={paramId},5,5,3&isShare=true',
  'https://osgraph.com/result?shareId=4&shareParams={paramId},10&isShare=true',
  'https://osgraph.com/result?shareId=5&shareParams={paramId},10&isShare=true',
  'https://osgraph.com/result?shareId=6&shareParams={paramId},5,3&isShare=true',
];
const OSGraph: React.FC<OSGraphProps> = ({ shareId, style = {}, paramId }) => {
  const osGraphUrl = OSGraphUrl[shareId].replace('{paramId}', paramId);
  return (
    <div className="hypertrons-crx-border">
      <iframe src={osGraphUrl} style={style}></iframe>
    </div>
  );
};

export default OSGraph;
