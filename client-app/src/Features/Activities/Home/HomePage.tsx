import { observer } from 'mobx-react-lite';
import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Image, Button, Header } from 'semantic-ui-react';
import { useStore } from '../../../App/Stores/store';
import LoginForm from '../../Users/LoginForm';
import RegisterForm from '../../Users/RegisterForm';

export default observer(function HomePage() {
    const { userStore, modalStore } = useStore();
    return (
        <Container className='masthead' fluid>
            <div className='masthead-content'>
                <Image
                    size='large'
                    src='/assets/logo.png'
                    alt='Logo'
                    className='masthead-logo'
                />
                <Header as='h1' className='masthead-title'>
                    Reactivities
                </Header>
                <Header as='h2' className='masthead-tagline'>
                    Get out there. Find your next activity.
                </Header>
                <div className='masthead-actions'>
                    {userStore.isLoggedIn ? (
                        <Button
                            as={Link}
                            to='/activities'
                            size='huge'
                            className='masthead-cta-primary'
                        >
                            Go to Activities
                        </Button>
                    ) : (
                        <>
                            <Button
                                onClick={() => modalStore.openModal(<LoginForm />)}
                                size='huge'
                                className='masthead-cta-primary'
                            >
                                Login
                            </Button>
                            <Button
                                onClick={() => modalStore.openModal(<RegisterForm />)}
                                size='huge'
                                className='masthead-cta-secondary'
                            >
                                Register
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </Container>
    );
});
