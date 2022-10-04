import React, { useState, useEffect } from 'react';

import { getGithubTheme, getMessageByLocale } from '../../utils/utils';
import Settings, { loadSettings } from '../../utils/settings';
import { getRepoActiInfl, getRepoDetail } from '../../api/repo';
import ReactTooltip from 'react-tooltip';
import { rocketLight, rocketDark } from './base64';

const githubTheme = getGithubTheme();

interface RepoHeaderLabelsViewProps {
  currentRepo: string;
}

const RepoHeaderLabelsView: React.FC<RepoHeaderLabelsViewProps> = ({
  currentRepo,
}) => {
  const [inited, setInited] = useState(false);
  const [settings, setSettings] = useState(new Settings());
  const [data, setData] = useState<any>();

  const generateBarsData = (repoActiInflData: any) => {
    const activityField = repoActiInflData['activity'];
    const influenceFiled = repoActiInflData['influence'];

    let data1: [string, number][] = [];
    let data2: [string, number][] = [];

    Object.keys(activityField).forEach((value, index) => {
      data1.push([value, activityField[value].toFixed(2)]);
      data2.push([value, influenceFiled[value].toFixed(2)]);
    });

    return { data1, data2 };
  };

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

  useEffect(() => {
    const getData = async () => {
      try {
        const repoActiInflResponse = await getRepoActiInfl(currentRepo);
        const repoDetailReponse = await getRepoDetail(currentRepo);
        setData({
          activity: repoActiInflResponse.data['activity'],
          influence: repoActiInflResponse.data['influence'],
          participant: repoDetailReponse.data['p'],
        });
      } catch (e) {
        console.error(e);
      }
    };
    getData();
  }, []);

  if (!data) return null;

  return (
    <div className="d-flex">
      <span
        id="activity-header-label"
        className="Label Label--secondary v-align-middle mr-1"
        style={{ color: githubTheme === 'light' ? '#24292f' : '#c9d1d9' }}
        data-tip=""
        data-for="activity-tooltip"
        data-place="bottom"
        data-type="dark"
        data-effect="solid"
        data-delay-hide={500}
        data-delay-show={500}
      >
        <svg
          className="icon"
          style={{ float: 'left' }}
          width="16"
          height="16"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill={githubTheme === 'light' ? '#57606a' : '#8b949e'}
            d="M541.04064 834.70336s-0.43008 0 0 0a40.8576 40.8576 0 0 1-38.99392-29.14304L376.03328 383.3856l-59.57632 181.30944a40.57088 40.57088 0 0 1-38.58432 27.8528H151.42912a40.69376 40.69376 0 0 1-40.71424-40.71424 40.96 40.96 0 0 1 40.71424-40.71424h96.8704l91.29984-276.8896c5.57056-16.71168 21.85216-27.42272 39.44448-27.8528a41.30816 41.30816 0 0 1 38.56384 29.14304l124.29312 417.4848 94.28992-308.18304a40.93952 40.93952 0 0 1 36.864-28.71296c17.14176-0.43008 32.99328 8.99072 39.424 24.86272l71.168 170.5984h100.74112c22.28224 0 40.71424 18.41152 40.71424 40.71424s-18.00192 40.71424-40.71424 40.71424h-127.73376a41.30816 41.30816 0 0 1-37.72416-24.86272l-38.56384-91.29984-100.74112 329.60512a41.0624 41.0624 0 0 1-38.58432 28.2624z m0 0"
          />
        </svg>
        100
      </span>
      <span
        id="influence-header-label"
        className="Label Label--secondary v-align-middle mr-1"
        style={{ color: githubTheme === 'light' ? '#24292f' : '#c9d1d9' }}
        data-tip=""
        data-for="influence-tooltip"
        data-place="bottom"
        data-type="dark"
        data-effect="solid"
        data-delay-hide={500}
        data-delay-show={500}
      >
        <img
          width={16}
          height={16}
          style={{ float: 'left' }}
          src={githubTheme === 'light' ? rocketLight : rocketDark}
          alt=""
        />
        233
      </span>
      <span
        id="participant-header-label"
        className="Label Label--secondary v-align-middle mr-1"
        style={{ color: githubTheme === 'light' ? '#24292f' : '#c9d1d9' }}
        data-tip=""
        data-for="participant-tooltip"
        data-place="bottom"
        data-type="dark"
        data-effect="solid"
        data-delay-hide={500}
        data-delay-show={500}
      >
        <svg
          className="icon"
          style={{ float: 'left' }}
          width="16"
          height="16"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill={githubTheme === 'light' ? '#57606a' : '#8b949e'}
            d="M448 170.666667a192 192 0 0 1 98.56 356.821333A320.085333 320.085333 0 0 1 768 832a42.666667 42.666667 0 0 1-85.333333 0 234.666667 234.666667 0 0 0-469.333334 0 42.666667 42.666667 0 0 1-85.333333 0 320.128 320.128 0 0 1 221.44-304.554667A192 192 0 0 1 448 170.666667z m256 42.666666a149.333333 149.333333 0 0 1 107.434667 253.056A212.992 212.992 0 0 1 917.333333 650.666667a42.666667 42.666667 0 0 1-85.333333 0 128 128 0 0 0-128-128 42.666667 42.666667 0 0 1-42.325333-48.042667 42.666667 42.666667 0 0 1 37.376-47.701333L704 426.666667a64 64 0 0 0 6.144-127.701334L704 298.666667a42.666667 42.666667 0 0 1 0-85.333334z m-256 42.666667a106.666667 106.666667 0 1 0 0 213.333333 106.666667 106.666667 0 0 0 0-213.333333z"
          />
        </svg>
        15
      </span>
      <ReactTooltip id="activity-tooltip">xxxxx</ReactTooltip>
      <ReactTooltip id="influence-tooltip">xxxxx</ReactTooltip>
      <ReactTooltip id="participant-tooltip">xxxxx</ReactTooltip>
    </div>
  );
};

export default RepoHeaderLabelsView;
