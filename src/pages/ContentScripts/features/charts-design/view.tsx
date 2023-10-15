import React, { useState, useEffect } from 'react';

import getGithubTheme from '../../../../helpers/get-github-theme';
import optionsStorage, {
  HypercrxOptions,
  defaults,
} from '../../../../options-storage';
import { Modal, Row, Col } from 'antd';
import Bars from '../../../../components/Bars';

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
            <h2 style={{ padding: 20 }}>Bar Chart Light Theme</h2>
            <div style={{ background: LIGHT_THEME.BG_COLOR }}>
              <Bars
                theme={'light'}
                height={350}
                legend1={mockData.bar.legend1}
                legend2={mockData.bar.legend2}
                yName1={mockData.bar.yName1}
                yName2={mockData.bar.yName2}
                data1={mockData.bar.data1}
                data2={mockData.bar.data2}
              />
            </div>
          </Col>
          <Col span={12}>
            <h2 style={{ padding: 20 }}>Bar Chart Dark Theme</h2>
            <div style={{ backgroundColor: DARK_THEME.BG_COLOR }}>
              <Bars
                theme={'dark'}
                height={350}
                legend1={mockData.bar.legend1}
                legend2={mockData.bar.legend2}
                yName1={mockData.bar.yName1}
                yName2={mockData.bar.yName2}
                data1={mockData.bar.data1}
                data2={mockData.bar.data2}
              />
            </div>
          </Col>
        </Row>
      </Modal>
    </div>
  );
};

export default View;
