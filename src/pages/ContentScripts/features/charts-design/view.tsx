import React, { useState, useEffect } from 'react';

import getGithubTheme from '../../../../helpers/get-github-theme';
import optionsStorage, {
  HypercrxOptions,
  defaults,
} from '../../../../options-storage';
import { Modal, Row, Col } from 'antd';
import Bars from '../../../../components/Bars';
import BarChart from '../../../Options/variable-charts/BarChart';
import LineChart from '../../../Options/variable-charts/LineChart';
import PieChart from '../../../Options/variable-charts/PieChart';
import StackedBarChart from '../../../Options/variable-charts/StackedBarChart';

const githubTheme = getGithubTheme();

const LIGHT_THEME = {
  FG_COLOR: '#24292f',
  BG_COLOR: '#ffffff',
  PALLET: ['#5470c6', '#91cc75'],
};

const DARK_THEME = {
  FG_COLOR: '#c9d1d9',
  BG_COLOR: '#0d1118',
  PALLET: ['#58a6ff', '#3fb950'],
};

interface Props {}
const data1: any = [
  ['2022-01', 5],
  ['2022-02', 10],
  ['2022-03', 15],
  ['2022-05', 25],
  ['2022-06', 30],
  ['2022-08', 40],
  ['2022-09', 45],
];
const data2: any = [
  ['2022-01', 12],
  ['2022-02', 18],
  ['2022-03', 27],
  ['2022-04', 8],
  ['2022-05', 36],
  ['2022-06', 42],
  ['2022-07', 20],
  ['2022-08', 50],
  ['2022-09', 15],
];

const mockData = {
  bar: {
    legend1: 'legend1',
    legend2: 'legend2',
    yName1: 'yName1',
    yName2: 'yName2',
    data1: data1,
    data2: data2,
  },
};

const RepoName = [
  'X-lab2017/open-digger',
  'hypertrons/hypertrons-crx',
  'X-lab2017/oss101',
];

const View = ({}: Props): JSX.Element | null => {
  const [options, setOptions] = useState<HypercrxOptions>(defaults);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    (async function () {
      setOptions(await optionsStorage.getAll());
    })();
  }, []);

  // receive message from popup
  chrome.runtime.onMessage.addListener(function (
    request,
    sender,
    sendResponse
  ) {
    if (request.greeting === 'demo') {
      showModal();
      focus(); // change the focus to the browser content
    }
  });

  return (
    <div>
      <Modal
        title="Design Graphs"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleOk}
        width={1000}
      >
        <Row>
          <Col span={12}>
            <h2 style={{ padding: 20 }}>Bar Chart</h2>
            <div style={{ background: LIGHT_THEME.BG_COLOR }}>
              <LineChart RepoName={RepoName} height={300} theme={'light'} />
            </div>
          </Col>
          <Col span={12}>
            <h2 style={{ padding: 20 }}>Bar Chart</h2>
            <div style={{ backgroundColor: LIGHT_THEME.BG_COLOR }}>
              <BarChart RepoName={RepoName} height={300} theme={'light'} />
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <h2 style={{ padding: 20 }}>Bar Chart</h2>
            <div style={{ background: LIGHT_THEME.BG_COLOR }}>
              <PieChart RepoName={RepoName} height={300} theme={'light'} />
            </div>
          </Col>
          <Col span={12}>
            <h2 style={{ padding: 20 }}>Bar Chart</h2>
            <div style={{ backgroundColor: LIGHT_THEME.BG_COLOR }}>
              <StackedBarChart
                RepoName={RepoName}
                height={300}
                theme={'light'}
              />
            </div>
          </Col>
        </Row>
      </Modal>
    </div>
  );
};

export default View;
