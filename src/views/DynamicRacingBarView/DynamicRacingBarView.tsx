import React, { useState, useEffect } from 'react';
import {
  Stack,
  Dropdown,
  IDropdownStyles,
  IDropdownOption,
  Spinner,
} from '@fluentui/react';
import { getMessageByLocale } from '../../utils/utils';
import Settings, { loadSettings } from '../../utils/settings';
import ErrorPage from '../../components/ExceptionPage/ErrorPage';
import DynamicRacingBar from '../../components/DynamicRacingBar/DynamicRacingBar';

interface ContributorsActivityEvolutionProps {
  currentRepo: string;
  graphType: GraphType;
}

const DynamicRacingBarView: React.FC<ContributorsActivityEvolutionProps> = ({
  currentRepo,
}) => {
  const [repoPeriod, setRepoPeriod] = useState<string | number | undefined>(
    180
  );
  const [inited, setInited] = useState(false);
  const [settings, setSettings] = useState(new Settings());
  const [statusCode, setStatusCode] = useState<number>(200);

  useEffect(() => {
    const initSettings = async () => {
      const temp = await loadSettings();
      setSettings(temp);
      setInited(true);
    };
    if (!inited) {
      initSettings();
    }
  }, [inited, settings]);

  const dropdownStyles: Partial<IDropdownStyles> = {
    dropdown: { width: 120 },
  };

  const periodOptions: IDropdownOption[] = [
    {
      key: 180,
      text: `180 ${getMessageByLocale('global_day', settings.locale)}`,
    },
  ];

  const onRenderPeriodDropdownTitle = (
    options: IDropdownOption[] | undefined
  ): JSX.Element => {
    const option = options![0];
    return (
      <div>
        <span>{getMessageByLocale('global_period', settings.locale)}: </span>
        <span>{option!.text}</span>
      </div>
    );
  };

  const onRepoPeriodChange = (
    e: any,
    option: IDropdownOption | undefined
  ): void => {
    setRepoPeriod(option!.key);
  };

  if (statusCode !== 200) {
    return <ErrorPage errorCode={statusCode} />;
  }

  return (
    <div>
      <div className="hypertrons-crx-border hypertrons-crx-container">
        <Stack className="hypertrons-crx-title">
          <div className="hypertrons-crx-title-extra">
            <Dropdown
              defaultSelectedKey={repoPeriod}
              options={periodOptions}
              styles={dropdownStyles}
              onRenderTitle={onRenderPeriodDropdownTitle}
              onChange={onRepoPeriodChange}
            />
          </div>
        </Stack>
        <div className="d-flex flex-wrap flex-items-center">
          <div className="col-12 col-md-8">
            <div style={{ margin: '10px 0 20px 20px' }}>
              <Stack className="hypertrons-crx-border">
                <Stack.Item align="center">
                  <DynamicRacingBar
                    data1={[]} //fetch the data and pass it to dynamic racing bars
                    data2={[]}
                    dataURL="https://hypertrons-oss.x-lab.info/dynamicbar_activities_v2/latest/hypertrons/hypertrons-crx.csv"
                  />
                </Stack.Item>
              </Stack>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div
              className="color-text-secondary"
              style={{ marginLeft: '55px' }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicRacingBarView;
