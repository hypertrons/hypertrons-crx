// initializeIcons() should only be called once per app and must be called before rendering any components.
import { initializeIcons } from '@fluentui/react/lib/Icons';
initializeIcons();

import './DeveloperActiInflTrend';
import './RepoActiInflTrend';
import './PerceptorTab';
import './PerceptorLayout';
import './DeveloperNetwork';
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
