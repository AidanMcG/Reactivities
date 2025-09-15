import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { Grid } from 'semantic-ui-react';
import LoadingComponent from '../../../App/Layout/LoadingComponents';
import { useStore } from '../../../App/Stores/store';
import ActivityFilters from './ActivityFilters';
import ActivityList from './ActivityList';



export default observer(function ActivityDashboard() {

    const {activityStore} = useStore();
    const {loadActivities, activityRegistry} = activityStore;

    useEffect(() => {
      if (activityRegistry.size <= 1) loadActivities();
    }, [activityRegistry.size, loadActivities])
  
    if (activityStore.loadingInitial) return <LoadingComponent content='Loading activities...'/>

    return (
        <Grid>
            <Grid.Column width='12'>
                <div style= {{marginLeft: '1em', marginRight: '1em'}}>
                    <ActivityList/>
                </div>
            </Grid.Column>
            <Grid.Column width='4'>
                
                <div style= {{marginLeft: '1em', marginRight: '1em'}}>
                    <ActivityFilters />
                </div>
            </Grid.Column>
        </Grid>
    )
})