import React, { useState } from 'react';
import Marquee from 'react-fast-marquee';

function HorizontalBanner() {
  return (
    <div>
      <Marquee pauseOnHover={true} gradient={false} speed={30}>
        Welcome to HyperCRX Repository!
      </Marquee>
    </div>
  );
}
export default HorizontalBanner;
