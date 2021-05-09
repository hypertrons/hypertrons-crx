import React, { useState } from 'react';
import GraphWithList from '../../components/Graph/GraphWithList';
import { Dialog,DialogType,ResponsiveMode,Image } from 'office-ui-fabric-react';
import { getMessageI18n } from '../../utils/utils';

export interface ProjectBaseProps {
  graphType:string,
  forceGraphData:NetworkData,
  forceGraphDataGraphin:NetworkData,
  circularGraphData:NetworkData,
  circularGraphDataGraphin:NetworkData,
  developerColumns:any,
  repoColumns:any,
  developerListData:any,
  repoListData:any,
}

const ProjectBase: React.FC<ProjectBaseProps> =
  ({
     graphType,
     forceGraphData,
     forceGraphDataGraphin,
     circularGraphData,
     circularGraphDataGraphin,
     developerColumns,
     repoColumns,
     developerListData,
     repoListData,
 }) => {
  const [showDialog, setShowDialog] = useState(false);
  return (
    <div
      style={{
        marginTop:10
      }}
    >
      <h2 className="f4 mb-2 text-normal">
        Hypertrons network
      </h2>
      <Image
        src={chrome.runtime.getURL("charts.png")}
        height={50}
        width={50}
        onClick={()=>{
          setShowDialog(true)
        }}
      />
      <Dialog
        hidden={!showDialog}
        onDismiss={() => {
          setShowDialog(false);
        }}
        dialogContentProps={{
          type: DialogType.normal,
          title: getMessageI18n("component_projectNetwork_title")
        }}
        responsiveMode={ResponsiveMode.large}
      >
        <div >
          < GraphWithList
            layout='force'
            graphType={graphType}
            title={getMessageI18n('component_developerCollabrationNetwork_title')}
            graphData={forceGraphData}
            graphDataGraphin={forceGraphDataGraphin}
            columns={developerColumns}
            listData={developerListData}
          />
          < GraphWithList
            layout='circular'
            graphType={graphType}
            title={getMessageI18n('component_mostParticipatedProjects_title')}
            graphData={circularGraphData}
            graphDataGraphin={circularGraphDataGraphin}
            columns={repoColumns}
            listData={repoListData}
          />
        </div>
      </Dialog>
    </div>
  )
};

export default ProjectBase;