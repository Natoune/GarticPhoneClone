import { Room } from './room';
import { User } from './user';

export interface RoomList {
    [key: string]: Room
}

export interface UserList {
    [key: string]: User
}

export interface Chat {
    [key: number]: { name: string, message: string, date: number, id: string }
}
