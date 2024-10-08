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
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        paddingLeft: '4px',
      }}
      href="https://open-digger.cn"
      target="_blank"
    >
      <img
        style={{
          marginRight: '4px',
          borderRadius: '50%',
        }}
        src="https://open-digger.cn/img/logo/logo-blue-round-corner.png"
        width={16}
        height={16}
      />
      <span>{label.name}</span>
    </a>
  );
};

export default OpenDiggerLabel;
