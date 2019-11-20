import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import {LoginPageComponent} from './pages/player/login-page/login-page.component';
import {GamepadMatchPageComponent} from './pages/player/gamepad-match-page/gamepad-match-page.component';
import {GamepadTeamSelectPageComponent} from './pages/player/gamepad-team-select-page/gamepad-team-select-page.component';
import {createStore} from 'redux';
import reducers from './redux/reducers/reducers';
import {onServerInfoRefresh} from './api/socket-api';
import {ServerInfo} from './model/server-info';
import {setServerInfoAction} from './redux/actions/actions';
import {Provider} from 'react-redux';
import {MachineTeamSelectPageComponent} from './pages/machine/machine-team-select-page/machine-team-select-page.component';
import {MachineMatchPageComponent} from './pages/machine/machine-match-page/machine-match-page.component';


const store = createStore(reducers);

// Events
onServerInfoRefresh().subscribe((serverInfo: ServerInfo) => {
    store.dispatch(setServerInfoAction(serverInfo));
});


const App: React.FC = () => {

    return (
        <Provider store={store}>
            <Router>
                <Route path="/"
                       component={LoginPageComponent}
                       exact/>
                <Route path="/gamepad-team-select"
                       component={GamepadTeamSelectPageComponent}/>
                <Route path="/gamepad-match"
                       component={GamepadMatchPageComponent}/>
                <Route path="/machine"
                       component={MachineTeamSelectPageComponent}
                       exact/>
                <Route path="/machine-match"
                       component={MachineMatchPageComponent}
                />
            </Router>
        </Provider>
    );
};

export default App;
