import React from 'react';
import { CommonMeta } from '../../../../api/common';

interface OpenDiggerLabelProps {
  label: CommonMeta['labels'][0];
}

const OpenDiggerLabel: React.FC<OpenDiggerLabelProps> = ({ label }) => {
  return (
    <a
      id={`opendigger-label-${label.id}`}
      className="topic-tag topic-tag-link"
      href="https://open-digger.cn"
      target="_blank"
    >
      <img
        style={{
          verticalAlign: 'text-bottom',
          marginRight: '4px',
          borderRadius: '50%',
          transform: 'translateY(-0.5px)',
        }}
        src="https://open-digger.cn/img/logo/logo-blue-round-corner.png"
        width={14}
      />
      <span>{label.name}</span>
    </a>
  );
};

export default OpenDiggerLabel;
