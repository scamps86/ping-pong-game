const io = require('socket.io')();
const cors = require('cors');
const express = require('express'),
    bodyParser = require('body-parser'),
    app = express();


const socketPort = 8010;
const serverPort = 3001;

const serverInfo = {
    users: [],
    screen: 0,
};

// Api
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());
app.listen(serverPort, () => {
    console.log('Api listening on port: ' + serverPort);
});


// API
app.post('/login', ({body}, res) => {
    console.log('API: User login', body);
    const user = {
        uuid: body.socketId,
        name: body.name,
    };
    res.json(user);
    serverInfo.users.push(user);
    console.log('CONNECTED USERS: ', serverInfo.users);
    serverInfoRefresh();
});

app.post('/team-select', ({body}, res) => {
    console.log('API: User team select', body);
    serverInfo.users = serverInfo.users.map((user) => {
        if (user.uuid === body.userId) {
            user.team = body.team;
        }
        return user;
    });
    res.json({
        message: 'team select success!',
    });
    serverInfoRefresh();
});

app.post('/machine-start-match', ({body}, res) => {
    console.log('API: Machine start match');
    serverInfo.screen = 1;
    res.json({
        message: 'machine start match success!',
    });
    serverInfoRefresh();
});

app.post('/machine-finish-match', ({body}, res) => {
    console.log('API: Machine finish match');
    serverInfo.screen = 0;
    res.json({
        message: 'machine finish match success!',
    });
    serverInfoRefresh();
});

// Sockets
io.on('connection', (socket) => {
    console.log('SOCKET ON: User connected', socket.id);
    serverInfoRefresh();

    socket.on('disconnect', function () {
        console.log('SOCKET ON: User disconnected', socket.id);
        serverInfo.users = serverInfo.users.filter((user) => {
            return user.uuid !== socket.id;
        });
        console.log('CONNECTED USERS: ', serverInfo.users);
        serverInfoRefresh();
    });

    socket.on('set-joystick-position', ({userId, y}) => {
        console.log('SOCKET ON: Set joystick position', userId, y);
        serverInfo.users = serverInfo.users.map((user) => {
            if (user.uuid === userId) {
                user.posY = y;
            }
            return user;
        });
        serverInfoRefresh();
    });
});

const serverInfoRefresh = () => {
    console.log('SOCKET EMIT: server info', serverInfo);
    io.emit('server-info-refresh', serverInfo);
};

io.listen(socketPort);
console.log('Sockets listening on port: ' + socketPort);
