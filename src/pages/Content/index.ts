import './index.css';
import {loadConfigFromGithub} from './common/ConfigService';
import {renderDashboard} from './common/DashboardService';

const config=loadConfigFromGithub();
renderDashboard(config);