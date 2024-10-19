import React from 'react';
import { Label } from '../../../../api/common';

interface OpenDiggerLabelProps {
  label: Label;
}

const OpenDiggerLabel: React.FC<OpenDiggerLabelProps> = ({ label }) => {
  return (
    <a
      id={`opendigger-label-${label.id}`}
      className="topic-tag topic-tag-link"
      style={{
        marginRight: '5px',
        paddingLeft: '5px',
      }}
      href="https://open-digger.cn"
      target="_blank"
    >
      <img
        style={{
          marginRight: '2px',
          borderRadius: '50%',
          verticalAlign: 'middle',
          transform: 'translateY(-1px)',
        }}
        src={chrome.runtime.getURL('openDiggerLogo.png')}
        width={16}
        height={16}
      />
      <span>{label.name}</span>
    </a>
  );
};

export default OpenDiggerLabel;
