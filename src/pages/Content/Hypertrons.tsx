import React, { useEffect, useState } from 'react';
import { render } from 'react-dom';
import $ from 'jquery';
import { fire } from 'delegated-events'
import * as pageDetect from 'github-url-detection';
import {
  Callout, Stack, FocusZone,Link,
  Text,mergeStyleSets, FontWeights, DirectionalHint,
  IconButton, initializeIcons,TooltipHost
} from '@fluentui/react';
import { useBoolean,useId } from '@fluentui/react-hooks';
import { utils } from 'github-url-detection';
import { Command,CommandListDefault,getUserNameFromCookie } from "../../services/hypertrons"
import { getMessageByLocale, runsWhen } from '../../utils/utils';
import PerceptorBase from './PerceptorBase';
import { inject2Perceptor } from './Perceptor';
import logger from '../../utils/logger';
import Settings, { loadSettings } from '../../utils/settings';
import { getConfigFromGithub } from '../../api/github';

initializeIcons();

const styles = mergeStyleSets({
  callout: {
    width: 360,
    padding: '20px 24px',
  },
  title: {
    fontWeight: FontWeights.bold,
    marginBottom: 20,
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
});

const HypertronsTabView: React.FC = () => {
  const commandsInit: Command[]=[]
  const [settings, setSettings] = useState(new Settings());
  const [settingsInited, setSettingsInited] = useState(false);
  const [isCalloutVisible, { toggle: toggleIsCalloutVisible }] = useBoolean(false);
  const [userName, setUserName] = useState(null);
  const [userNameInited, setUserNameInited] = useState(false);
  const [hypertronsConfig, setHypertronsConfig] = useState({});
  const [hypertronsConfigInited, setHypertronsConfigInited] = useState(false);
  const [commandsCurrent, setCommandsCurrent] = useState(commandsInit);
  const [commandsCurrentInited, setCommandsCurrentInited] = useState(false);
  const tooltipId = useId('tooltip');

  useEffect(() => {
    const initSettings = async () => {
      const temp = await loadSettings();
      setSettings(temp);
      setSettingsInited(true);
    }
    if (!settingsInited) {
      initSettings();
    }
  }, [settingsInited,settings]);

  useEffect(() => {
    const initHypertronsConfig = async () => {
      const owner = utils.getRepositoryInfo(window.location)!.owner;
      const repo = utils.getRepositoryInfo(window.location)!.name;
      const hypertonsConfig = await getConfigFromGithub(owner,repo);
      setHypertronsConfig(hypertonsConfig);
      setHypertronsConfigInited(true);
    }
    if (!hypertronsConfigInited) {
      initHypertronsConfig();
    }
  }, [hypertronsConfigInited,hypertronsConfig]);

  useEffect(() => {
    const initUserName = async () => {
      const userNameFromCookie = await getUserNameFromCookie();
      // @ts-ignore
      setUserName(userNameFromCookie["message"]);
      setUserNameInited(true);
    }
    if (!userNameInited) {
      initUserName();
    }
  }, [userNameInited,userName]);

  useEffect(() => {
    const initCommandsCurrent = async () => {
      let commandsCanUse=new Set([]);
      if("role" in hypertronsConfig){
        const roleConfig=hypertronsConfig["role"];
        if("roles" in roleConfig){
          const rolesConfig=roleConfig["roles"];
          // @ts-ignore
          for(const role of rolesConfig){
            const roleName=role["name"];
            const usersSet=new Set(role["users"]);
            const commands=role["commands"];
            if(usersSet.has(userName)||roleName==="anyone"){
              for(const command of commands){
                // @ts-ignore
                commandsCanUse.add(command);
              }
            }
          }
        }
      }

      let commandsFinal=[];
      for (const command of CommandListDefault) {
        // @ts-ignore
        if(commandsCanUse.has(command.command)){
          commandsFinal.push(command);
        }
      }
      // @ts-ignore
      setCommandsCurrent(commandsFinal);
      setCommandsCurrentInited(true);
    }
    if (!commandsCurrentInited&&hypertronsConfigInited&&userNameInited) {
      initCommandsCurrent();
    }
  }, [hypertronsConfigInited, userNameInited, commandsCurrentInited, commandsCurrent, hypertronsConfig, userName]);

  const ExecCommand=(command:Command)=>{
    const textarea=document.getElementById("new_comment_field") as HTMLTextAreaElement;
    if(textarea){
      const commentCurrent=textarea.value;
      let commandExec;
      switch (command.key){
        case "start_vote":commandExec=`${command.command}  A,B,C,D`;break;
        case "vote":commandExec=`${command.command} A`;break;
        case "rerun":commandExec=`${command.command} CI`;break;
        case "complete-checklist":commandExec=`${command.command} 1 #1`;break;
        default:commandExec=command.command;break;
      }
      const commentNew=`${commentCurrent}${commandExec} `;
      // @ts-ignore
      Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set.call(textarea, commentNew);
      fire(textarea,"change");
      toggleIsCalloutVisible();
    }
  }

  return (
    <div
      className="color-bg-secondary"
      style={{
        marginRight:4,
        display: commandsCurrent.length>0?"block":"none"
      }}
    >
      <button
        id='hypertrons_button'
        className="btn"
        onClick={toggleIsCalloutVisible}
        type="button"
      >
        Commands
      </button>
      {
        isCalloutVisible && (
          <Callout
            gapSpace={0}
            className={styles.callout}
            target={'#hypertrons_button'}
            onDismiss={toggleIsCalloutVisible}
            directionalHint={DirectionalHint.topCenter}
          >
            <Text variant="xLarge" block className={styles.title}>
              {getMessageByLocale("hypertrons_tab_title",settings.locale)}
            </Text>
            <Text variant="medium" block >
              {getMessageByLocale("hypertrons_tab_description",settings.locale)}&nbsp;
              <Link
                href={getMessageByLocale("hypertrons_tab_link",settings.locale)}
                target="_blank"
              >
                {getMessageByLocale("golbal_link",settings.locale)}
              </Link>
            </Text>
            <FocusZone>
              <Stack className={styles.buttons} gap={8} horizontal>
                {
                  commandsCurrent.map((command, index) => {
                    return (
                        <TooltipHost
                          content={getMessageByLocale(`hypertrons_command_${command.key}`,settings.locale)}
                          id={tooltipId}
                          calloutProps={{ gapSpace: 0 }}
                          styles={{ root: { display: 'inline-block' } }}
                        >
                          <IconButton
                            iconProps={{
                              iconName:command.icon
                            }}
                            onClick={()=>{
                              ExecCommand(command)
                            }}
                          />
                        </TooltipHost>
                    )
                  })
                }
              </Stack>
            </FocusZone>
          </Callout>
        )
      }
    </div>
  )
}

@runsWhen([pageDetect.isPR,pageDetect.isIssue])
class Hypertrons extends PerceptorBase {
  private static renderView():void{
    // avoid redundant button
    if($("#hypertrons_button").length>0){
      logger.info("hypertrons tab exists")
      return
    }

    // add hypertrons tab
    const commentForm=$(".js-new-comment-form");
    const parentContainer = commentForm.find('.d-flex.flex-justify-end');
    const hypertronsTab=document.createElement('div');
    render(
      <HypertronsTabView />,
      hypertronsTab,
    );
    parentContainer.prepend(hypertronsTab);
  }

  public async run(): Promise<void> {

    // @ts-ignore
    const observer = new MutationObserver(Hypertrons.renderView);
    const element = document.querySelector('#new_comment_field');
    // @ts-ignore
    observer.observe(element,{
      'attributes': true,
    });

    Hypertrons.renderView();
  }
}

inject2Perceptor(Hypertrons);