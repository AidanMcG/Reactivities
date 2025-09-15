import { format } from "date-fns";
import { makeAutoObservable, runInAction } from "mobx";
import agent from "../../API/agent";
import { FootballActivity, FootballActivityFormValues } from "../../models/footballActivity";
import { Profile } from "../../models/profile";
import { store } from "../store";

export default class FootballActivityStore {
    footballActivityRegistry = new Map<string, FootballActivity>();
    selectedFootballActivity: FootballActivity | undefined = undefined;
    editMode = false;
    loading = false;
    loadingInitial = false;

    constructor() {
        makeAutoObservable(this);
    }

    get footballActivitiesByDate() {
        return Array.from(this.footballActivityRegistry.values()).sort((a, b) => a.date!.getTime() - b.date!.getTime());
    }

    get groupedFootballActivities() {
        return Object.entries(
            this.footballActivitiesByDate.reduceRight((activities, activity) => {
                const date = format(activity.date!, 'dd MMM yyyy');
                activities[date] = activities[date] ? [...activities[date], activity] : [activity];
                return activities;
            }, {} as { [key: string]: FootballActivity[] })
        );
    }

    loadFootballActivities = async () => {
        this.loadingInitial = true;
        try {
            const activities = await agent.FootballActivities.list();
            activities.forEach(activity => {
                this.setFootballActivity(activity);
            });
            this.setLoadingInitial(false);
        } catch (error) {
            console.log(error);
            this.setLoadingInitial(false);
        }
    }

    loadFootballActivity = async (id: string) => {
        let activity = this.getFootballActivity(id);
        if (activity) {
            this.selectedFootballActivity = activity;
            return activity;
        } else {
            this.loadingInitial = true;
            try {
                activity = await agent.FootballActivities.details(id);
                this.setFootballActivity(activity);
                runInAction(() => {
                    this.selectedFootballActivity = activity;
                });
                this.setLoadingInitial(false);
                return activity;
            } catch (error) {
                console.log(error);
                this.setLoadingInitial(false);
            }
        }
    }

    private setFootballActivity = (activity: FootballActivity) => {
        const user = store.userStore.user;
        if (user) {
            activity.isGoing = activity.attendees!.some(a => a.username === user.username);
            activity.isHost = activity.hostUsername === user.username;
            activity.host = activity.attendees?.find(x => x.username === activity.hostUsername);
        }
        activity.date = new Date(activity.date!);
        this.footballActivityRegistry.set(activity.id, activity);
    }

    private getFootballActivity = (id: string) => {
        return this.footballActivityRegistry.get(id);
    }

    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    }

    createFootballActivity = async (activity: FootballActivityFormValues) => {
        const user = store.userStore.user;
        const attendee = new Profile(user!);
        try {
            await agent.FootballActivities.create(activity);
            const newActivity = new FootballActivity(activity);
            newActivity.hostUsername = user!.username;
            newActivity.attendees = [attendee];
            this.setFootballActivity(newActivity);
            runInAction(() => {
                this.selectedFootballActivity = newActivity;
            });
        } catch (error) {
            console.log(error);
        }
    }

    updateFootballActivity = async (activity: FootballActivityFormValues) => {
        try {
            await agent.FootballActivities.update(activity);
            runInAction(() => {
                if (activity.id) {
                    let updatedActivity = { ...this.getFootballActivity(activity.id), ...activity };
                    this.footballActivityRegistry.set(activity.id, updatedActivity as FootballActivity);
                    this.selectedFootballActivity = updatedActivity as FootballActivity;
                }
            });
        } catch (error) {
            console.log(error);
        }
    }

    deleteFootballActivity = async (id: string) => {
        this.loading = true;
        try {
            await agent.FootballActivities.delete(id);
            runInAction(() => {
                this.footballActivityRegistry.delete(id);
                this.loading = false;
            });
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            });
        }
    }

    updateFootballAttendance = async () => {
        const user = store.userStore.user;
        this.loading = true;
        try {
            await agent.FootballActivities.attend(this.selectedFootballActivity!.id);
            runInAction(() => {
                if (this.selectedFootballActivity?.isGoing) {
                    this.selectedFootballActivity.attendees = this.selectedFootballActivity.attendees?.filter(a => a.username !== user?.username);
                    this.selectedFootballActivity.isGoing = false;
                } else {
                    if (this.selectedFootballActivity?.attendees/* && this.selectedFootballActivity.attendees.length < this.selectedFootballActivity?.numberOfPlayers*/) {
                        const attendee = new Profile(user!);
                        this.selectedFootballActivity?.attendees?.push(attendee);
                        this.selectedFootballActivity!.isGoing = true;
                    }
                }
                this.footballActivityRegistry.set(this.selectedFootballActivity!.id, this.selectedFootballActivity!);
            });
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => this.loading = false);
        }
    }

    cancelFootballActivityToggle = async () => {
        this.loading = true;
        try {
            await agent.FootballActivities.attend(this.selectedFootballActivity!.id);
            runInAction(() => {
                this.selectedFootballActivity!.isCancelled = !this.selectedFootballActivity?.isCancelled;
                this.footballActivityRegistry.set(this.selectedFootballActivity!.id, this.selectedFootballActivity!);
            });
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => this.loading = false);
        }
    }
}