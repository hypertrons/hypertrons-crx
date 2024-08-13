import React, { useEffect, useRef } from 'react';

interface OSGraphProps {
  /**
   * shareId
   */
  readonly shareId: number;
  /**
   * `style` for OSGraph container
   */
  readonly style?: React.CSSProperties;
  /**
   * paramId
   */
  readonly paramId: string;
}

const OSGraphUrls = [
  'https://osgraph.com/result?shareId=1&shareParams={paramId},1405669423,1721288623,10&isShare=true',
  'https://osgraph.com/result?shareId=2&shareParams={paramId},10&isShare=true',
  'https://osgraph.com/result?shareId=3&shareParams={paramId},5,5,3&isShare=true',
  'https://osgraph.com/result?shareId=4&shareParams={paramId},10&isShare=true',
  'https://osgraph.com/result?shareId=5&shareParams={paramId},10&isShare=true',
  'https://osgraph.com/result?shareId=6&shareParams={paramId},5,3&isShare=true',
];

const OSGraph: React.FC<OSGraphProps> = ({ shareId, style = {}, paramId }) => {
  const osGraphUrl = OSGraphUrls[shareId].replace('{paramId}', paramId);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    console.log(shareId)
      // async
      if(shareId<3){
        setTimeout(() => {
          if(iframeRef.current){
            iframeRef.current.src = osGraphUrl;
          }
        }, shareId * 500); // Each iframe delays  500ms
      }
      else{
        if(iframeRef.current){
          iframeRef.current.src = osGraphUrl;
        }
      }
  }, [iframeRef, osGraphUrl, shareId]);

  return (
    <div className="hypertrons-crx-border">
      <iframe
        ref={iframeRef}
        src=""
        style={style}
      />
    </div>
  );
};

export default OSGraph;
