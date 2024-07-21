import React, { useState, useEffect } from 'react';
import optionsStorage, { HypercrxOptions, defaults } from '../../../../options-storage';
import { useTranslation } from 'react-i18next';
import '../../../../helpers/i18n';

interface Props {
  adjacentNodes: [string, number][];
}

const View = ({ adjacentNodes }: Props): JSX.Element => {
  const [options, setOptions] = useState<HypercrxOptions>(defaults);
  const { t, i18n } = useTranslation();
  const [nodes, setNodes] = useState<[string, number][]>(adjacentNodes);

  useEffect(() => {
    (async function () {
      setOptions(await optionsStorage.getAll());
      i18n.changeLanguage(options.locale);
    })();
  }, [options.locale]);

  useEffect(() => {
    setNodes(adjacentNodes);
  }, [adjacentNodes]);

  return (
    <div>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid white' }}>Related Repository</th>
            <th style={{ border: '1px solid white' }}>Relation value</th>
          </tr>
        </thead>
        <tbody>
          {nodes.map((item, index) => (
            <tr key={index}>
              <td style={{ border: '1px solid white' }}>{item[0]}</td>
              <td style={{ border: '1px solid white' }}>{item[1]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default View;
