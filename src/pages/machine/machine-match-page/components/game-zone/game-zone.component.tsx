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

const ANIMATION_MS = 1;
const BALL_RADIUS = 10;
const BAR_HEIGHT = 120;
const BAR_WIDTH = 24;
const BAR_WALL_DISTANCE = 20;
const BAR_MARGIN = BAR_WIDTH + BAR_WALL_DISTANCE;


export const GameZoneComponent: React.FunctionComponent<TProps> = (props: TProps) => {

    const users: User[] = useSelector((state: any) => objectPick('serverInfo.users', state));

    let canvasContext: CanvasRenderingContext2D;
    let canvasElement: HTMLCanvasElement;

    // This is used to allow access from the timeout
    const usersRef = useRef(users);
    usersRef.current = users;

    // Game core
    const startMatch = () => {
        let countdownInterval: any;
        let gameInterval: any;

        let timeoutSeconds = 3;
        let ballPosition = [canvasElement.width / 2, canvasElement.height / 2];
        let ballVelocity = 1;
        let ballDirection = Math.round(Math.random()) * 180; // Randomize direction on start

        drawBall(ballPosition[0], ballPosition[1]);

        countdownInterval = setInterval(() => {
                timeoutSeconds--;

                // Increase velocity
                if (timeoutSeconds % 20 === 0) {
                    ballVelocity = ballVelocity + 0.5;
                }

                // Start game
                if (timeoutSeconds === 0) {
                    gameInterval = setInterval(() => {
                        const xV = ballVelocity * Math.cos(ballDirection * Math.PI / 180);
                        const yV = ballVelocity * Math.sin(ballDirection * Math.PI / 180);

                        // Wall limits
                        const maxX = props.width - BALL_RADIUS;
                        const minX = BALL_RADIUS;
                        const maxY = props.height - BALL_RADIUS;
                        const minY = BALL_RADIUS;

                        let xP = ballPosition[0] + xV;
                        let yP = ballPosition[1] + yV;

                        // Position limits
                        xP = xP < 0 ? 0 : xP;
                        xP = xP > maxX ? maxX : xP;
                        yP = yP < 0 ? 0 : yP;
                        yP = yP > maxY ? maxY : yP;

                        // X Collisions (bars)
                        const yPAnchor = yP + BALL_RADIUS;

                        if (xP <= minX + BAR_MARGIN || xP >= maxX - BAR_MARGIN) {
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
                                    xP = xP < minX + BAR_MARGIN ? minX + BAR_MARGIN : xP;
                                xP = xP > maxX - BAR_MARGIN ? maxX - BAR_MARGIN : xP;
                            }
                        }

                        // X Collisions (wall)
                        if (xP <= minX || xP >= maxX) {
                            ballDirection = (180 - ballDirection) % 360;
                            if (xP <= minX) {
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
                        if (yP <= minY || yP >= maxY) {
                            ballDirection = (360 - ballDirection) % 360;
                        }

                        // Set ball position
                        ballPosition = [xP, yP];
                        drawBall(xP, yP);
                    }, ANIMATION_MS);
                }
            },
            1000);
    };


    const drawBall = (x: number, y: number) => {
        canvasContext.clearRect(0, 0, canvasElement.width, canvasElement.height);
        canvasContext.beginPath();
        canvasContext.arc(x, y, BALL_RADIUS, 0, 2 * Math.PI, false);
        canvasContext.fillStyle = '#fff';
        canvasContext.fill();
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

    // DEFINE CANVAS & CONTEXT
    const defineContext = (e: HTMLCanvasElement) => {
        if (e) {
            canvasElement = e;
            canvasContext = e.getContext('2d');
        }
    };


    return props && <div className="game-zone">
        <canvas width={props.width}
                height={props.height}
                ref={defineContext}/>
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
