import React from 'react';
import { render } from 'react-dom';
import $ from 'jquery';
import * as pageDetect from 'github-url-detection';
import features from '.';
import ForceNetwork from '../../../components/Network/ForceNetwork';
import { getMessageI18n } from '../../../utils/utils'
import { getDeveloperData, getProjectData, onChartClick } from './project-network';

const init = async (): Promise<void | false> => {

  const pinnedReposDiv = $('.js-pinned-items-reorder-container').parent();
  const ProjectNetworkDiv = document.createElement('div');
  ProjectNetworkDiv.id = 'developer-network';
  ProjectNetworkDiv.style.width = "100%";

  const developerData = await getDeveloperData();
  const projectData = await getProjectData();

  render(
    <div className="hypertrons-crx-border mt-4">
      <div style={{ width: '50%', display: 'inline-block' }}>
        <ForceNetwork
          title={getMessageI18n('component_developerCollabrationNetwork_title')}
          data={developerData}
        />
      </div>
      <div style={{ width: '50%', display: 'inline-block' }}>
        <ForceNetwork
          title={getMessageI18n('component_mostParticipatedProjects_title')}
          data={projectData}
          onChartClick={onChartClick}
        />
      </div>
    </div>,
    ProjectNetworkDiv,
  );
  pinnedReposDiv.before(ProjectNetworkDiv);
}

void features.add('developer-network', {
  include: [
    pageDetect.isUserProfileMainTab
  ],
  init
});