import getGithubTheme from '../../../../helpers/get-github-theme';
import optionsStorage, { HypercrxOptions, defaults } from '../../../../options-storage';
import '../../../ContentScripts/index.scss';
import React, { useState, useEffect } from 'react';

import { useTranslation } from 'react-i18next';
import '../../../../helpers/i18n';
const githubTheme = getGithubTheme();

type Label = {
  id: string;
  name: string;
  type: string;
};

interface Props {
  labels: Label[];
}

const View = ({ labels }: Props): JSX.Element | null => {
  const [options, setOptions] = useState<HypercrxOptions>(defaults);
  const { t, i18n } = useTranslation();
  useEffect(() => {
    (async function () {
      setOptions(await optionsStorage.getAll());
      i18n.changeLanguage(options.locale);
    })();
  }, [options.locale]);

  const meta_labels = labels.map((label) => (
    <span
      key={label.id} // use label.id as the key
      id={label.id}
      className="topic-tag topic-tag-link"
    >
      {label.name}
    </span>
  ));
  return (
    <div className="label-tab">
      <div className="label-header">
        <img src="https://open-digger.cn/img/logo/logo-blue-round-corner.png" alt="Icon" className="label-icon" />
        <span className="h4 label-text" style={{ color: githubTheme === 'light' ? '1F2328' : 'F0F6FC' }}>
          Labels
        </span>
      </div>
      <br />
      {meta_labels}
    </div>
  );
};

export default View;
