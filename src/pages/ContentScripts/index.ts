// initializeIcons() should only be called once per app and must be called before rendering any components.
import { initializeIcons } from '@fluentui/react/lib/Icons';
initializeIcons();

import { loadSettings } from '../../utils/settings';
import { inject2Perceptor, Perceptor } from './Perceptor';

import DeveloperActiInflTrend from './DeveloperActiInflTrend';
import RepoActiInflTrend from './RepoActiInflTrend';
import PerceptorTab from './PerceptorTab';
import PerceptorLayout from './PerceptorLayout';
import DeveloperNetwork from './DeveloperNetwork';
import ProjectNetwork from './ProjectNetwork';
import Hypertrons from './Hypertrons';

import './content.styles.css';

inject2Perceptor(DeveloperActiInflTrend);
inject2Perceptor(RepoActiInflTrend);
inject2Perceptor(PerceptorTab);
inject2Perceptor(PerceptorLayout);
inject2Perceptor(DeveloperNetwork);
inject2Perceptor(ProjectNetwork);
inject2Perceptor(Hypertrons);

async function mainInject() {
  const settings = await loadSettings();
  if (settings.isEnabled) {
    const perceptor = new Perceptor();
    perceptor.run();
  }
}

mainInject();
