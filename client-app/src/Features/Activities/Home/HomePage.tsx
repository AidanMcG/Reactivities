import { observer } from 'mobx-react-lite';
import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Image, Button } from 'semantic-ui-react';
import { useStore } from '../../../App/Stores/store';
import LoginForm from '../../Users/LoginForm';
import RegisterForm from '../../Users/RegisterForm';

export default observer(function HomePage() {
    const {userStore, modalStore} = useStore();
    return (
        /* The .masthead class will now directly center its content,
         * ensuring the background fills the viewport and the logo and buttons
         * are perfectly aligned.
         */
        <Container className='masthead' fluid>
            {/* We use simple divs now to avoid the layout conflicts of the Grid component */}
            <div style={{ textAlign: 'center' }}>
                <Image size='large' src='/assets/logo.png' alt='logo' className='home page logo' />
                <div style={{ marginTop: '2rem' }}>
                    {userStore.isLoggedIn ? (
                        <Button as={Link} to='/activities' size='huge' inverted color='black' textcolor='black'>
                            Show me the magic!
                        </Button>
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
                </div>
            </div>
        </Container>
    )
})
