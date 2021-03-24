import React, { useEffect, useState } from 'react';
import {
  Stack
} from 'office-ui-fabric-react';
import { initializeIcons } from '@uifabric/icons';
import './index.css';
import Settings from '../../utils/settings';
import { chromeGet,isNull} from '../../utils/utils';

initializeIcons();

const PopupPage: React.FC = () => {

  const [settings,setSettings]= useState(new Settings());
  const [inited, setInited] = useState(false);

  useEffect(() => {
    const initSettings=async ()=> {
      let obj=await chromeGet("settings");
      if(isNull(obj)){
        obj={};
      }
      settings.loadFromJson(obj);
      setSettings(settings);
      setInited(true);
    }
    initSettings();
  },[settings]);


  if(!inited){
    return (<div/>);
  }

  return(
      <Stack horizontalAlign="center">
        <h1>Hypertrons</h1>
      </Stack>
  )
}

export default PopupPage;