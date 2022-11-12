import * as log4js from 'log4js';
import { TemplatedApp, App } from 'uWebSockets.js';
import { Server, Socket } from 'socket.io';
import { Room } from './interfaces/room';
import { User } from './interfaces/user';
import { RoomList } from './interfaces/list';
import { parseInt } from 'lodash';
import { createHash } from 'crypto';
require('dotenv').config();

const PORT: number = parseInt(process.env.PORT!) || 3001;

let logDate: Date = new Date();
let month: string = (logDate.getMonth()+1).toString();
let day:string  = logDate.getDate().toString();
if (month.length === 1) month = '0' + month;
if (day.length === 1) day = '0' + day;

log4js.configure({
    appenders: {
        out: { type: "stdout" },
        app: { type: "file", filename: `logs/${logDate.getFullYear()}-${month}-${day}.log` },
    },
    categories: {
        default: { appenders: ["out", "app"], level: "info" },
    },
});

const logger: log4js.Logger = log4js.getLogger('SOCKET.IO');
const app: TemplatedApp = App();
const io: Server = new Server();
io.attachApp(app);

let rooms: RoomList = {};

function escapeHtml(text: string): string {
    var map: any = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
      ' ': ''
    };
    
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

function emitAllUsers(room: string, event: string, ...args: any[]) {
    Object.values(rooms[room].users).forEach((user: User) => {
        io.to(user.socketId).emit(event, ...args);
    });
}

function getRoomFromSocketId(socketId: string) {
    let response: any = undefined;
    Object.values(rooms).forEach((room: Room) => {
        Object.values(room.users).forEach((user: User) => {
            if (user.socketId === socketId) {
                response = room.id;
            }
        });
    });
    return response;
}

function leaveRoomBySocketId(room: string, socketId: string) {
    if (typeof room !== 'undefined') {
        if (!rooms[room].hasStarted) {
            let user = Object.values(rooms[room].users).find((user: User) => user.socketId === socketId);
            logger.log(`${user!.name} has left room ${room}.`);
            if (user!.admin && Object.values(rooms[room].users).length > 1) {
                let new_admin = Object.values(rooms[room].users).sort(function (a, b) {
                    var dateA = new Date(a.date), dateB = new Date(b.date);
                    return dateA.getTime() - dateB.getTime();
                })[1];
                new_admin.admin = true;
                new_admin.badge = 'crown';
                rooms[room].users[new_admin.id] = new_admin;
                logger.log(`${new_admin.name} is now the admin of room ${room}.`);
            }
            delete rooms[room].users[user!.id];
        } else {
            let user = Object.values(rooms[room].users).find((user: User) => user.socketId === socketId);
            rooms[room].users[user!.id].temporary = true;
            logger.log(`${user!.name} has temporary left room ${room}.`);
        }
        if (Object.keys(rooms[room].users).length < 1) {
            delete rooms[room];
            logger.log(`Room ${room} is deleted: there are no more users`);
            return;
        }
        emitAllUsers(room, 'refreshRoom');
    }
}

function leaveRoomByUserId(room: string, userId: string) {
    if (typeof room !== 'undefined') {
        if (!rooms[room].hasStarted) {
            let user = rooms[room].users[userId];
            logger.log(`${user.name} has left room ${room}.`);
            if (user.admin && Object.values(rooms[room].users).length > 1) {
                let new_admin = Object.values(rooms[room].users).sort(function (a, b) {
                    var dateA = new Date(a.date), dateB = new Date(b.date);
                    return dateA.getTime() - dateB.getTime();
                })[1];
                new_admin.admin = true;
                new_admin.badge = 'crown';
                rooms[room].users[new_admin.id] = new_admin;
                logger.log(`${new_admin.name} is now the admin of room ${room}.`);
            }
            delete rooms[room].users[user.id];
        } else {
            let user = rooms[room].users[userId];
            rooms[room].users[user.id].temporary = true;
            logger.log(`${user!.name} has temporary left room ${room}.`);
        }
        if (Object.keys(rooms[room].users).length < 1) {
            delete rooms[room];
            logger.log(`Room ${room} is deleted: there are no more users`);
            return;
        }
        emitAllUsers(room, 'refreshRoom');
    }
}

function leaveAllRooms(userId: string): string {
    Object.values(rooms).forEach((room: Room) => {
        Object.values(room.users).forEach((user: User) => {
            if (user.id === userId) {
                if (room.hasStarted) return room.id;
                leaveRoomByUserId(room.id, userId);
                return 'ok';
            }
        });
    });
    return 'ok';
}

