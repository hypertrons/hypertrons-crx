import React from 'react';
import '../../../../helpers/i18n';

interface OpenRankProps {
  developerName: string;
  openrank: string;
}

const View: React.FC<OpenRankProps> = ({ developerName, openrank }) => {
  const textColor = '#636c76';
  const fontSize = '12px';

  return (
    <div className={`hypercrx-openrank-info`} data-developer-name={developerName}>
      <span
        style={{
          display: 'inline-block',
          verticalAlign: 'middle',
          lineHeight: '1.25 !important ',
          color: textColor,
          fontSize: fontSize,
        }}
      >
        OpenRank {openrank}
      </span>
    </div>
  );
};

export default View;
