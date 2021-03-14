import './App.css';
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from 'react-router-dom';
import { AuthProvider, useAuthContext } from './authentication/AuthContext';

import Main from './Main';
import Login from './Login';
import Agency from './Agency';
import Article from './Article';
import Preview from './Preview';
import DelegateDashboard from './DelegateDashboard';
import Write from './Write';
import StaffDashboard from './StaffDashboard';
import Edit from './Edit';

function App() {
  
  function AuthRoute({ component: Component, ...rest }) {
    const { currentUser } = useAuthContext();
    return (
      <Route
        {...rest}
        render={(props) =>
          (currentUser) ? ( 
            <Component {...props} />
          ) : ( 
            <Redirect to='/login' />
          )
        }
      />
    );
  }
  
  function AuthStaffRoute({ component: Component, ...rest }) {
    const { currentUser, getTokenData } = useAuthContext();
    return (
      <Route
        {...rest}
        render={(props) =>
          ((currentUser ? getTokenData().name : '') === 'Staff') ? ( 
            <Component {...props} />
          ) : ( 
            <Redirect to='/login' />
          )
        }
      />
    );
  }

  return (
    <AuthProvider>
      <Switch>
        <Route exact path='/' component={Main} />
        <Route exact path='/login' component={Login} />
        <Route exact path='/agency/:agency' component={Agency} />
        <Route exact path='/agency/:agency/article/:article_id' component={Article} />
        <AuthRoute exact path='/agency/:agency/preview/:article_id' component={Preview} />
        <AuthRoute exact path='/delegate' component={DelegateDashboard} />
        <AuthRoute exact path='/delegate/write' component={Write} />
        <AuthStaffRoute exact path='/staff' component={StaffDashboard} />
        <AuthStaffRoute exact path='/staff/edit/:article_id' component={Edit} />
      </Switch>
    </AuthProvider>
  );
}


export default App;
