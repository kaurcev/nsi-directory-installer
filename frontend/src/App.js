import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './Application.js';
import E404View from './views/notFound/view.js';
import HomeView from './views/home/view.js';
import SignInView from './views/auth/view.js';
import ProfileView from './views/profile/view.js';
import MainView from './views/main/view.js';


function App() {
  return (
    <Router>
      <AppProvider>
        <Routes>
          <Route exact path='/' element={<HomeView />} />
          <Route exact path='/signin' element={<SignInView />} />
          <Route exact path='/main' element={<MainView />} />
          <Route exact path='/profile' element={<ProfileView />} />
          <Route path='*' status="404" element={<E404View />} />
        </Routes>
      </AppProvider> 
   </Router>
  );
}

export default App;
