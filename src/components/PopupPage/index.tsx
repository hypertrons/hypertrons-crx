import React, { useEffect, useState } from 'react';
import {
  DefaultButton,
  Image, ImageFit, PivotItem,
  Stack, Text,
} from 'office-ui-fabric-react';
import { initializeIcons } from '@uifabric/icons';
import './index.css';
import Settings,{ loadSettings } from '../../utils/settings';
import MetaData, { loadMetaData } from '../../utils/metadata';
import { getMessageI18n } from '../../utils/utils';

initializeIcons();

const PopupPage: React.FC = () => {

  const [settings,setSettings]= useState(new Settings());
  const [metaData, setMetaData] = useState(new MetaData());
  const [inited, setInited] = useState(false);

  useEffect(() => {
    const initSettings=async ()=> {
      const temp=await loadSettings();
      setSettings(temp);
    }
    initSettings();
  },[settings]);

  useEffect(() => {
    const initMetaData = async () => {
      const temp=await loadMetaData();
      setMetaData(temp);
      setInited(true);
    }
    initMetaData();
  }, []);

  if(!inited){
    return (<div/>);
  }

  return(
      <Stack horizontalAlign="center">
        <h1>Hypertrons</h1>
        <Stack
          horizontalAlign="space-around"
          verticalAlign='center'
          style={{ margin: "5px", padding: "3px" }}
          tokens={{
            childrenGap: 10
          }}
        >
          {
            metaData.token!==""&&
            <Stack
              horizontal
              verticalAlign="center"
              style={{
                margin: "5px", padding: "3px", width: "300px"
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
                style={{marginLeft:25,maxWidth:200,wordWrap:"break-word"}}
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
              {getMessageI18n("global_btn_setToken")}
            </DefaultButton>
          }
        </Stack>
      </Stack>
  )
}

export default PopupPage;