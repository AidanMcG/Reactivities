import { Profile } from './profile';

export interface FootballActivity {
    id: string;
    title: string;
    date: Date | null;
    description: string;
    category: string;
    city: string;
    venue: string;
    hostUsername: string;
    numberOfPlayers: number;
    isCancelled: boolean;
    attendees?: Profile[];
    isGoing?: boolean;
    isHost?: boolean;
    host?: Profile;
}

export class FootballActivity implements FootballActivity {
    constructor(init?: FootballActivityFormValues) {
        Object.assign(this, init);
    }
}

export class FootballActivityFormValues {
    id?: string = undefined;
    title: string = '';
    date: Date | null = null;
    description: string = '';
    category: string = '';
    city: string = '';
    venue: string = '';
    numberOfPlayers?: number = undefined;

    constructor(activity?: FootballActivity) {
        if (activity) {
            this.id = activity.id;
            this.title = activity.title;
            this.date = activity.date;
            this.description = activity.description;
            this.category = activity.category;
            this.city = activity.city;
            this.venue = activity.venue;
            this.numberOfPlayers = activity.numberOfPlayers;
        }
    }
}