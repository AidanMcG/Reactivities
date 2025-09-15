import React, { useEffect } from 'react';
import NavBar from './NavBar';
import { Container } from 'semantic-ui-react';
import ActivityDashboard from '../../Features/Activities/Dashboard/ActivityDashboard';
import { observer } from 'mobx-react-lite';
import { Route, Switch, useLocation } from 'react-router-dom';
import HomePage from '../../Features/Activities/Home/HomePage';
import ActivityCreationForm from '../../Features/Activities/Form/ActivityCreationForm';
import ActivityDetails from '../../Features/Activities/Details/ActivityDetails';
import TestErrors from '../../Features/Activities/Errors/TestError';
import { ToastContainer } from 'react-toastify';
import NotFound from '../../Features/Activities/Errors/NotFound';
import ServerError from '../../Features/Activities/Errors/ServerError';
import LoginForm from '../../Features/Users/LoginForm';
import { useStore } from '../Stores/store';
import LoadingComponent from './LoadingComponents';
import ModalContainer from '../Common/Modals/ModalContainer';


function App() {
  const location= useLocation();
  const {commonStore, userStore} = useStore();

  useEffect(() => {
    if (commonStore.token){
      userStore.getUser().finally(() => commonStore.setAppLoaded());
    } else {
      commonStore.setAppLoaded();
    }
  }, [commonStore, userStore])

  if (!commonStore.appLoaded) return <LoadingComponent content='Loading App...'/>

  return (
    <>
      <ToastContainer position='bottom-right' hideProgressBar />
      <ModalContainer />
      <Route exact path='/' component={HomePage}/>
      <Route
        path = {'/(.+)'}
        render={() => (
          <div style={{marginTop: '7em', marginLeft: '1em', marginRight: '1em'}}>
            <NavBar/>
            <Container >
              <Switch>
                <Route exact path='/activities' component={ActivityDashboard}/>
                <Route path='/activities/:id' component={ActivityDetails}/>
                <Route key ={location.key} path={['/createActivity', '/manage/:id']} component={ActivityCreationForm}/>
                <Route path='/errors' component={TestErrors}/>
                <Route path='/server-error' component={ServerError}/>
                <Route path='/login' component={LoginForm}/>
                <Route component={NotFound}/>
              </Switch>
              </Container>
          </div>
        )}
      />
      
    </>
  );
}

export default observer(App);
