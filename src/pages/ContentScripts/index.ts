// initializeIcons() should only be called once per app and must be called before rendering any components.
import { initializeIcons } from '@fluentui/react/lib/Icons';
import DeveloperActiInflTrend from '../../anchors/DeveloperActInflTrend';
import RepoActiInflTrend from '../../anchors/RepoActiInflTrend';
import PerceptorTab from '../../anchors/PerceptorTab';
import DeveloperNetwork from '../../anchors/DeveloperNetwork';
import { inject2Perceptor } from './Perceptor';
initializeIcons();
inject2Perceptor(DeveloperActiInflTrend);
inject2Perceptor(RepoActiInflTrend);

inject2Perceptor(PerceptorTab);
import './PerceptorLayout';
inject2Perceptor(DeveloperNetwork);
import './ProjectNetwork';
import './Hypertrons';
import './content.styles.css';
import { Perceptor } from './Perceptor';
import { loadSettings } from '../../utils/settings';

async function mainInject() {
  const settings = await loadSettings();
  if (settings.isEnabled) {
    const perceptor = new Perceptor();
    perceptor.run();
  }
}

mainInject();
