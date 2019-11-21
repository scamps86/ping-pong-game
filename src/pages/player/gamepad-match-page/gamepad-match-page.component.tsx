import React, {PropsWithChildren} from 'react';
import {setJoystickPosition} from '../../../api/socket-api';
import './gamepad-match-page.component.scss';
import {useSelector} from 'react-redux';
import {EUserTeam, User} from '../../../model/user';
import {objectPick} from '../../../utils/object.utils';
import {EServerInfoScreen} from '../../../model/server-info';
import {IState} from '../../../redux/state';


export type TProps = PropsWithChildren<{
    history: string[];
}>;


export const GamepadMatchPageComponent: React.FunctionComponent<TProps> = (props: TProps) => {

    const me: User = useSelector((state: IState) => state.me);
    const screen: EServerInfoScreen = useSelector((state: IState) => objectPick('serverInfo.screen', state));

    let dragZoneElement: HTMLDivElement;
    let dragItemElement: HTMLDivElement;

    let active = false;
    let currentY: number;
    let initialY: number;
    let yOffset = 0;

    const addEventListeners = (e: HTMLDivElement) => {
        if (e) {
            dragZoneElement = e;
            dragZoneElement.addEventListener('mousedown', dragStart, false);
            dragZoneElement.addEventListener('mouseup', dragEnd, false);
            dragZoneElement.addEventListener('mousemove', drag, false);
            dragZoneElement.addEventListener('touchstart', dragStart, false);
            dragZoneElement.addEventListener('touchend', dragEnd, false);
            dragZoneElement.addEventListener('touchmove', drag, false);
        }
    };

    const dragStart = (e) => {
        if (e.type === 'touchstart') {
            initialY = e.touches[0].clientY - yOffset;
        } else {
            initialY = e.clientY - yOffset;
        }
        if (e.target === dragItemElement) {
            active = true;
        }
    };

    const dragEnd = () => {
        initialY = currentY;
        active = false;
    };

    const drag = (e) => {
        if (active) {
            e.preventDefault();

            if (e.type === 'touchmove') {
                currentY = e.touches[0].clientY - initialY;
            } else {
                currentY = e.clientY - initialY;
            }
            yOffset = currentY;
            setTranslate(0, currentY);
        }
    };

    const setTranslate = (x, y) => {
        if (dragZoneElement && dragItemElement) {
            const maxY: number = dragZoneElement.clientHeight - dragItemElement.clientHeight;
            if (y < 0) {
                y = 0;
            }
            if (y > maxY) {
                y = maxY;
            }
            dragItemElement.style.transform = 'translate3d(' + x + 'px, ' + y + 'px, 0)';
            setJoystickPosition(me.uuid, Math.floor(y * 100 / maxY));
        }
    };

    // Redirect to team select gamepad when screen is not match
    if (screen === EServerInfoScreen.teamSelect) {
        props.history.push('/gamepad-team-select');
        return null;
    }

    if (me) {
        return <div className={'pad-container ' + (me.team === EUserTeam.red ? 'team-red' : 'team-black')}>
            <div className="drag-zone"
                 ref={addEventListeners}>
                <div className="drag-item"
                     ref={(e) => dragItemElement = e}
                >
                    {me.name}
                </div>
            </div>
        </div>
    } else {
        props.history.push('/');
        return null;
    }
};
