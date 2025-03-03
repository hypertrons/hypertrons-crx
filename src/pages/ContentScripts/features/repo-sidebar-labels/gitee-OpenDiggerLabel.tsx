import React from 'react';
import { Label } from '../../../../api/common';

interface OpenDiggerLabelProps {
  label: Label;
}

const OpenDiggerLabel: React.FC<OpenDiggerLabelProps> = ({ label }) => {
  return (
    <a
      id={`opendigger-label-${label.id}`}
      className="project-label-item-box"
      href="https://open-digger.cn"
      target="_blank"
    >
      <div
        className="project-label-item "
        style={{
          whiteSpace: 'normal',
          maxWidth: '100%',
        }}
      >
        <img
          style={{
            marginLeft: '-4px',
            marginRight: '2px',
            borderRadius: '50%',
            verticalAlign: 'middle',
            transform: 'translateY(-1px)',
          }}
          src={chrome.runtime.getURL('openDiggerLogo.png')}
          width={14}
          height={14}
        />
        {label.name}
      </div>
    </a>
  );
};

export default OpenDiggerLabel;
