import React, {PropsWithChildren, useEffect, useRef} from 'react';
import {useSelector} from 'react-redux';
import {EUserTeam, User} from '../../../../../model/user';
import './game-zone.component.scss';
import {objectPick} from '../../../../../utils/object.utils';


export type TProps = PropsWithChildren<{
    height: number;
    width: number;
    increaseScore: (EUserTeam) => void;
}>;

const ANIMATION_MS = 8;
const BAR_HEIGHT = 120;
const BAR_WIDTH = 24;
const BAR_WALL_DISTANCE = 20;
const BAR_MARGIN = BAR_WIDTH + BAR_WALL_DISTANCE;
const BALL_SIZE = 20;


export const GameZoneComponent: React.FunctionComponent<TProps> = (props: TProps) => {

    let ballElement: HTMLDivElement;

    const users: User[] = useSelector((state: any) => objectPick('serverInfo.users', state));

    // This is used to allow access from the timeout
    const usersRef = useRef(users);
    usersRef.current = users;

    // Game core
    const startMatch = () => {
        let countdownInterval: any;
        let gameInterval: any;

        let timeoutSeconds = 3;
        let ballVelocity = 1;
        let ballDirection = Math.round(Math.random()) * 180; // Randomize direction on start

        ballElement.style.left = '50%';
        ballElement.style.top = '50%';

        countdownInterval = setInterval(() => {
                timeoutSeconds--;

                // Increase velocity
                if (timeoutSeconds % 20 === 0) {
                    ballVelocity++;
                }

                // Start game
                if (timeoutSeconds === 0) {
                    gameInterval = setInterval(() => {
                        const xV = ballVelocity * Math.cos(ballDirection * Math.PI / 180);
                        const yV = ballVelocity * Math.sin(ballDirection * Math.PI / 180);

                        const maxX = props.width - BALL_SIZE;
                        const maxY = props.height - BALL_SIZE;

                        let xP = ballElement.offsetLeft + xV;
                        let yP = ballElement.offsetTop + yV;

                        // Position limits
                        xP = xP < 0 ? 0 : xP;
                        xP = xP > maxX ? maxX : xP;
                        yP = yP < 0 ? 0 : yP;
                        yP = yP > maxY ? maxY : yP;

                        // X Collisions (bars)
                        const yPAnchor = yP + (BALL_SIZE / 2);

                        if (xP <= BAR_MARGIN || xP >= maxX - BAR_MARGIN) {
                            const team = xP <= BAR_MARGIN ? EUserTeam.red : EUserTeam.black;
                            const collisions: number[][] = getBarCollisionRanges(team).reduce(
                                (cs: number[][], range: number[]) => {
                                    return yPAnchor >= range[0] && yPAnchor <= range[1] ? [...cs, range] : cs;
                                }, []);

                            if (collisions.length > 0) {
                                // Get bar average impact y
                                const impactAverageY = collisions.reduce(
                                    (average: number, range: number[]) => {
                                        return average
                                            ? Math.floor((average + (yPAnchor - range[0])) / 2)
                                            : Math.floor(yPAnchor - range[0]);
                                    }, null);

                                const diana: number = (impactAverageY - (BAR_HEIGHT / 2)) / (BAR_HEIGHT / 2); // -1 - 0 - 1
                                const deviateAngle = (Math.floor(45 * diana)) * (team === EUserTeam.red ? 1 : -1);

                                ballDirection = ((180 - ballDirection) % 360) + deviateAngle;

                                if (ballDirection)

                                // Be sure that not pass the bar!
                                    xP = xP < BAR_MARGIN ? BAR_MARGIN : xP;
                                xP = xP > maxX - BAR_MARGIN ? maxX - BAR_MARGIN : xP;
                            }
                        }

                        // X Collisions (wall)
                        if (xP <= 0 || xP >= maxX) {
                            ballDirection = (180 - ballDirection) % 360;
                            if (xP <= 0) {
                                props.increaseScore(EUserTeam.black);
                            } else {
                                props.increaseScore(EUserTeam.red);
                            }
                            clearInterval(countdownInterval);
                            clearInterval(gameInterval);
                            startMatch();
                            return;
                        }

                        // Y collisions
                        if (yP <= 0 || yP >= maxY) {
                            ballDirection = (360 - ballDirection) % 360;
                        }

                        // Set ball position
                        ballElement.style.left = xP + 'px';
                        ballElement.style.top = yP + 'px';
                    }, ANIMATION_MS);
                }
            },
            1000);
    };


    useEffect(() => {
            startMatch();
        },
        // eslint-disable-next-line
        [],
    );


    const getTeamUsers = (team: EUserTeam): User[] => {
        return users.filter((u: User) => {
            return u.team === team;
        });
    };

    const getBarPositionByUserId = (userId: string): number => {
        const user: User = usersRef.current.find((u: User) => {
            return u.uuid === userId;
        });
        let posY = 0;

        if (user) {
            posY = user.posY | 0;
        } else {
            posY = 0;
        }
        return posY * (props.height - BAR_HEIGHT) / 100;
    };


    const getBarCollisionRanges = (team: EUserTeam): number[][] => {
        return usersRef.current
            .filter(
                (user: User) => {
                    return user.team === team;
                })
            .map((user: User) => {
                let posY = getBarPositionByUserId(user.uuid);
                return [posY, posY + BAR_HEIGHT];
            });
    };

    // BALL
    const defineBallElement = (e: HTMLDivElement) => {
        if (e) {
            ballElement = e;
        }
    };


    return <div className="game-zone">
        <div className="ball"
             ref={defineBallElement}
        />
        {getTeamUsers(EUserTeam.red).map((u: User, i: number) => {
            return <div className="bar team-red"
                        key={i}
                        style={{top: getBarPositionByUserId(u.uuid)}}
            >
                {u.name}
            </div>
        })}
        {getTeamUsers(EUserTeam.black).map((u: User, i: number) => {
            return <div className="bar team-black"
                        key={i}
                        style={{top: getBarPositionByUserId(u.uuid)}}
            >
                {u.name}
            </div>
        })}
    </div>
};
