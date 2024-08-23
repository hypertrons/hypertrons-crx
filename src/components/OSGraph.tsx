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
   * OSGraphUrl
   */
  readonly OSGraphUrl: string;
}

const OSGraph: React.FC<OSGraphProps> = ({ shareId, style = {}, OSGraphUrl }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const loadIframe = () => {
      if (iframeRef.current) {
        iframeRef.current.src = OSGraphUrl;
      }
    };
    // async
    if (shareId < 3) {
      setTimeout(loadIframe, shareId * 500); // Each iframe delays  500ms
    } else {
      loadIframe();
    }
  }, [OSGraphUrl, shareId]);

  return (
    <div className="hypertrons-crx-border">
      <iframe ref={iframeRef} src="" style={style} />
    </div>
  );
};

export default OSGraph;
