import AnalysisPage from './page/analysisPage';

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

const AppContent = () => {
  const query = new URLSearchParams(useLocation().search);
  const page = query.get('repo');
  return <AnalysisPage repo={page} />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppContent />} />
      </Routes>
    </Router>
  );
}

export default App;
