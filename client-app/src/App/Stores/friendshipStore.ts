import { makeAutoObservable } from "mobx";
import { Friendship, FriendshipFormValues } from "../models/friendship";
import { store } from "./store";
import agent from "../API/agent";

export default class FriendshipStore {
    friendshipRegistry = new Array<Friendship>();
    selectedFriendship: Friendship | undefined = undefined;
    loading = false;
    loadingInitial = false;
    editMode = false;

    constructor() {
        makeAutoObservable(this);
    }

    /*loadFriendshipByFriendId(friendId: string) {
        return Array.from(this.friendshipRegistry.values()).filter(f => f.friendId === friendId);
    }*/

    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    }

    loadFriendships = async () => {
        this.loadingInitial = true;
        try {
            console.log("Loading friendships...");
            const friendships = await agent.Friendships.list();
            friendships.forEach(friendship => {
                this.friendshipRegistry.push(friendship);
                console.log("Thats a friendship: " + friendship.userName);
            });
            this.setLoadingInitial(false);
        } catch (error) {
            console.log(error);
            this.setLoadingInitial(false);
        }
    }   

    createFriendship = async(friendship: FriendshipFormValues) => {
        try{
            await agent.Friendships.create(friendship);
            this.friendshipRegistry.push(friendship);
        }
        catch (error) {
            console.log(error);
        }
    }

    deleteFriendship = async(userName: string) => {
        try{
            await agent.Friendships.delete(userName);
            this.friendshipRegistry = this.friendshipRegistry.filter(f => f.userName !== userName);
        }
        catch (error) {
            console.log(error);
        }
    }

    GetFriendships = async () => {
        this.loadingInitial = true;
        try {
            const friendships = await agent.Friendships.list();
            friendships.forEach(friendship => {
                this.friendshipRegistry.push(friendship);
            });
            this.setLoadingInitial(false);
        } catch (error) {
            console.log(error);
            this.setLoadingInitial(false);
        }   
    }
}