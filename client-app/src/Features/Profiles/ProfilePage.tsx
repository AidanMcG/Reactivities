import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Card, Container, Grid, Header, Icon, Image, Segment, Tab } from 'semantic-ui-react';
import { Profile } from '../../App/models/profile';
import { useStore } from '../../App/Stores/store';
import LoadingComponent from '../../App/Layout/LoadingComponents';

interface Props {
    profile: Profile;
}

export default observer(function ProfileCard() {
        const {userStore} = useStore();
        const {getUserByUsername, user, loadingInitial} = userStore;
        const {username} = useParams<{username: string}>();

    useEffect(() => {
        if (username) getUserByUsername(username);
    }, [username, getUserByUsername]);

    if(loadingInitial || !user) return <LoadingComponent />

    const panes = [
      {
        menuItem: 'About',
        render: () => (
          <Tab.Pane>
            <Header as='h4'>About</Header>
            <p>{ 'No bio available.'}</p>
          </Tab.Pane>
        ),
      },
      {
        menuItem: 'Photos',
        render: () => (
          <Tab.Pane>
            <Header as='h4'>Photos</Header>
            <p>No photos available.</p>
          </Tab.Pane>
        ),
      },
    ];

    return (
        <Container style={{ marginTop: '2em' }}>
    <Grid>
      <Grid.Column width={4}>
        <Card fluid>
          <Image src='https://react.semantic-ui.com/images/avatar/large/matthew.png' wrapped ui={false} />
          <Card.Content>
            <Card.Header>{user?.username}</Card.Header>
            <Card.Meta>
              <span className='date'>Joined in 2021</span>
            </Card.Meta>
            <Card.Description>
              A web developer passionate about React and UI/UX design.
            </Card.Description>
          </Card.Content>
          <Card.Content extra>
            <a>
              <Icon name='user' />
              22 Friends
            </a>
          </Card.Content>
        </Card>
      </Grid.Column>

      <Grid.Column width={12}>
        <Header as='h2'>User Profile</Header>
        <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
      </Grid.Column>
    </Grid>
  </Container>
    )
})