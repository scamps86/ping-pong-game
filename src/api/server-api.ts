import axios, {AxiosResponse} from 'axios';
import {host, port} from '../config/api-config';
import {EUserTeam, User} from '../model/user';
import {socket} from './socket-api';


const baseUrl = host + ':' + port;


export const doLogin = (name: string): Promise<any> => {
    console.log('SERVER API: do login', name);
    const socketId = socket.id;
    return axios.post(
        baseUrl + '/login',
        {
            name,
            socketId,
        },
    ).then(({data}: AxiosResponse) => {
        return new User(data);
    });
};


export const teamSelect = (userId: string, team: EUserTeam): Promise<any> => {
    console.log('SERVER API: team select', userId, team);
    return axios.post(
        baseUrl + '/team-select',
        {
            userId,
            team,
        },
    );
};


export const machineStartMatch = (): Promise<any> => {
    console.log('SERVER API: machine start match');
    return axios.post(
        baseUrl + '/machine-start-match',
    );
};


export const machineFinishMatch = (): Promise<any> => {
    console.log('SERVER API: machine finish match');
    return axios.post(
        baseUrl + '/machine-finish-match',
    );
};
