interface IRoomParams {
    isPublic: boolean,
    maxUsers: number,
    duration: string
}

export class RoomParams implements IRoomParams {
    isPublic: boolean;
    maxUsers: number;
    duration: string;
  
    constructor(isPublic: boolean = false, maxUsers: number = 10, duration: string = 'normal') {
        this.isPublic = isPublic;
        this.maxUsers = maxUsers;
        this.duration = duration;
    }
}