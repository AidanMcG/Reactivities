import { observer } from 'mobx-react-lite';
import React, { Fragment } from 'react';
import { Grid, Header } from 'semantic-ui-react';
import { useStore } from '../../../App/Stores/store';
import ActivityListItem from './ActivityListItem';



export default observer(function ActivityList() {
    const {activityStore} = useStore();
    const {groupedActivities} = activityStore;


    return(
        <>
            {groupedActivities.map(([group, activities])=>(
                <Fragment key={group}>
                    <Header sub color='teal' size='huge'>
                        {group}
                    </Header>
                    <Grid>
                        {activities.map(activity => (
                            <Grid.Column width={8} key={activity.id}>
                                <ActivityListItem activity={activity}/>
                            </Grid.Column>
                        ))}
                    </Grid>
                </Fragment>
            ))}
        </>
    )
})