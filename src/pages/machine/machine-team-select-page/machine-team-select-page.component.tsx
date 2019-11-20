import React, {PropsWithChildren} from 'react';
import {EUserTeam, User} from '../../../model/user';
import './machine-team-select-page.component.scss';
import {EServerInfoScreen, ServerInfo} from '../../../model/server-info';
import {useSelector} from 'react-redux';
import {machineStartMatch} from '../../../api/server-api';
import {objectPick} from '../../../utils/object.utils';


export type TProps = PropsWithChildren<{
    history: string[];
}>;


export const MachineTeamSelectPageComponent: React.FunctionComponent<TProps> = (props: TProps) => {

    const serverInfo: ServerInfo = useSelector((state: any) => state.serverInfo);

    const doStartGame = () => {
        machineStartMatch();
    };

    const getTeamClassName = (u: User): string => {
        if (u.team === EUserTeam.red) {
            return 'red-team';
        }
        if (u.team === EUserTeam.black) {
            return 'black-team';
        }
    };

    const areAllPlayersWithTeam = () => {
        return serverInfo.users.filter((u: User) => {
            return typeof u.team === 'undefined';
        }).length === 0;
    };

    // Redirect to match gamepad when screen is match
    if (objectPick('screen', serverInfo) === EServerInfoScreen.match) {
        props.history.push('/machine-match');
        return null;
    }


    if (serverInfo && serverInfo.users && serverInfo.users.length > 0) {
        return <div className="mt-5">
            <div className="text-center mb-5">
                <h2>Tria el color del teu equip!</h2>
            </div>
            <div className="mb-5 d-flex justify-content-center">
                {serverInfo.users.map((u: User, i: number) => {
                    return <div key={i}
                                className={'player-box my-2 mx-2 ' + (getTeamClassName(u))}>
                        {u.name}
                    </div>
                })}
            </div>

            <div className="mt-5 text-center">
                <button className="btn btn-primary mt-5"
                        onClick={doStartGame}
                        disabled={!areAllPlayersWithTeam()}
                >
                    <h3 className="mt-1">Començar partida!</h3>
                </button>
            </div>
        </div>;
    } else {
        return <div className="alert alert-info text-center">
            <h1>Esperant jugadors...</h1>
        </div>;
    }
};
