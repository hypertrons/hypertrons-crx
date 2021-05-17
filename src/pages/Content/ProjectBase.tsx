import React, { useState } from 'react';
import Graph from '../../components/Graph/Graph';
import {
  Dialog,DialogType,Image
} from 'office-ui-fabric-react';
import { getMessageI18n } from '../../utils/utils';
import TeachingBubbleWrapper from './TeachingBubbleWrapper'

export interface ProjectBaseProps {
  graphType:string,
  developerCollabrationData:NetworkData,
  participatedProjectsData:NetworkData,
}

const ProjectBase: React.FC<ProjectBaseProps> =
  ({
     graphType,
     developerCollabrationData,
     participatedProjectsData,
   }) => {

    const [showDialog, setShowDialog] = useState(false);

    return (
      <div
        className="border-top color-border-secondary pt-3 mt-3"
      >
        <h2 className="h4 mb-2">
          Hypertrons
        </h2>
        <Image
          id="charts_icon"
          src={chrome.runtime.getURL("charts.png")}
          height={50}
          width={50}
          onClick={()=>{
            setShowDialog(true)
          }}
        />
        <TeachingBubbleWrapper target="#charts_icon"/>
        <Dialog
          hidden={!showDialog}
          onDismiss={() => {
            setShowDialog(false);
          }}
          dialogContentProps={{
            type: DialogType.normal,
            title: getMessageI18n("component_projectNetwork_title")
          }}
        >
          <div >
            < Graph
              title={getMessageI18n('component_developerCollabrationNetwork_title')}
              graphType={graphType}
              data={developerCollabrationData}
            />
            < Graph
              title={getMessageI18n('component_mostParticipatedProjects_title')}
              graphType={graphType}
              data={participatedProjectsData}
            />
          </div>
        </Dialog>
      </div>
    )
  };

export default ProjectBase;