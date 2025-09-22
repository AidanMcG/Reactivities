export interface Friendship {
    userId: string; // The ID of the current user
    friendId: string;     // The ID of the friend
    userName: string;
    status: string; // e.g., "Pending", "Accepted", "Rejected"
    createdAt: Date;
    acceptedAt?: Date | null;
}
export class Friendship implements Friendship {
    constructor(init?: Friendship) {
        Object.assign(this, init);
    }
}

export class FriendshipFormValues {
    userName: string = "";
    status: string = 'Pending'; // Default status
    userId: string = ""; // The ID of the current user
    friendId: string = "";     // The ID of the friend
    createdAt: Date = new Date();
    acceptedAt?: Date | null = null;
    constructor(friendship?: FriendshipFormValues) {
        if (friendship) {
            this.userName = friendship.userName;
            this.status = friendship.status;
            this.userId = friendship.userId;
            this.friendId = friendship.friendId;
            this.createdAt = friendship.createdAt;
            this.acceptedAt = friendship.acceptedAt;
        }
    }
}