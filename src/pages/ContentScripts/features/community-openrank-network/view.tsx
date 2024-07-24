import React, { useState, useEffect, useRef } from 'react';

import optionsStorage, { HypercrxOptions, defaults } from '../../../../options-storage';
import { RepoMeta } from '../../../../api/common';
import { t } from 'i18next';
import Network, { DateControllers } from './Network';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';

interface Props {
  repoName: string;
  openrank: any;
  meta: RepoMeta;
}

const graphStyle = {
  width: '100%',
  height: '380px',
};

const View = ({ repoName, openrank, meta }: Props): JSX.Element | null => {
  const [options, setOptions] = useState<HypercrxOptions>(defaults);
  const dateControllersRef = useRef<DateControllers>(null);

  useEffect(() => {
    (async function () {
      setOptions(await optionsStorage.getAll());
    })();
  }, []);

  const onChange = (newDate: dayjs.Dayjs) => {
    let date = newDate.format('YYYY-MM');
    dateControllersRef.current?.update(date);
  };

  if (!openrank) return null;

  return (
    <div>
      <div className="hypertrons-crx-border hypertrons-crx-container">
        <div className="hypertrons-crx-title">
          <span>{t('component_communityOpenRankNetwork_title')}</span>
          <div className="hypertrons-crx-title-extra">
            <DatePicker
              id={'community-openrank-date-picker'}
              onChange={onChange}
              defaultValue={dayjs('2023-09', 'YYYY-MM')}
              picker="month"
              format="YYYY-MM"
            />
          </div>
        </div>
        <div className="d-flex flex-wrap flex-items-center">
          <div className="col-12 col-md-8">
            <div style={{ margin: '10px 0 20px 20px', width: '100%', height: '100%' }}>
              <Network
                ref={dateControllersRef}
                data={openrank}
                style={graphStyle}
                focusedNodeID={repoName}
                date={'2023-09'}
              />
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="color-text-secondary" style={{ marginLeft: '35px', marginRight: '35px' }}>
              <p style={{ marginTop: '10px' }}>{t('component_communityOpenRankNetwork_description')}</p>
              <div id="details" className="bordered" style={{ marginTop: '15px', marginBottom: '15px' }}>
                <div id="details_title">
                  <h2>Details</h2>
                </div>
                <div id="details_div" className="scrollit">
                  <table id="details_table"></table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default View;
