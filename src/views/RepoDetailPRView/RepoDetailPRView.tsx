import React, { useState, useEffect } from 'react';

import { getGithubTheme, getMessageByLocale } from '../../utils/utils';
import Settings, { loadSettings } from '../../utils/settings';
import { generateDataByMonth } from '../../utils/data';
import { getRepoDetail } from '../../api/repo';
import ReactTooltip from 'react-tooltip';
import PRChart from './PRChart';
import MergedLinesChart from './MergedLinesChart';

const githubTheme = getGithubTheme();

interface RepoDetailPRViewProps {
  currentRepo: string;
}

const generatePRData = (PR: any): any => {
  return {
    op: generateDataByMonth(PR.op),
    pm: generateDataByMonth(PR.pm),
    rc: generateDataByMonth(PR.rc),
  };
};

const generateMergedLinesData = (PR: any): any => {
  return {
    ad: generateDataByMonth(PR.ad),
    de: generateDataByMonth(PR.de).map((item) => {
      const dataItem = item;
      dataItem[1] = -item[1];
      return dataItem;
    }),
  };
};

const RepoDetailPRView: React.FC<RepoDetailPRViewProps> = ({ currentRepo }) => {
  const [inited, setInited] = useState(false);
  const [settings, setSettings] = useState(new Settings());
  const [PR, setPR] = useState<any>();

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
    (async () => {
      try {
        const res = await getRepoDetail(currentRepo);
        setPR({
          op: res.data['op'],
          pm: res.data['pm'],
          rc: res.data['rc'],
          ad: res.data['ad'],
          de: res.data['de'],
        });
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  if (!PR) return null;

  return (
    <ReactTooltip id="pr-tooltip" clickable={true}>
      <div className="chart-title">
        {getMessageByLocale('pr_popup_title', settings.locale)}
      </div>
      <PRChart
        theme={githubTheme as 'light' | 'dark'}
        width={330}
        height={200}
        data={generatePRData(PR)}
      />
      <div className="chart-title">
        {getMessageByLocale('merged_lines_popup_title', settings.locale)}
      </div>
      <MergedLinesChart
        theme={githubTheme as 'light' | 'dark'}
        width={330}
        height={200}
        data={generateMergedLinesData(PR)}
      />
    </ReactTooltip>
  );
};

export default RepoDetailPRView;
