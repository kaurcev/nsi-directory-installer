import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './Application.js';
import E404View from './views/notFound/view.js';
import HomeView from './views/home/view.js';


function App() {
  return (
    <Router>
      <AppProvider>
        <Routes>
          <Route exact path='/' element={<HomeView />} />
          <Route path='*' status="404" element={<E404View />} />
        </Routes>
      </AppProvider> 
   </Router>
  );
}

export default App;
