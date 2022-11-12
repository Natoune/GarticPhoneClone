interface IUser {
    name: string,
    id: string,
    socketId: string,
    date: number,
    avatar: number,
    badge: string,
    admin: boolean,
    banned: boolean,
    temporary: boolean,
}

export class User implements IUser {
    name: string;
    id: string;
    socketId: string;
    date: number;
    avatar: number;
    badge: string;
    admin: boolean;
    banned: boolean;
    temporary: boolean;
  
    constructor(name: string, id: string, socketId: string, date: number, avatar: number, badge: string = '', admin: boolean = false, banned: boolean = false, temporary: boolean = false) {
        this.name = name;
        this.id = id;
        this.socketId = socketId;
        this.date = date;
        this.avatar = avatar;
        this.badge = badge;
        this.admin = admin;
        this.banned = banned;
        this.temporary = temporary;
    }
}