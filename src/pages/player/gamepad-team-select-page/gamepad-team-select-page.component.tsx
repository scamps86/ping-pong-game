import React, {PropsWithChildren} from 'react';
import {teamSelect} from '../../../api/server-api';
import {EUserTeam, User} from '../../../model/user';
import './gamepad-team-select-page.component.scss';
import {useDispatch, useSelector} from 'react-redux';
import {EServerInfoScreen, ServerInfo} from '../../../model/server-info';
import {objectPick} from '../../../utils/object.utils';
import {Dispatch} from 'redux';
import {setMeAction} from '../../../redux/actions/actions';


export type TProps = PropsWithChildren<{
    history: string[];
}>;


export const GamepadTeamSelectPageComponent: React.FunctionComponent<TProps> = (props: TProps) => {

    const me: User = useSelector((state: any) => state.me);
    const serverInfo: ServerInfo = useSelector((state: any) => state.serverInfo);
    const dispatch: Dispatch = useDispatch();


    const onRedTeamSelected = () => {
        teamSelect(me.uuid, EUserTeam.red);
        me.team = EUserTeam.red;
        dispatch(setMeAction(me));
    };


    const onBlackTeamSelected = () => {
        teamSelect(me.uuid, EUserTeam.black);
        me.team = EUserTeam.black;
        dispatch(setMeAction(me));
    };

    // Redirect to match gamepad when screen is match
    if (objectPick('screen', serverInfo) === EServerInfoScreen.match) {
        props.history.push('/gamepad-match');
        return null;
    }

    // Render the team color buttons
    if (me) {
        return <div className="pad-container">
            <div className={'team red-team' + (me.team === EUserTeam.red ? ' selected' : '')}
                 onClick={onRedTeamSelected}
            />
            <div className={'team black-team' + (me.team === EUserTeam.black ? ' selected' : '')}
                 onClick={onBlackTeamSelected}
            />
        </div>
    } else {
        props.history.push('/');
        return null;
    }
};