io.on('connection', (socket: Socket) => {
    socket.on('admin', (user: string, password: string, md5: string, callback: (arg0: Object) => void) => {
        if (createHash('md5').update(user).digest('hex') === process.env.ADMIN_USER && createHash('md5').update(password).digest('hex') === process.env.ADMIN_PASSWORD) {
            if (createHash('md5').update(JSON.stringify(rooms)).digest('hex').toString() !== md5) {
                callback(rooms);            
            }
        } else {
            callback({ error: true });
        }
    });

    socket.on('getPublicRooms', (callback: (arg0: Object) => void) => {
        let response: Array<Room> = [];
        Object.keys(rooms).forEach(function (key) {
            if (rooms[key].params.isPublic) {
                response.push(rooms[key]);
            }
        });
        callback({ rooms: response });
    });

    socket.on('getChat', (room: string, callback: (arg0: Object) => void) => {
        if (typeof rooms[room] !== 'undefined') {
            callback(Object.values(rooms[room].chat).sort(function (a, b) {
                var dateA = new Date(a.date), dateB = new Date(b.date);
                return dateA.getTime() - dateB.getTime();
            }));
        }
    });

    socket.on('getRoom', (room: string, userId: string, callback: (arg0: Object) => void) => {
        if (typeof rooms[room] !== 'undefined') {
            if (typeof rooms[room].users[userId] !== 'undefined') {
                if (rooms[room].users[userId].temporary) {
                    rooms[room].users[userId].temporary = false;
                    logger.info(`${rooms[room].users[userId].name} has rejoined room ${room}`);
                }
                rooms[room].users[userId].socketId = socket.id;
                callback(rooms[room]);
            } else {
                callback({
                    error: 'user_doesnt_exist'
                });
            }
        } else {
            callback({
                error: 'invalid_room',
                message: 'Cette partie n\'existe pas !'
            });
        }
    });

    socket.on('sendMessageInChat', (room: string, message: string, userId: string) => {
        if (typeof rooms[room] !== 'undefined' && typeof rooms[room].users[userId] !== 'undefined' && message.length > 0) {
            let i = Object.values(rooms[room].chat).length;
            rooms[room].chat[i] = {
                date: Date.now(),
                message: escapeHtml(message),
                name: rooms[room].users[userId].name,
                id: userId
            }
            emitAllUsers(room, 'refreshChat');
        }
    });

    socket.on('startGame', (room: string, userId: string) => {
        if (typeof rooms[room] !== 'undefined' && typeof rooms[room].users[userId] !== 'undefined' && typeof rooms[room].users[userId].admin) {
            rooms[room].hasStarted = true;
            emitAllUsers(room, 'startGame');
        }
    });

    socket.on('leaveAllRooms', (userId: string, callback: (arg0: Object) => void) => {
        callback({ status: leaveAllRooms(userId)  });
    });

    socket.on('refreshRoom', (room: string, state: string, callback: (arg0: Object) => void) => {
        if (state === 'lobby') {
            if (Object.values(rooms[room].users).length > rooms[room].params.maxUsers) {
                let usersSorted = Object.values(rooms[room].users).sort(function (a, b) {
                    var dateA = new Date(a.date), dateB = new Date(b.date);
                    return dateA.getTime() - dateB.getTime();
                });
                let extraUsers = Object.values(rooms[room].users).length - rooms[room].params.maxUsers;
                for (let i = 0; i < extraUsers; i++) {
                    delete rooms[room].users[usersSorted[usersSorted.length - i - 1].id];
                }
            }
            callback({ 
                users: Object.values(rooms[room].users).sort(function (a, b) {
                    var dateA = new Date(a.date), dateB = new Date(b.date);
                    return dateA.getTime() - dateB.getTime();
                }),
                hasStarted: rooms[room].hasStarted,
                params: rooms[room].params,
                adminId: Object.values(rooms[room].users).find((u: User) => u.admin)?.id
             });
        } else {
            return;
        }
    });

    socket.on('create', (room: string, name: string, avatar: string, userId: string, callback: (arg0: Object) => void) => {
        if (typeof rooms[room] !== 'undefined') {
            logger.error(`An error occurred while trying to create room ${room}: The room's id already exists.`);
            return callback({
                error: 'room_exists',
                message: `La partie ${room} existe déjà !`
            });
        }

        if (room.length !== 6) {
            logger.error(`An error occurred while trying to create room ${room}: The room's id is invalid.`);
            return callback({
                error: 'invalid_room_id'
            });
        }

        if (typeof name === 'undefined' || name.toString().length < 1 || typeof avatar === 'undefined' || avatar.toString().length < 1) {
            logger.error(`An error occurred while trying to create room ${room}: The creator's name or avatar is empty.`);
            return callback({
                error: 'name_or_avatar_unset',
                message: `Veuillez choisir un avatar et un nom !`
            });
        }

        leaveAllRooms(userId);

        rooms[room] = new Room(room);
        rooms[room].users[userId] = new User(
            escapeHtml(name.toLowerCase()),
            userId,
            '',
            Date.now(),
            parseInt(avatar),
            'crown',
            true
        );

        logger.info(`${name} created room ${room}.`);
        return callback({ room });
    });

    socket.on('enterRoom', (room: string, name: string, avatar: number, admin: boolean, userId, callback: (arg0: Object) => void) => {
        if (typeof room === 'undefined' || room.length !== 6 || typeof rooms[room] === "undefined") {
            logger.error(`An error occurred while trying to enter room ${room}: The room's id is invalid.`);
            return callback({
                error: 'invalid_room',
                message: `Cette partie n'existe pas !`
            });
        }

        let user: User = Object.values(rooms[room].users).find((obj) => {
            return obj.name === (name ? name.toLowerCase() : '');
        })!;

        if ((admin && typeof user === "undefined") || (admin && !user.admin)) {
            logger.error(`An error occurred while trying to enter room ${room}: The user ${name} is not admin in the room.`);
            return callback({
                error: 'not_admin_user',
                message: `Cet utilisateur n'est pas admin dans la partie ${room} !`
            });
        } else if (!admin && typeof user !== "undefined") {
            if (user.id !== userId) {
                logger.error(`An error occurred while trying to enter room ${room}: The user ${name} already exists in the room.`);
                return callback({
                    error: 'user_already_exists',
                    message: `Un utilisateur avec le nom ${name} existe déjà dans la partie !`
                });
            }
        }
        if (Object.keys(rooms[room].users).length + 1 > rooms[room].params.maxUsers) {
            logger.error(`An error occurred while trying to enter room ${room}: The maximum number of users in this room is ${rooms[room].params.maxUsers}.`);
            return callback({
                error: 'room_full',
                message: `Il y a déjà le nombre maximum de joueurs dans cette partie !`
            });
        }

        if (typeof user === "undefined") {
            leaveAllRooms(userId);

            rooms[room].users[userId] = new User(
                escapeHtml(name.toLowerCase()),
                userId,
                socket.id,
                Date.now(),
                avatar,
            );
        } else {
            rooms[room].users[userId].socketId = socket.id;
            rooms[room].users[userId].avatar = avatar;
        }

        if (rooms[room].banList.find((id: string) => userId === id)) {
            rooms[room].users[userId].banned = true;
        }

        emitAllUsers(room, 'refreshRoom');

        logger.info(`${name} joined room ${room}.`);
        return callback({
            admin,
            users: Object.values(rooms[room].users).sort(function (a, b) {
                var dateA = new Date(a.date), dateB = new Date(b.date);
                return dateA.getTime() - dateB.getTime();
            }),
            params: rooms[room].params
        });
    });

    socket.on('params', (room: string, param: string, value: any, userId: string) => {
        if (typeof rooms[room] !== 'undefined' && typeof rooms[room].users[userId] !== 'undefined' && rooms[room].users[userId].admin) {
            if (param === 'maxUsers' && !isNaN(parseInt(value))) {
                if (parseInt(value) > 25) rooms[room].params.maxUsers = 25;
                else if (parseInt(value) < 4) rooms[room].params.maxUsers = 4;
                else rooms[room].params.maxUsers = parseInt(value);
            }

            if (param === 'visibility' && typeof value === 'boolean')
                rooms[room].params.isPublic = value;

            if (param === 'duration') {
                if (value === 'lente') rooms[room].params.duration = 'slow';
                if (value === 'normale') rooms[room].params.duration = 'normal';
                if (value === 'rapide') rooms[room].params.duration = 'fast';
                if (value === 'choix de l\'hôte à chaque tour') rooms[room].params.duration = 'host';
            }

            emitAllUsers(room, 'refreshRoom');
        }
    });

    socket.on('ban', (room: string, value: string, userId: string) => {
        if (typeof rooms[room] !== 'undefined' && typeof rooms[room].users[value] && typeof rooms[room].users[userId] !== 'undefined' && rooms[room].users[userId].admin) {
            rooms[room].users[value].banned = true;
            rooms[room].banList.push(value);
            emitAllUsers(room, 'refreshRoom');
        }
    });

    socket.on('disconnect', () => {
        let room = getRoomFromSocketId(socket.id);
        if (typeof room !== 'undefined') {
            leaveRoomBySocketId(room, socket.id);
        }
    });
});

app.listen(PORT, (token) => {
    if (!token) throw new Error(`The port ${PORT} is already used !`);
    console.log(`Listening to port ${PORT}`);
});