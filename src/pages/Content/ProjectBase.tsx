import React, { useEffect, useState } from 'react';
import Graph from '../../components/Graph/Graph';
import {
  Dialog,DialogType, IButtonProps,Image,TeachingBubble
} from 'office-ui-fabric-react';
import { useBoolean } from '@fluentui/react-hooks';
import { chromeSet, getMessageI18n } from '../../utils/utils';
import MetaData, { loadMetaData } from '../../utils/metadata';

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
  const [metaData, setMetaData] = useState(new MetaData());
  const [showDialog, setShowDialog] = useState(false);
  const [inited, setInited] = useState(false);
  const [teachingBubbleVisible, { toggle: toggleTeachingBubbleVisible }] = useBoolean(true);
  useEffect(() => {
    const initMetaData = async () => {
      const temp=await loadMetaData();
      setMetaData(temp);
      setInited(true);
    }
    initMetaData();
  }, []);
  
  const disableButtonProps: IButtonProps = React.useMemo(
    () => ({
      children: getMessageI18n('teachingBubble_text_disable'),
      onClick: async ()=>{
        metaData.showTeachingBubble=false;
        await chromeSet("meta_data", metaData.toJson());
        toggleTeachingBubbleVisible();
      },
    }),
    [metaData, toggleTeachingBubbleVisible],
  );
  
  const confirmButtonProps: IButtonProps = React.useMemo(
    () => ({
      children: getMessageI18n("teachingBubble_text_ok"),
      onClick: toggleTeachingBubbleVisible,
    }),
    [toggleTeachingBubbleVisible],
  );

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
        id="charts_icon"
        src={chrome.runtime.getURL("charts.png")}
        height={50}
        width={50}
        onClick={()=>{
          setShowDialog(true)
        }}
      />
      {
        teachingBubbleVisible &&metaData.showTeachingBubble &&inited &&
        <TeachingBubble
          target="#charts_icon"
          primaryButtonProps={disableButtonProps}
          secondaryButtonProps={confirmButtonProps}
          onDismiss={toggleTeachingBubbleVisible}
          headline={getMessageI18n('teachingBubble_text_headline')}
        >
          {getMessageI18n('teachingBubble_text_content')}
        </TeachingBubble>
      }
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