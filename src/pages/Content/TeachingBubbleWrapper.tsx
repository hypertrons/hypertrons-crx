import React, { useEffect, useState } from 'react';
import {
  IButtonProps,TeachingBubble
} from 'office-ui-fabric-react';
import { useBoolean } from '@fluentui/react-hooks';
import { chromeSet, getMessageByLocale } from '../../utils/utils';
import MetaData, { loadMetaData } from '../../utils/metadata';
import Settings, { loadSettings } from '../../utils/settings';

export interface TeachingBubbleProps {
  target:string
}

const TeachingBubbleWrapper: React.FC<TeachingBubbleProps> =
  ({
     target
   }) => {
    const [metaData, setMetaData] = useState(new MetaData());
    const [inited, setInited] = useState(false);
    const [settings, setSettings] = useState(new Settings());
    const [teachingBubbleVisible, { toggle: toggleTeachingBubbleVisible }] = useBoolean(true);

    useEffect(() => {
      const initSettings = async () => {
        const temp = await loadSettings();
        setSettings(temp);
        setInited(true);
      }
      if (!inited) {
        initSettings();
      }
    }, [settings]);

    useEffect(() => {
      const initMetaData = async () => {
        const temp=await loadMetaData();
        setMetaData(temp);
      }
      initMetaData();
    }, []);

    const disableButtonProps: IButtonProps = React.useMemo(
      () => ({
        children: getMessageByLocale('global_btn_disable', settings.locale),
        onClick: async ()=>{
          metaData.showTeachingBubble=false;
          await chromeSet("meta_data", metaData.toJson());
          toggleTeachingBubbleVisible();
        },
      }),
      [metaData, settings.locale, toggleTeachingBubbleVisible],
    );

    const confirmButtonProps: IButtonProps = React.useMemo(
      () => ({
        children: getMessageByLocale("global_btn_ok", settings.locale),
        onClick: toggleTeachingBubbleVisible,
      }),
      [settings.locale, toggleTeachingBubbleVisible],
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
            headline={getMessageByLocale('teachingBubble_text_headline', settings.locale)}
          >
            {getMessageByLocale('teachingBubble_text_content', settings.locale)}
          </TeachingBubble>
        }
      </div>
    )
  };

export default TeachingBubbleWrapper;