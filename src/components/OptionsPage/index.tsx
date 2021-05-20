import React, { useState, useEffect } from 'react';
import {
  Pivot, PivotItem, PivotLinkFormat, Stack,
  Toggle, DefaultButton, Checkbox,Text,Link,
  Spinner, MessageBar, MessageBarType,
  Dialog,DialogType,TextField,ChoiceGroup, IChoiceGroupOption,
  Image,ImageFit,DialogFooter, PrimaryButton
} from 'office-ui-fabric-react';
import { initializeIcons } from '@uifabric/icons';
import { getMessageI18n, chromeSet, compareVersion, GraphType } from '../../utils/utils';
import { checkUpdate,checkIsTokenAvailabe } from '../../services/common';
import Settings,{ loadSettings } from "../../utils/settings"
import MetaData, { loadMetaData } from '../../utils/metadata';
import { getNotificationInformation } from '../../services/background';
import './index.css';

initializeIcons();

export enum UpdateStatus {
  undefine = -1, no = 0, yes = 1
}

const OptionsPage: React.FC = () => {

  const [settings, setSettings] = useState(new Settings());
  const [metaData, setMetaData] = useState(new MetaData());
  const [inited, setInited] = useState(false);
  const [version, setVersion] = useState("0.0.0");
  const [checkingUpdate, setCheckingUpdate] = useState(false);
  const [token, setToken] = useState("");
  const [checkingToken, setCheckingToken] = useState(false);
  const [showDialogToken, setShowDialogToken] = useState(false);
  const [showDialogTokenError, setShowDialogTokenError] = useState(false);
  const [showDialogNotification, setShowDialogNotification] = useState(false);
  const [notificationId,setNotificationId]= useState(0);
  const [notification,setNotification]= useState("");
  const [updateStatus, setUpdateStatus] = useState(UpdateStatus.undefine);

  const options: IChoiceGroupOption[] = [
    {
      key: GraphType.antv,
      imageSrc: "./antv.png",
      imageAlt: 'Antv',
      selectedImageSrc: "./antv.png",
      imageSize: { width: 48, height: 48 },
      text: 'Antv'
    },
    {
      key: GraphType.echarts,
      imageSrc: "./echarts.png",
      imageAlt: 'Echarts',
      selectedImageSrc: "./echarts.png",
      imageSize: { width: 48, height: 48 },
      text: 'Echarts'
    }
  ];

  useEffect(() => {
    const initSettings = async () => {
      const temp=await loadSettings();
      setSettings(temp);
      setInited(true);
    }
    initSettings();
  }, [settings]);

  useEffect(() => {
    const initMetaData = async () => {
      const tempMetaData=await loadMetaData();
      setMetaData(tempMetaData);
      if(tempMetaData.token!==""){
        setToken(tempMetaData.token);
      }
      const notificationInformation =await getNotificationInformation();
      if(notificationInformation.is_published&&tempMetaData.idLastNotication<notificationInformation.id){
        const language=chrome.i18n.getUILanguage();
        if(language.startsWith("zh")){
          setNotification(notificationInformation.content.zh);
        }
        else{
          setNotification(notificationInformation.content.en);
        }
        setNotificationId(notificationInformation.id);
        setShowDialogNotification(true);
      }
    }
    initMetaData();
  }, []);

  useEffect(() => {
    // @ts-ignore
    const details=chrome.app.getDetails();
    setVersion(details["version"]);
  }, [version]);

  const saveSettings = async (settings:Settings) => {
    setSettings(settings);
    await chromeSet("settings", settings.toJson());
  }

  const checkUpdateManually= async ()=>{
    setUpdateStatus(UpdateStatus.undefine);
    setCheckingUpdate(true);
    const [currentVersion,latestVersion]=await checkUpdate();
    if(compareVersion(currentVersion,latestVersion)===-1) {
      setUpdateStatus(UpdateStatus.yes);
    }
    else{
      setUpdateStatus(UpdateStatus.no);
    }
    setCheckingUpdate(false);
  }

  if (!inited) {
    return (<div/>);
  }

  return (
    <Stack>
      {
        showDialogNotification&&
        <Dialog
          hidden={!showDialogNotification}
          onDismiss={() => {
            setShowDialogNotification(false);
          }}
          dialogContentProps={{
            type: DialogType.normal,
            title: getMessageI18n("global_notificationTitle")
          }}
        >
          <Text variant="mediumPlus">
            {notification}
          </Text>
          <DialogFooter>
            <DefaultButton
              onClick={() => {
                setShowDialogNotification(false);
              }}
            >
              {getMessageI18n("global_btn_ok")}
            </DefaultButton>
            <PrimaryButton
              onClick={async () => {
                metaData.idLastNotication=notificationId;
                setMetaData(metaData);
                await chromeSet("meta_data", metaData.toJson());
                setShowDialogNotification(false);
              }}
            >
              {getMessageI18n("global_btn_disable")}
            </PrimaryButton>
          </DialogFooter>
        </Dialog>
      }
      {
        showDialogToken&&
        <Dialog
          hidden={!showDialogToken}
          onDismiss={() => {
            setShowDialogToken(false);
          }}
          dialogContentProps={{
            type: DialogType.normal,
            title: getMessageI18n("options_dialog_token_title")
          }}
        >
          <Stack horizontal style={{fontSize:16,margin:5}}>
            <Link href="https://github.com/settings/tokens" target="_blank" underline>
              {getMessageI18n("options_dialog_token_message")}
            </Link>
          </Stack>
          {
            checkingToken&&
            <Spinner label={getMessageI18n("options_dialog_token_checking")} />
          }
          {
            showDialogTokenError&&
            <MessageBar
              messageBarType={MessageBarType.error}
            >
              {getMessageI18n("options_dialog_token_error")}
            </MessageBar>
          }
          <Stack
            horizontal
            horizontalAlign="space-around"
            verticalAlign="end"
            style={{margin:"10px"}}
            tokens={{
              childrenGap: 15
            }}
          >
            <TextField
              style={{width:"200px"}}
              value={token}
              defaultValue={token}
              onChange={(e,value)=>{
                if(value){
                  setShowDialogTokenError(false);
                  setToken(value);
                }
              }}
            />
            <DefaultButton
              disabled={checkingToken}
              onClick={async ()=>{
                setCheckingToken(true);
                const result=await checkIsTokenAvailabe(token);
                setCheckingToken(false)
                if("id" in result){
                  metaData.token=token;
                  metaData.avatar=result["avatar_url"]
                  metaData.name=result["name"]
                  metaData.id=result["id"]
                  setMetaData(metaData);
                  await chromeSet("meta_data", metaData.toJson());
                  setShowDialogToken(false);
                }else{
                  setShowDialogTokenError(true);
                }
              }}
            >
              {getMessageI18n("global_btn_ok")}
            </DefaultButton>
          </Stack>
        </Dialog>
      }
      <Stack horizontalAlign="center">
        <h1>HYPERTRONS</h1>
        <sub>{`version ${version}`}</sub>
      </Stack>
      <Stack horizontalAlign="center">
        <div className="container">
          <Pivot
            style={{ margin: "3px" }}
            linkFormat={PivotLinkFormat.tabs}
          >
            <PivotItem headerText={getMessageI18n("options_header_settings")} itemIcon="Settings">
              <Stack
                horizontalAlign="space-around"
                verticalAlign='center'
                style={{ margin: "5px", padding: "3px" }}
                tokens={{
                  childrenGap: 10
                }}
              >
                <Toggle
                  label={getMessageI18n('options_toggle_checkForUpdates')}
                  defaultChecked={settings.checkForUpdates}
                  onText={getMessageI18n('options_toggle_checkForUpdates_onText')}
                  offText={getMessageI18n('options_toggle_checkForUpdates_offText')}
                  onChange={async (e, checked) => {
                    settings.checkForUpdates = checked;
                    await saveSettings(settings);
                  }}
                />
                <Stack
                  style={{
                    maxWidth:240
                  }}
                  tokens={{
                    childrenGap:10
                  }}
                >
                  {
                    checkingUpdate&&
                    <Stack horizontalAlign="start">
                      <Spinner label={getMessageI18n("options_text_checking")} />
                    </Stack>
                  }
                  {
                    updateStatus===UpdateStatus.yes&&
                    <MessageBar
                      messageBarType={MessageBarType.success}
                      isMultiline={false}
                    >
                      {getMessageI18n("options_text_updateStatusYes")}
                      <Link href="https://github.com/hypertrons/hypertrons-crx/" target="_blank" underline>
                        {getMessageI18n("options_text_goGetUpdate")}
                      </Link>
                    </MessageBar>
                  }
                  {
                    updateStatus===UpdateStatus.no&&
                    <MessageBar
                      messageBarType={MessageBarType.info}
                      isMultiline={false}
                    >
                      {getMessageI18n("options_text_updateStatusNo")}
                    </MessageBar>
                  }
                  <DefaultButton
                    style={{
                      width:120
                    }}
                    disabled={checkingUpdate}
                    onClick={async ()=>{
                      await checkUpdateManually();
                    }}
                  >
                    {getMessageI18n("options_text_checkUpdate")}
                  </DefaultButton>
                </Stack>
                <ChoiceGroup
                  label={getMessageI18n("options_text_defaultGraphType")}
                  defaultSelectedKey={settings.graphType}
                  options={options}
                  onChanged={async (option)=>{
                    settings.graphType=option.key;
                    await saveSettings(settings);
                  }}
                />
                <Text variant="xxLarge">
                  {getMessageI18n("options_text_showDifferentComponent")}
                </Text>
                <Checkbox
                  label={getMessageI18n("component_developerCollabrationNetwork_title")}
                  defaultChecked={settings.developerNetwork}
                  onChange={async (e, checked) => {
                    settings.developerNetwork = checked;
                    await saveSettings(settings);
                  }}
                />
                <Checkbox
                  label={getMessageI18n("component_projectCorrelationNetwork_title")}
                  defaultChecked={settings.projectNetwork}
                  onChange={async (e, checked) => {
                    settings.projectNetwork = checked;
                    await saveSettings(settings);
                  }}
                />


              </Stack>
            </PivotItem>
            <PivotItem headerText={getMessageI18n("options_header_My")} itemIcon="Signin">
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
                      margin: "5px", padding: "3px", width: "300px",
                      boxShadow: "4px 4px 10px rgba(0, 0, 0, 0.2)",
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
                <DefaultButton
                  onClick={()=>{
                    setShowDialogToken(true);
                  }}
                  style={{
                    width:120
                  }}
                >
                  {getMessageI18n("global_btn_setToken")}
                </DefaultButton>
              </Stack>
            </PivotItem>
          </Pivot>
        </div>
      </Stack>
    </Stack>
  )
}

export default OptionsPage;