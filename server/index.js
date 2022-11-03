const { App } = require("uWebSockets.js");
const { Server } = require('socket.io');
const PORT = process.env.PORT || 3001;

let logDate = new Date();
let month = (logDate.getMonth()+1).toString();
let day = logDate.getDate().toString();
if (month.length === 1) month = '0' + month;
if (day.length === 1) day = '0' + day;
const log4js = require("log4js");
log4js.configure({
    appenders: {
        out: { type: "stdout" },
        app: { type: "file", filename: `logs/${logDate.getFullYear()}-${month}-${day}.log` },
    },
    categories: {
        default: { appenders: ["out", "app"], level: "info" },
    },
});
const logger = log4js.getLogger('SOCKET.IO');
const app = new App();
const io = new Server();
io.attachApp(app);

let rooms = {};

io.on('connection', socket => {
    socket.on('getPublicRooms', callback => {
        let response = [];
        Object.keys(rooms).forEach(function (key, index) {
            if (rooms[key].public) {
                response.push(rooms[key]);
            }
        });
        callback({ rooms: response });
    });

    socket.on('create', (room, name, avatar, callback) => {
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

        logger.info(`${name} created room ${room}`);
        rooms[room] = {
            public: true,
            id: room,
            maxUsers: 10,
            users: []
        };
        rooms[room].users.push({
            name: name.toLowerCase(),
            id: socket.id,
            admin: true
        });

        socket.leaveAll();
        socket.join(room);

        return callback({
            room: room
        });
    });

    socket.on('enterRoom', (room, name, admin, callback) => {
        if (typeof room === 'undefined' || room.length !== 6 || typeof rooms[room] === "undefined") {
            logger.error(`An error occurred while trying to enter room ${room}: The room's id is invalid.`);
            return callback({
                error: 'invalid_room',
                message: `Cette partie n'existe pas !`
            });
        }

        let user = (rooms[room].users.find(o => o.name === name.toLowerCase()));

        if ((admin && typeof user === "undefined") || (admin && !user.admin)) {
            logger.error(`An error occurred while trying to enter room ${room}: The user ${name} is not admin in the room.`);
            return callback({
                error: 'not_admin_user',
                message: `Cet utilisateur n'est pas admin dans la partie ${room} !`
            });
        } else if (!admin && typeof user !== "undefined") {
            console.log(user.id);
            console.log(socket.id);
            if (user.id !== socket.id) {
                logger.error(`An error occurred while trying to enter room ${room}: The user ${name} already exists in the room.`);
                return callback({
                    error: 'user_already_exists',
                    message: `Un utilisateur avec le nom ${name} existe déjà dans la partie !`
                });
            }
        }
        if (rooms[room].users.length+1 > rooms[room].maxUsers) {
            logger.error(`An error occurred while trying to enter room ${room}: The maximum number of users in this room is ${rooms[room].maxUsers}.`);
            return callback({
                error: 'room_full',
                message: `Il y a déjà le nombre maximum de joueurs dans cette partie !`
            });
        }

        if (typeof user === "undefined") {
            socket.leaveAll();
            socket.join(room);

            rooms[room].users.push({
                name: name,
                id: socket.id,
                admin: false
            });
        }

        console.log(name + ' ' + socket.id);
        console.log(rooms[room].users);

        callback({

        });
    });
});

app.listen(PORT, (token) => {
    console.log(`Listening to port ${PORT}`);
});