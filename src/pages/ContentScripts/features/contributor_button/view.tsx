import React, { useState, useEffect } from 'react';
import ReactModal from 'react-modal';
import Graph from '../../../../components/Graph';
import optionsStorage, { HypercrxOptions, defaults } from '../../../../options-storage';
import { useTranslation } from 'react-i18next';
import '../../../../helpers/i18n';

// Define the time period for the developer and the repository
const DEVELOPER_PERIOD = 90;
const REPO_PERIOD = 90;

// Define the Props interface, including the developer network and the target HTML
interface Props {
  developerNetwork: any;
  target: any;
}

const borderStyle = {
  'margin-top': '0',
};

// Define the chart style
const graphStyle = {
  width: '296px',
  height: '400px',
};

const targetStyle = {
  width: '296px',
  height: '80px',
  display: 'flex',
  'justify-content': 'flex-start',
  'align-items': 'flex-start',
  'align-content': 'flex-start',
  'flex-wrap': 'wrap',
};

const buttonStyle = {
  margin: '-5px 0px 10px 0px',
  padding: '6px 14px',
  'font-size': '14px',
  'font-family': 'inherit',
  'font-weight': '500',
  'box-shadow':
    'var(--button-default-shadow-resting, var(--color-btn-shadow, 0 1px 0 rgba(27, 31, 36, 0.04))), var(--button-default-shadow-inset, var(--color-btn-inset-shadow, inset 0 1px 0 rgba(255, 255, 255, 0.25)))',
  'border-radius': '6px',
  'border-width': '1px',
  'border-style': 'solid',
  'border-image': 'initial',
  'border-color':
    'var(--button-default-borderColor-rest, var(--button-default-borderColor-rest, var(--color-btn-border, rgba(27, 31, 36, 0.15))))',
  'text-decoration': 'none',
};

// Define the View component
const View = ({ developerNetwork, target }: Props): JSX.Element => {
  // Define state variables, including options, whether to show the chart, and whether to show the repository network
  const [options, setOptions] = useState<HypercrxOptions>(defaults);
  const [showGraph, setShowGraph] = useState(true);
  const [showRepoNetwork, setShowRepoNetwork] = useState(false);

  // Use the translation function
  const { t, i18n } = useTranslation();

  // Use the useEffect hook to handle side effects, including fetching options and changing the language
  useEffect(() => {
    (async function () {
      setOptions(await optionsStorage.getAll());
      i18n.changeLanguage(options.locale);
    })();
  }, [options.locale]);

  // Return JSX elements, including a button and a conditionally rendered chart or target HTML
  return (
    <div>
      <button onClick={() => setShowGraph(!showGraph)} style={buttonStyle}>
        {showGraph ? 'Contributor List' : 'Developer Collaboration Network'}
      </button>
      {showGraph ? (
        <div className="hypertrons-crx-border hypertrons-crx-container">
          <div className="d-flex flex-wrap flex-items-center" style={{ margin: '0 0 0 0', padding: '0' }}>
            <div style={{ margin: '0 0 0 0', padding: '0', display: 'block' }}>
              <Graph data={developerNetwork} style={graphStyle} />
            </div>
          </div>
        </div>
      ) : (
        <div dangerouslySetInnerHTML={{ __html: target }} style={targetStyle} />
      )}
    </div>
  );
};

// Export the View component
export default View;
