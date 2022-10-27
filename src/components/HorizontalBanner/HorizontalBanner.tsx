import React from 'react';
import Marquee from 'react-fast-marquee';
function HorizontalBanner() {
  return (
    <div>
      <Marquee pauseOnHover={true} gradient={false} speed={30}>
        Im a horizontal Banner!
      </Marquee>
    </div>
  );
}
export default HorizontalBanner;
