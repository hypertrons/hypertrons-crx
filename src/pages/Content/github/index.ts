import { loadConfigFromGithub } from '../common/ConfigService'
import { renderDashboard } from '../common/DashboardService';

const init = async (): Promise<void> => {
	const componentsConf = await loadConfigFromGithub();
  renderDashboard(componentsConf);
};
void init();


