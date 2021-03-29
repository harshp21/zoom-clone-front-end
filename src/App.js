import './App.css';
import Header from './component/header/header';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Login from './component/login/Login';
import SignUp from './component/SignUp/SignUp';
import ForgotPassword from './component/forgot-password/ForgotPassword';
import RetrievePassword from './component/retrieve-password/RetrievePassword';
import UserProvider from './context/user/UserProvider';
import ActivateAccount from './component/activate-account/ActivateAccount';
import Home from './component/home/Home';
import Join from './component/join/Join';
import Meeting from './component/meeting/meeting';
import ProtectedRoute from './component/protected-route/ProtectedRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MeetingProvider from './context/meeting/MeetingProvider';
import HeaderRoutes from './component/headerRoutes/HeaderRoutes';
import PageNotFound from './component/PageNotFound/PageNotFound';

function App() {

  return (
    <div className="app">

      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover />


      <BrowserRouter>
        <MeetingProvider>
          <UserProvider>
            {/* <Header /> */}
            <Switch>
              <Route path='/404' component={PageNotFound} />
              <ProtectedRoute path="/meeting/:meetingId" component={Meeting} />
              <Route path='/' component={HeaderRoutes} />
            </Switch>
          </UserProvider>
        </MeetingProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
