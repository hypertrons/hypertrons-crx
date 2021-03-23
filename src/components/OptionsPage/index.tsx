import React from 'react';
import {
  Pivot, PivotItem, PivotLinkFormat,Stack, Toggle,DefaultButton
} from 'office-ui-fabric-react';
import { initializeIcons } from '@uifabric/icons';
import {getMessageI18n} from '../../utils/utils'
import './index.css';

initializeIcons();

const OptionsPage: React.FC<{}> = () => {

    return(
      <Stack>
        <Stack horizontalAlign="center">
          <h1>HYPERTRONS</h1>
          <sub>version 0.1.2</sub>
        </Stack>
        <Stack horizontalAlign="center">
          <div className="container">
            <Pivot
              style={{margin:"3px"}}
              linkFormat={PivotLinkFormat.tabs}
            >
              <PivotItem headerText={getMessageI18n("options_header_settings")} itemIcon="Settings">
                <Stack
                  horizontalAlign="space-around"
                  verticalAlign='center'
                  style={{margin:"5px",padding:"3px"}}
                  tokens={{
                    childrenGap: 10
                  }}
                >
                  <Stack
                    horizontalAlign="start"
                    verticalAlign='center'
                    horizontal
                    tokens={{
                      childrenGap: 10
                    }}
                  >
                    <DefaultButton
                      style={{width:100}}
                      onClick={()=>{}}
                    >
                      {getMessageI18n("global_btn_ok")}
                    </DefaultButton>
                  </Stack>
                  <Toggle
                    label={getMessageI18n('options_toggle_checkForUpdates')}
                    defaultChecked
                    onText={getMessageI18n('options_toggle_checkForUpdates_onText')}
                    offText={getMessageI18n('options_toggle_checkForUpdates_offText')}
                    onChange={(e,checked)=>{

                    }}
                  />

                </Stack>
              </PivotItem>
              <PivotItem headerText={getMessageI18n("options_header_commandLine")} itemIcon="CommandPrompt">
                <Stack
                  horizontalAlign="space-around"
                  verticalAlign='center'
                  style={{margin:"5px",padding:"3px"}}
                  tokens={{
                    childrenGap: 10
                  }}
                >

                </Stack>
              </PivotItem>
            </Pivot>
          </div>
        </Stack>
      </Stack>
    )
}

export default OptionsPage;