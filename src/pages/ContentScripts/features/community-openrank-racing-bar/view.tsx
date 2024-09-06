import optionsStorage, { HypercrxOptions, defaults } from '../../../../options-storage';
import RacingBar, { MediaControllers } from './RacingBar';
import { CommunityOpenRankDetails, getMonthlyData } from './data';
import { PlayerButton } from '../repo-activity-racing-bar/PlayerButton';
import { SpeedController } from '../repo-activity-racing-bar/SpeedController';

import React, { useState, useEffect, useRef } from 'react';
import { Space } from 'antd';
import { SelectPicker } from 'rsuite';
import 'rsuite/SelectPicker/styles/index.css';
import { PlayCircleFilled, StepBackwardFilled, StepForwardFilled, PauseCircleFilled } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import '../../../../helpers/i18n';

interface Props {
  communityOpenRankDetails: CommunityOpenRankDetails;
}

const View = ({ communityOpenRankDetails }: Props): JSX.Element => {
  const [options, setOptions] = useState<HypercrxOptions>(defaults);
  const [speed, setSpeed] = useState<number>(1);
  const [playing, setPlaying] = useState<boolean>(false);
  const mediaControllersRef = useRef<MediaControllers>(null);
  const { t, i18n } = useTranslation();
  const type = [
    ['All', 'a'],
    ['Issue', 'i'],
    ['Pull Request', 'p'],
    ['User', 'u'],
  ].map((item) => ({ label: item[0], value: item[1] }));
  useEffect(() => {
    (async function () {
      setOptions(await optionsStorage.getAll());
      i18n.changeLanguage(options.locale);
    })();
  }, [options.locale]);

  const onSelect = (newType: string) => {
    mediaControllersRef.current?.updateType(newType);
  };

  return (
    <div>
      <div className="hypertrons-crx-border hypertrons-crx-container">
        <div className="hypertrons-crx-title">
          <span>{t('component_communityOpenRankRacingBar_title')}</span>
          <div className="hypertrons-crx-title-extra developer-tab">
            <SelectPicker
              data={type}
              onSelect={onSelect}
              cleanable={false}
              defaultValue={'a'}
              searchable={false}
              style={{ width: 100 }}
            />
            <Space>
              {/* speed control */}
              <SpeedController
                speed={speed}
                onSpeedChange={(speed) => {
                  setSpeed(speed);
                }}
              />

              {/* 3 buttons */}
              <Space size={3}>
                {/* last month | earliest month */}
                <PlayerButton
                  tooltip="Long press to the earliest"
                  icon={<StepBackwardFilled />}
                  onClick={mediaControllersRef.current?.previous}
                  onLongPress={mediaControllersRef.current?.earliest}
                />
                {/* play | pause */}
                <PlayerButton
                  icon={playing ? <PauseCircleFilled /> : <PlayCircleFilled />}
                  onClick={() => {
                    if (playing) {
                      mediaControllersRef.current?.pause();
                    } else {
                      mediaControllersRef.current?.play();
                    }
                  }}
                />
                {/* next month | latest month */}
                <PlayerButton
                  tooltip="Long press to the latest"
                  icon={<StepForwardFilled />}
                  onClick={mediaControllersRef.current?.next}
                  onLongPress={mediaControllersRef.current?.latest}
                />
              </Space>
            </Space>
          </div>
        </div>
        <div className="d-flex flex-wrap flex-items-center">
          <div className="col-12 col-md-8">
            <div style={{ margin: '10px 0 20px 20px' }}>
              <RacingBar
                ref={mediaControllersRef}
                speed={speed}
                data={getMonthlyData(communityOpenRankDetails)}
                setPlaying={setPlaying}
              />
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="color-text-secondary" style={{ marginLeft: '35px', marginRight: '35px' }}>
              <p>{t('component_communityOpenRankRacingBar_description')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default View;
