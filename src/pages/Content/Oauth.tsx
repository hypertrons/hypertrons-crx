import * as pageDetect from 'github-url-detection';
import { runsWhen, getQueryVariable, chromeSet, getMessageByLocale } from '../../utils/utils';
import PerceptorBase from './PerceptorBase';
import { inject2Perceptor } from './Perceptor';
import { checkIsTokenAvailabe } from '../../services/common';
import { loadMetaData } from '../../utils/metadata';
import React, { useEffect, useState } from 'react';
import { render } from 'react-dom';
import $ from 'jquery';
import {
  DefaultButton, Dialog, DialogFooter,
  DialogType, Text
} from 'office-ui-fabric-react';
import Settings, { loadSettings } from '../../utils/settings';

const PerceptorLayoutView: React.FC = () => {

  const [settings, setSettings] = useState(new Settings());
  const [inited, setInited] = useState(false);
  const [showDialogNotification, setShowDialogNotification] = useState(true);

  useEffect(() => {
    const initSettings = async () => {
      const temp = await loadSettings();
      setSettings(temp);
      setInited(true);
    }
    if (!inited) {
      initSettings();
    }
  }, [inited, settings]);

  return (
      <Dialog
        hidden={!showDialogNotification}
        onDismiss={() => {
          setShowDialogNotification(false);
        }}
        dialogContentProps={{
          type: DialogType.close,
          title: getMessageByLocale("global_notificationTitle", settings.locale)
        }}
        modalProps={{
          isBlocking: true
        }}
      >
        <Text variant="mediumPlus">
          {getMessageByLocale("notification_token_setTokenSucceed", settings.locale)}
        </Text>
        <DialogFooter>
          <DefaultButton
            onClick={() => {
              setShowDialogNotification(false);
            }}
          >
            {getMessageByLocale('global_btn_ok', settings.locale)}
          </DefaultButton>
        </DialogFooter>
      </Dialog>
  )
}

@runsWhen([pageDetect.isDashboard])
class Oauth extends PerceptorBase {

  public async run(): Promise<void> {
    const metaData = await loadMetaData();
    if(metaData.token===""){
      const hash=getQueryVariable("hash");
      if(hash){
        const token=atob(hash);
        const result=await checkIsTokenAvailabe(token);
        if("id" in result){
          metaData.token = token;
          metaData.avatar = result["avatar_url"];
          metaData.name = result["name"];
          metaData.id = result["id"];
          await chromeSet("meta_data", metaData.toJson());
          const parentContainer=$('#start-of-content');
          const percepterContainer = document.createElement('div');
          render(
            <PerceptorLayoutView />,
            percepterContainer,
          );
          parentContainer.prepend(percepterContainer);
        }
      }
    }
  }
}

inject2Perceptor(Oauth);