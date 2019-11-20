import {IUser, User} from './user';


export enum EServerInfoScreen {
    teamSelect,
    match,
}

export interface IServerInfo {
    users: IUser[],
    screen: EServerInfoScreen;
}


export class ServerInfo {

    public users: User[];
    public screen: EServerInfoScreen;


    constructor(serverInfo: IServerInfo) {
        this.users = serverInfo.users.map((u: IUser) => {
            return new User(u);
        });
        this.screen = serverInfo.screen;
    }

}
