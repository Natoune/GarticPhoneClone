import { UserList, Chat } from './list';
import { RoomParams } from './roomParams';

interface IRoom {
    id: string,
    hasStarted: boolean,
    params: RoomParams,
    users: UserList,
    banList: Array<string>,
    chat: Chat
}

export class Room implements IRoom {
    id: string;
    hasStarted: boolean;
    params: RoomParams;
    users: UserList;
    banList: Array<string>;
    chat: Chat;
  
    constructor(id: string, hasStarted: boolean = false, params: RoomParams = new RoomParams(), users: UserList = {}, banList: Array<string> = [], chat: Chat = {}) {
        this.id = id;
        this.hasStarted = hasStarted;
        this.params = params;
        this.users = users;
        this.banList = banList;
        this.chat = chat;
    }
}