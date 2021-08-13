import './PerceptorTab';
import './PerceptorLayout';
import './DeveloperNetwork';
import './ProjectNetwork';
import './Hypertrons';
import './content.styles.css';
import { Perceptor } from './Perceptor';
import { loadSettings } from '../../utils/settings';

async function mainInject() {
  const settings=await loadSettings();
  if(settings.isEnabled){
    const perceptor = new Perceptor();
    perceptor.run();
  }
}

mainInject();