import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Icon, Image } from 'semantic-ui-react';
import { Profile } from '../../App/models/profile';
import { useStore } from '../../App/Stores/store';
import LoadingComponent from '../../App/Layout/LoadingComponents';

interface Props {
    profile: Profile;
}

export default observer(function ProfileCard({profile}: Props) {
    const {friendshipStore: {createFriendship, friendshipRegistry, loadFriendships, loadingInitial, selectedFriendship, deleteFriendship}} = useStore();
    const {userStore: {user}} = useStore();

    /*useEffect(() => {
        loadFriendships();
    },[friendshipRegistry]);*/
    
    if (loadingInitial) return <LoadingComponent content='Loading activity...'/>
    return (
        <Card as={Link} to={`/profile/${profile.username}`}>
            <Image src={profile.image || '/assets/user.png'}></Image>
            <Card.Content>
                <Card.Header>{profile.displayName}</Card.Header>
                <Card.Description>Bio goes here</Card.Description>
            </Card.Content>
            <Card.Content extra>
                <Icon name='user' />
                20 Followers
            </Card.Content>
            {
                user?.username === profile.username ? null :
                    friendshipRegistry.some(f => f.userName === profile.username) ?
                    <Button
                        fluid
                        color='red'
                        content={friendshipRegistry.find(f => f.userName === profile.username)?.status == "Pending" ? 'Cancel Friend Request' : 'Remove Friend'}
                        onClick={() =>
                            deleteFriendship(profile.username)
                        }/>
                    :
                    <Button
                        fluid
                        color='green'
                        content='Add Friend'
                        onClick={() =>
                            createFriendship({
                                userName: profile.username,
                                status: 'Pending',
                                createdAt: new Date(),
                                userId: "",
                                friendId: ""
                            })
                        }
                    />
                
            }

        </Card>
    )
})