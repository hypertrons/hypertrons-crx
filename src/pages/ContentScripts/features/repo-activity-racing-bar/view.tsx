import React, { useState, useEffect } from 'react';

import getMessageByLocale from '../../../../helpers/get-message-by-locale';
import optionsStorage, {
  HypercrxOptions,
  defaults,
} from '../../../../options-storage';
import RacingBar from './RacingBar';

interface Props {
  currentRepo: string;
  repoActivityDetails: any;
}

const View = ({ currentRepo, repoActivityDetails }: Props): JSX.Element => {
  const [options, setOptions] = useState<HypercrxOptions>(defaults);
  const [replay, setReplay] = useState(0);

  useEffect(() => {
    (async function () {
      setOptions(await optionsStorage.getAll());
    })();
  }, []);

  const handleReplayClick = () => {
    setReplay(replay + 1);
  };

  return (
    <div>
      <div className="hypertrons-crx-border hypertrons-crx-container">
        <div className="hypertrons-crx-title">
          <span>
            {getMessageByLocale(
              'component_projectRacingBar_title',
              options.locale
            )}
          </span>
          <div className="hypertrons-crx-title-extra developer-tab">
            <button className="replay-button" onClick={handleReplayClick}>
              {getMessageByLocale(
                'component_projectRacingBar_ReplayButton',
                options.locale
              )}
            </button>
          </div>
        </div>
        <div className="d-flex flex-wrap flex-items-center">
          <div className="col-12 col-md-8">
            <div style={{ margin: '10px 0 20px 20px' }}>
              <RacingBar
                repoName={currentRepo}
                height={300}
                width={700}
                data={repoActivityDetails}
                replay={replay}
              />
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div
              className="color-text-secondary"
              style={{ marginLeft: '35px', marginRight: '35px' }}
            >
              <p>
                {getMessageByLocale(
                  'component_projectRacingBar_description',
                  options.locale
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default View;
