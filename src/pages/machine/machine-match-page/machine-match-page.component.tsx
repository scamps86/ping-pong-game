import React, {PropsWithChildren, useState} from 'react';
import {EServerInfoScreen} from '../../../model/server-info';
import {useSelector} from 'react-redux';
import {machineFinishMatch} from '../../../api/server-api';
import './machine-match-page.component.scss';
import {GameZoneComponent} from './components/game-zone/game-zone.component';
import {objectPick} from '../../../utils/object.utils';
import {EUserTeam} from '../../../model/user';


export type TProps = PropsWithChildren<{
    history: string[];
}>;

interface IScore {
    red: number;
    black: number;
}


export const MachineMatchPageComponent: React.FunctionComponent<TProps> = (props: TProps) => {

    const screen: EServerInfoScreen = useSelector((state: any) => objectPick('serverInfo.screen', state));
    const [score, setScore] = useState<IScore>({
        red: 0,
        black: 0,
    });
    const [gameZoneHeight, setGameZoneHeight] = useState(0);
    const [gameZoneWidth, setGameZoneWidth] = useState(0);

    const doFinishMatch = () => {
        machineFinishMatch();
    };

    const increaseTeamScore = (team: EUserTeam) => {
        console.log('Set team score', team, score);
        if (team === EUserTeam.red) {
            setScore((score) => {
                return {
                    ...score,
                    red: score.red + 1,
                }
            });
        } else {
            setScore((score) => {
                return {
                    ...score,
                    black: score.black + 1,
                }
            });
        }
    };


    const defineGameZoneDimensiopns = (e: HTMLDivElement) => {
        if (e) {
            setGameZoneHeight(e.clientHeight);
            setGameZoneWidth(e.clientWidth);
        }
    };


    // Redirect to match when screen is match
    if (screen !== EServerInfoScreen.match) {
        props.history.push('/machine');
        return null;
    }


    return <div className="page-container">
        <div className="game-score pt-2">
            <h1 className="score-red">{
                score.red
            }</h1>
            <h1 className="score-black">{
                score.black
            }</h1>
        </div>
        <div className="flex-grow-1"
             ref={defineGameZoneDimensiopns}>
            {gameZoneWidth && gameZoneHeight &&
            <GameZoneComponent height={gameZoneHeight}
                               width={gameZoneWidth}
                               increaseScore={increaseTeamScore}
            />}
        </div>
        <button className="btn btn-danger"
                onClick={doFinishMatch}
        >
            Finalitzar partida
        </button>
    </div>
};
