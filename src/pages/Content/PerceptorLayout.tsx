import React, { useEffect, useState } from 'react';
import { render } from 'react-dom';
import $ from 'jquery';
import { Spinner } from 'office-ui-fabric-react';
import { getMessageByLocale, isPerceptor, runsWhen } from '../../utils/utils';
import PerceptorBase from './PerceptorBase';
import { inject2Perceptor } from './Perceptor';
import Settings, { loadSettings } from '../../utils/settings';

const PerceptorLayoutView: React.FC<{}> = () => {
  const [settings,setSettings]= useState(new Settings());
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
  },[inited,settings]);

  return (
    <Spinner label={getMessageByLocale("golbal_loading", settings.locale)} />
  )
}
@runsWhen([isPerceptor])
class PerceptorLayout extends PerceptorBase {
  public async run(): Promise<void> {
    // remove the original container
    const parentContainer = $('.container-xl.clearfix.new-discussion-timeline');
    $('#repo-content-pjax-container', parentContainer).remove();

    // create the new one : percepter container
    const percepterContainer = document.createElement('div');
    percepterContainer.setAttribute('id', 'perceptor-layout');

    render(
      <PerceptorLayoutView />,
      percepterContainer,
    );
    parentContainer.prepend(percepterContainer);
  }
}

inject2Perceptor(PerceptorLayout);