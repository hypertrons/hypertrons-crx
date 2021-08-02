import React, { useState, useEffect } from 'react';
import EChartsWrapper from './Echarts/index';
import { Stack, Link } from 'office-ui-fabric-react';
import { isNull, getMessageByLocale } from '../../utils/utils';
import Settings, { loadSettings } from '../../utils/settings';

interface RadarProps {
  /**
   * data
   */
  readonly data: any;
}

const Radar: React.FC<RadarProps> = ({ data}) => {

  const [inited, setInited] = useState(false);
  const [settings, setSettings] = useState(new Settings());

  useEffect(() => {
    const initSettings = async () => {
      const temp = await loadSettings();
      setSettings(temp);
      setInited(true);
    }
    if (!inited) {
      initSettings();
    }
  }, [inited, settings]);

  if (isNull(data)) {
    return (<div />)
  }
  return (
    <Stack>
      <Stack className='hypertrons-crx-border'>
        <EChartsWrapper
          option={data}
          style = {{
            width: 500,
            height: 420
          }}
        />
      </Stack>
    </Stack>
  )
};

export default Radar;