import React, {FormEvent, PropsWithChildren, useState} from 'react';
import {doLogin} from '../../../api/server-api';
import {User} from '../../../model/user';
import './login-page.component.scss';
import {useDispatch, useSelector} from 'react-redux';
import {setMeAction} from '../../../redux/actions/actions';
import {Dispatch} from 'redux';
import {EServerInfoScreen, ServerInfo} from '../../../model/server-info';
import {objectPick} from '../../../utils/object.utils';


export type TProps = PropsWithChildren<{
    history: string[];
}>;


export const LoginPageComponent: React.FunctionComponent<TProps> = (props: TProps) => {

    const [name, setName] = useState();
    const serverInfo: ServerInfo = useSelector((state: any) => state.serverInfo);
    const dispatch: Dispatch = useDispatch();

    const onSubmitHandler = (e: FormEvent) => {
        e.preventDefault();
        doLogin(name).then((me: User) => {
            console.log('Login success', me);
            dispatch(setMeAction(me));
            props.history.push('/gamepad-team-select');
        });
    };

    if (objectPick('screen', serverInfo) === EServerInfoScreen.match) {
        return <div className="alert alert-warning text-center">
            <h2>Ja hi ha una partida iniciada!</h2>
        </div>
    } else {
        return <div className="container mt-5">
            <div className="card">
                <div className="card-body">
                    <h1>Entrar al joc!</h1>
                    <form onSubmit={onSubmitHandler}>
                        <div className="form-group mt-5">
                            <label htmlFor="exampleInputEmail1">Escriu el teu nick</label>
                            <input type="name"
                                   className="form-control"
                                   onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <button type="submit"
                                className="btn btn-primary"
                                disabled={!name}
                        >
                            Entrar a la partida
                        </button>
                    </form>
                </div>
            </div>
        </div>
    }
};
