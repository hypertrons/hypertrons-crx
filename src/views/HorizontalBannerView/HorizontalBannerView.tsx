import React, { useState, useEffect } from 'react';
import {
  Stack,
} from '@fluentui/react';
import { getMessageByLocale } from '../../utils/utils';
import Settings, { loadSettings } from '../../utils/settings';
import ErrorPage from '../../components/ExceptionPage/ErrorPage';
import HorizontalBanner from '../../components/HorizontalBanner/HorizontalBanner';

interface ContributorsActivityEvolutionProps {
  currentRepo: string;
}

const HorizontalBannerView: React.FC<ContributorsActivityEvolutionProps> = ({
  currentRepo,
}) => {
  const [inited, setInited] = useState(false);
  const [settings, setSettings] = useState(new Settings());
  const [statusCode, setStatusCode] = useState<number>(200);

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

  if (statusCode !== 200) {
    return <ErrorPage errorCode={statusCode} />;
  }

  return (
    <div>
      <div>
        <Stack className="">
          <Stack.Item>
            <HorizontalBanner />
          </Stack.Item>
        </Stack>
      </div>
    </div>
  );
};

export default HorizontalBannerView;
