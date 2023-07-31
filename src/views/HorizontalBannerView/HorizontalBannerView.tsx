import React, { useState, useEffect } from 'react';
import Settings, { loadSettings } from '../../utils/settings';
import Marquee from 'react-fast-marquee';

interface ContributorsActivityEvolutionProps {
  currentRepo: string;
}

const HorizontalBannerView: React.FC<ContributorsActivityEvolutionProps> = ({
  currentRepo,
}) => {
  const [inited, setInited] = useState(false);
  const [settings, setSettings] = useState(new Settings());

  useEffect(() => {
    const initSettings = async () => {
      const temp = await loadSettings();
      setSettings(temp);
      setInited(true);
    };
    if (!inited) {
      initSettings();
    }
  }, [inited, settings]);

  return (
    <div>
      <Marquee pauseOnHover={true} gradient={false} speed={30}>
        Welcome to HyperCRX Repository!
      </Marquee>
    </div>
  );
};

export default HorizontalBannerView;
