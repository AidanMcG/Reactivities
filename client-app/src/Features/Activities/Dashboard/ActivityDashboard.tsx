import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { Grid, Header, Segment } from 'semantic-ui-react';
import LoadingComponent from '../../../App/Layout/LoadingComponents';
import { useStore } from '../../../App/Stores/store';
import ActivityFilters from './ActivityFilters';
import ActivityList from './ActivityList';

export default observer(function ActivityDashboard() {
    const { activityStore, friendshipStore } = useStore();
    const { loadActivities, activityRegistry } = activityStore;
    const { loadFriendships } = friendshipStore;

    useEffect(() => {
        if (activityRegistry.size === 0) loadActivities();
    }, [loadActivities]);

    useEffect(() => {
        loadFriendships();
    }, [loadFriendships]);

    if (activityStore.loadingInitial) return <LoadingComponent content='Loading activities...' />;

    return (
        <div className='activity-dashboard'>
            <Header as='h1' className='activity-dashboard-title'>
                Events
            </Header>
            <p className='activity-dashboard-subtitle'>
                Browse and join events near you
            </p>
            <Grid stackable relaxed>
                <Grid.Column width={11}>
                    <div className='activity-dashboard-list'>
                        <ActivityList />
                    </div>
                </Grid.Column>
                <Grid.Column width={5}>
                    <Segment className='activity-dashboard-filters'>
                        <ActivityFilters />
                    </Segment>
                </Grid.Column>
            </Grid>
        </div>
    );
});