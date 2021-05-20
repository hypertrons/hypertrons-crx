import React, { useEffect, useState } from 'react';
import {
  IButtonProps,TeachingBubble
} from 'office-ui-fabric-react';
import { useBoolean } from '@fluentui/react-hooks';
import { chromeSet, getMessageI18n } from '../../utils/utils';
import MetaData, { loadMetaData } from '../../utils/metadata';

export interface TeachingBubbleProps {
  target:string
}

const TeachingBubbleWrapper: React.FC<TeachingBubbleProps> =
  ({
     target
   }) => {
    const [metaData, setMetaData] = useState(new MetaData());
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
        children: getMessageI18n('global_btn_disable'),
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
        children: getMessageI18n("global_btn_ok"),
        onClick: toggleTeachingBubbleVisible,
      }),
      [toggleTeachingBubbleVisible],
    );

    return (
      <div>
        {
          teachingBubbleVisible&&inited&&metaData.showTeachingBubble&&
          <TeachingBubble
            target={target}
            primaryButtonProps={disableButtonProps}
            secondaryButtonProps={confirmButtonProps}
            onDismiss={toggleTeachingBubbleVisible}
            headline={getMessageI18n('teachingBubble_text_headline')}
          >
            {getMessageI18n('teachingBubble_text_content')}
          </TeachingBubble>
        }
      </div>
    )
  };

export default TeachingBubbleWrapper;