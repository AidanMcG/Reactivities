import axios, { AxiosError, AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import { history } from '../..';
import { Activity, ActivityFormValues } from '../models/activity';
import { User, UserFormValues } from '../models/user';
import { store } from '../Stores/store';
import { FootballActivity, FootballActivityFormValues } from '../models/footballActivity';
import { Friendship, FriendshipFormValues } from '../models/friendship';
import { get } from 'http';

const sleep = (delay: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay)
    })
}

axios.defaults.baseURL = 'http://localhost:5000/api';

axios.interceptors.request.use(config => {
    const token = store.commonStore.token;
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config;
})

axios.interceptors.response.use(async response =>  {
        await sleep(1000);
        return response;
}, (error: AxiosError) => {
    const {data, status, config} = error.response!;
    switch (status) {
        case 400:
            if (typeof data === 'string') {
                toast.error(data);
            }
            if (config.method === 'get' && data.errors.hasOwnProperty('id')){
                history.push('/not-found');
            }
            if (data.errors) {
                const modalStateErrors = [];
                for (const key in data.errors){
                    if (data.errors[key]){
                        modalStateErrors.push(data.errors[key])
                    }
                }
                throw modalStateErrors.flat();
            }
            break;
        case 401:
            toast.error('unauthorized');
            break;
        case 404:
            history.push('/not-found');
            break;
        case 500:
            store.commonStore.setServerError(data);
            history.push('/server-error');
            break;
    }
    return Promise.reject(error);
})

const responseBody = <T> (response: AxiosResponse<T>) => response.data;

const requests = {
    get: <T> (url: string) => axios.get<T>(url).then(responseBody),
    post: <T> (url: string, body: {}) => axios.post<T>(url,body).then(responseBody),
    put: <T> (url: string, body: {}) => axios.put<T>(url,body).then(responseBody),
    del: <T> (url: string) => axios.delete<T>(url).then(responseBody),
}

const Activities ={
    list: () => requests.get<Activity[]>('/activities'),
    details: (id: string) => requests.get<Activity>(`/activities/${id}`),
    create: (activity: ActivityFormValues) => requests.post<void>('/activities', activity),
    update: (activity: ActivityFormValues) => requests.put<void>(`/activities/${activity.id}`,activity),
    delete: (id: string) => requests.del<void>(`/activities/${id}`),
    attend: (id: string) => requests.post<void>(`/activities/${id}/attend`,{})
}

const FootballActivities = {
    list: () => requests.get<FootballActivity[]>('/footballactivities'),
    details: (id: string) => requests.get<FootballActivity>(`/footballactivities/${id}`),
    create: (activity: FootballActivityFormValues) => requests.post<void>('/footballactivities', activity),
    update: (activity: FootballActivityFormValues) => requests.put<void>(`/footballactivities/${activity.id}`, activity),
    delete: (id: string) => requests.del<void>(`/footballactivities/${id}`),
    attend: (id: string) => requests.post<void>(`/footballactivities/${id}/attend`, {})
}

const Friendships = {
    create: (friendship: FriendshipFormValues) => requests.post<void>('/friendship', friendship),
    details: (userId: string, friendId: string) => requests.get<Friendship>(`/friendship/${userId}/${friendId}`),
    update: (friendship: FriendshipFormValues) => requests.put<void>(`/friendship/${friendship.userName}`, friendship),
    delete: (userName: string) => requests.del<void>(`/friendship/${userName}`),
    list: () => requests.get<Friendship[]>('/friendship')
}


const Account = {
    current: () => requests.get<User>('/account'),
    login: (user: UserFormValues) => requests.post<User>('/account/login', user),
    register: (user: UserFormValues) => requests.post<User>('/account/register', user),
    getUserByUsername: (username: string) => requests.get<User>(`/account/${username}`),
    getUserById: (userId: string) => requests.get<User>(`/account/id/${userId}`)
}

const agent = {
    Activities,
    FootballActivities,
    Account,
    Friendships
}

export default agent;