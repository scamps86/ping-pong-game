import {ServerInfo} from '../model/server-info';
import {User} from '../model/user';


export interface IState {
    serverInfo: ServerInfo,
    me: User,
}
