import React, { useEffect, useState } from 'react';
import {
  Stack
} from 'office-ui-fabric-react';
import { initializeIcons } from '@uifabric/icons';
import './index.css';
import Settings,{ loadSettings } from '../../utils/settings';

initializeIcons();

const PopupPage: React.FC = () => {

  const [settings,setSettings]= useState(new Settings());
  const [inited, setInited] = useState(false);

  useEffect(() => {
    const initSettings=async ()=> {
      const temp=await loadSettings();
      setSettings(temp);
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