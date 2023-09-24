import React, { useState, useEffect } from 'react';

import getGithubTheme from '../../../../helpers/get-github-theme';
import optionsStorage, {
  HypercrxOptions,
  defaults,
} from '../../../../options-storage';
import { Modal } from 'antd';

import CollectionContent from './collectionContent';

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

const repoNames = [
  'X-lab2017/open-digger',
  'hypertrons/hypertrons-crx',
  // 'X-lab2017/oss101',
  // 'X-lab2017/open-research',
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
        width={1500}
      >
        <CollectionContent repoNames={repoNames} />
      </Modal>
    </div>
  );
};

export default View;
