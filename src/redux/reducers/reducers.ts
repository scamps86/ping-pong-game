import {EAction, IAction} from '../actions/actions';
import {ServerInfo} from '../../model/server-info';
import {combineReducers} from 'redux';
import {User} from '../../model/user';


const serverInfoReducer = (state: ServerInfo = null, action: IAction<ServerInfo>): ServerInfo => {
    switch (action.type) {
        case EAction.setServerInfo:
            return new ServerInfo(action.data);
        default:
            return state;
    }
};

const meReducer = (state: User = null, action: IAction<User>): User => {
    switch (action.type) {
        case EAction.setMe:
            return new User(action.data);
        default:
            return state;
    }
};


export default combineReducers({
    serverInfo: serverInfoReducer,
    me: meReducer,
});
