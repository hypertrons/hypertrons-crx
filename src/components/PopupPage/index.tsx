import React, { useEffect, useState } from 'react';
import {
  DefaultButton,
  Image, ImageFit,
  Stack, Text, Toggle,
} from 'office-ui-fabric-react';
import { initializeIcons } from '@uifabric/icons';
import './index.css';
import Settings,{ loadSettings } from '../../utils/settings';
import MetaData, { loadMetaData } from '../../utils/metadata';
import { chromeSet, getMessageByLocale } from '../../utils/utils';

initializeIcons();

const PopupPage: React.FC = () => {

  const [settings,setSettings]= useState(new Settings());
  const [metaData, setMetaData] = useState(new MetaData());
  const [inited, setInited] = useState(false);

  useEffect(() => {
    const initSettings=async ()=> {
      const temp=await loadSettings();
      setSettings(temp);
      setInited(true);
    }
    if(!inited){
      initSettings();
    }
  },[inited, settings]);

  useEffect(() => {
    const initMetaData = async () => {
      const temp=await loadMetaData();
      setMetaData(temp);
    }
    initMetaData();
  }, []);

  const saveSettings = async (settings: Settings) => {
    setSettings(settings);
    await chromeSet("settings", settings.toJson());
  }
  
  if(!inited){
    return (<div/>);
  }

  return(
      <Stack horizontalAlign="center">
        <Stack
          horizontalAlign="space-around"
          verticalAlign='center'
          style={{ margin: "5px", padding: "3px" }}
          tokens={{
            childrenGap: 10
          }}
        >
          <Stack
            horizontalAlign="center"
          >
            <Toggle
              label={getMessageByLocale('options_enable_toggle_autoCheck', settings.locale)}
              defaultChecked={settings.isEnabled}
              onText={getMessageByLocale('global_toggle_onText', settings.locale)}
              offText={getMessageByLocale('global_toggle_offText', settings.locale)}
              onChange={async (e, checked) => {
                settings.isEnabled = checked;
                await saveSettings(settings);
              }}
            />
          </Stack>
          {
            metaData.token!==""&&
            <Stack
              horizontal
              verticalAlign="center"
              style={{
                margin: "5px", padding: "3px", width: "200px"
              }}
              tokens={{
                childrenGap: 5
              }}
            >
              <Image
                width={75}
                height={75}
                src={metaData.avatar}
                imageFit={ImageFit.centerCover}
              />
              <Text
                variant="large"
                style={{marginLeft:25,maxWidth:300,wordWrap:"break-word"}}
              >
                {metaData.name}
              </Text>
            </Stack>
          }
          {
            metaData.token === "" &&
            <DefaultButton
              onClick={()=>{
                chrome.runtime.openOptionsPage();
              }}
              style={{
                width:120
              }}
            >
              {getMessageByLocale("options_token_title", settings.locale)}
            </DefaultButton>
          }
        </Stack>
      </Stack>
  )
}

export default PopupPage;