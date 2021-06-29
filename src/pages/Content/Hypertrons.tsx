import React, { useEffect, useState } from 'react';
import { render } from 'react-dom';
import $ from 'jquery';
import { fire } from 'delegated-events'
import * as pageDetect from 'github-url-detection';
import {
  Callout, Stack, FocusZone,
  Text,mergeStyleSets, FontWeights, DirectionalHint,
  IconButton, initializeIcons,TooltipHost
} from '@fluentui/react';
import { useBoolean,useId } from '@fluentui/react-hooks';
import { getMessageByLocale, runsWhen } from '../../utils/utils';
import PerceptorBase from './PerceptorBase';
import { inject2Perceptor } from './Perceptor';
import logger from '../../utils/logger';
import Settings, { loadSettings } from '../../utils/settings';

initializeIcons();

const styles = mergeStyleSets({
  callout: {
    width: 320,
    padding: '20px 24px',
  },
  title: {
    marginBottom: 12,
    fontWeight: FontWeights.semilight,
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
});

interface Command {
  key: string;
  command: string;
  icon:string;
}

const CommandsList:Command[]=[
  {
    "key":"start_vote",
    "command":"/start-vote",
    "icon":"BarChartVertical"
  },
  {
    "key":"vote",
    "command":"/vote",
    "icon":"MobileReport"
  },
  {
    "key":"rerun",
    "command":"/rerun",
    "icon":"Rerun"
  },
  {
    "key":"self_assign",
    "command":"/self-assign",
    "icon":"IssueTracking"
  },
  {
    "key":"complete_checklist",
    "command":"/complete-checklist",
    "icon":"CheckList"
  },
  {
    "key":"approve",
    "command":"/approve",
    "icon":"BranchMerge"
  },
]

const HypertronsTabView: React.FC = () => {
  const [inited, setInited] = useState(false);
  const [settings, setSettings] = useState(new Settings());
  const [isCalloutVisible, { toggle: toggleIsCalloutVisible }] = useBoolean(false);
  const tooltipId = useId('tooltip');

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

  const ExecCommand=(command:Command)=>{
    const textarea=document.getElementById("new_comment_field") as HTMLTextAreaElement;
    if(textarea){
      const commentCurrent=textarea.value;
      let commandExec;
      switch (command.key){
        case "start_vote":commandExec=`${command.command} A B C`;break;
        case "vote":commandExec=`${command.command} A`;break;
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
    <div className="color-bg-secondary" style={{marginRight:4}}>
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
            <Text block variant="large" className={styles.title}>
              {getMessageByLocale("hypertrons_tab_title",settings.locale)}
            </Text>
            <Text block variant="small">
              {getMessageByLocale("hypertrons_tab_description",settings.locale)}
            </Text>
            <FocusZone>
              <Stack className={styles.buttons} gap={8} horizontal>
                {
                  CommandsList.map((command, index) => {
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
      logger.info("hypertrons button already exists")
      return
    }

    // add hypertrons tab
    const parentContainer = $('.d-flex.flex-justify-end');
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