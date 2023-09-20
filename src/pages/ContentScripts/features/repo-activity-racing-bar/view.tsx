import React, { useState, useEffect } from 'react';

import getMessageByLocale from '../../../../helpers/get-message-by-locale';
import optionsStorage, {
  HypercrxOptions,
  defaults,
} from '../../../../options-storage';
import RacingBar from './RacingBar';
import { RepoActivityDetails } from '.';
// import RecordRTC;

interface Props {
  currentRepo: string;
  repoActivityDetails: RepoActivityDetails;
}
export let recordingStarted = false;
export function setRecordingStarted(status: boolean) {
  recordingStarted = status;
}
export let mediaRecorder: MediaRecorder;
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

  recordingStarted = false;

  // Event listener for the start button
  const exportToVideo = () => {
    // Start the recording only if it has not already started
    if (!recordingStarted) {
      recordingStarted = true;
      // Capture the canvas element

      const canvas = document.querySelector(
        '#hypercrx-repo-activity-racing-bar > div > div > div.d-flex.flex-wrap.flex-items-center > div.col-12.col-md-8 > div > div > div > div > canvas'
      ) as HTMLCanvasElement;
      const stream = canvas.captureStream();

      // Start the media recorder
      const chunks: Blob[] = [];
      mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm; codecs=vp9',
      });

      mediaRecorder.ondataavailable = function (event) {
        chunks.push(event.data);
      };

      // Start recording
      mediaRecorder.start();

      // Handle the stop event
      mediaRecorder.onstop = function () {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);

        // Create a video element and set the source to the recorded video
        const video = document.createElement('video');
        video.src = url;

        // Download the video
        const a = document.createElement('a');
        a.download = 'chart_animation.webm';
        a.href = url;
        a.click();

        // Clean up
        URL.revokeObjectURL(url);
      };
    }
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

            <button className="replay-button" onClick={exportToVideo}>
              Record
            </button>
          </div>
        </div>
        <div className="d-flex flex-wrap flex-items-center">
          <div className="col-12 col-md-8">
            <div style={{ margin: '10px 0 20px 20px' }}>
              <RacingBar
                key={replay}
                repoName={currentRepo}
                data={repoActivityDetails}
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
