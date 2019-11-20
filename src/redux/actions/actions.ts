import {ServerInfo} from '../../model/server-info';
import {User} from '../../model/user';

export enum EAction {
    setServerInfo,
    setMe,
}

export interface IAction<T> {
    type: EAction,
    data?: T;
}


export const setServerInfoAction = (data: ServerInfo): IAction<ServerInfo> => {
    return {
        type: EAction.setServerInfo,
        data,
    }
};

export const setMeAction = (data: User): IAction<User> => {
    return {
        type: EAction.setMe,
        data,
    }
};
