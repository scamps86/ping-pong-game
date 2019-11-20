import openSocket from "socket.io-client";
import {Subject} from 'rxjs';
import {IServerInfo, ServerInfo} from '../model/server-info';
import {host, socketPort} from '../config/api-config';


export const socket = openSocket(host + ':' + socketPort);

export const onServerInfoRefresh = () => {
    console.log('SOCKET API: Listen for server info refresh...');

    const s: Subject<ServerInfo> = new Subject();
    socket.on('server-info-refresh', (serverInfo: IServerInfo) => {
        s.next(new ServerInfo(serverInfo));
    });
    return s.asObservable();
};


export const setJoystickPosition = (userId: string, y: number) => {
    socket.emit('set-joystick-position', {
        userId,
        y,
    });
};
