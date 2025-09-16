import { observer } from 'mobx-react-lite';
import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Header, Segment, Image, Button } from 'semantic-ui-react';
import { useStore } from '../../../App/Stores/store';
import LoginForm from '../../Users/LoginForm';
import RegisterForm from '../../Users/RegisterForm';

export default observer(function HomePage() {
    const {userStore, modalStore} = useStore();
    return (
        <Segment inverted textAlign='center' vertical className='masthead'>
            <Container text>
                <Header as='h1' inverted>
                    
                    
                </Header>
                {userStore.isLoggedIn ? (
                    <>
                        <Button as={Link} to='/activities'  size='massive' inverted>
                            <Image size='massive' src='/assets/logo.png' alt='logo' style={{marginBottom: 12}} />
                        </Button>
                    </>
                
                ) : (
                        <>
                            <Button onClick={() => modalStore.openModal(<LoginForm />)} size='huge' inverted>
                                Login!
                            </Button>
                            <Button onClick={() => modalStore.openModal(<RegisterForm/>)} size='huge' inverted>
                                Register!
                            </Button>
                        </>
                )}
            </Container>
        </Segment>
    )
})