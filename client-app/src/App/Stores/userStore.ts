import { makeAutoObservable, runInAction } from "mobx";
import { history } from "../..";
import agent from "../API/agent";
import { User, UserFormValues } from "../models/user";
import { store } from "./store";

export default class UserStore {
    user: User | null = null;
    selectedUser: User | null = null;
    loadingInitial = false;
    
    constructor() {
        makeAutoObservable(this)
    }

    get isLoggedIn() {
        return !!this.user;
    }

    login = async (creds: UserFormValues) => {
        try {
            const user = await agent.Account.login(creds);
            store.commonStore.setToken(user.token);
            runInAction(() => this.user = user);
            history.push('/activities')
            store.modalStore.closeModal();
        }
        catch (error) {
            throw error;
        }
    }

    logout = () => {
        store.commonStore.setToken(null);
        window.localStorage.removeItem('jwt');
        this.user = null;
        history.push('/');
    }

    getUser = async () => {
        this.loadingInitial = true;
        try {
            const user = await agent.Account.current();
            runInAction(() => this.user = user);
            this.setLoadingInitial(false);
        }
        catch (error) {
            console.log(error);
            this.setLoadingInitial(false);
        }
    }

    getUserByUsername = async (username: string) => {
        this.loadingInitial = true;
        try {
            const selectedUser = await agent.Account.getUserByUsername(username);
            runInAction(() => this.selectedUser = selectedUser);
            this.setLoadingInitial(false);
        }
        catch (error) {
            console.log(error);
            this.setLoadingInitial(false);
        }
    }

    getUserDetailsById = async (userId: string) => {
    try {
        // Assuming you have an endpoint like '/users/{userId}' in your API
        const friend = await agent.Account.getUserById(userId); 
        return friend; // This object should contain properties like 'userName'
    } catch (error) {
        console.log(`Failed to fetch user with ID ${userId}:`, error);
        return null;
    }
}

    register = async (creds: UserFormValues) => {
        try {
            const user = await agent.Account.register(creds);
            store.commonStore.setToken(user.token);
            runInAction(() => this.user = user);
            history.push('/activities')
            store.modalStore.closeModal();
        }
        catch (error) {
            throw error;
        }
    }

    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    }
    
}