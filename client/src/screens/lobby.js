import React from "react"

import AppState from '../utils/appstate'
import Network from "../utils/network";
import LobbyPlayerSection from '../components/lobbyPlayerSection'
import Button from "../components/button";
import '../styles/lobby.css'

export default class Lobby extends React.Component {

    constructor(props) {
        super(props);

        this.onLobbyUpdate = this.onLobbyUpdate.bind(this);
        this.onGameStart = this.onGameStart.bind(this);
    }

    componentDidMount() {
        AppState.forceUpdateLobby = this.forceUpdateHandler;
        Network.subscribeToLobbyUpdate(this.onLobbyUpdate);
        Network.subscribeToGameStart(this.onGameStart);
    }

    componentWillUnmount() {
        Network.unsubscribeFromLobbyUpdate(this.onLobbyUpdate);
        Network.unsubscribeFromGameStart(this.onGameStart);
        AppState.forceUpdateLobby = null;
    }

    render() {
        // Renders a LobbyPlayerSection for each user in the lobby
        if (AppState.lobbyData['users'] === undefined) return null
        const players = AppState.lobbyData['users'].map((user) => {
            let userId = user['userId']
            let username = user['name']
            return <LobbyPlayerSection key={userId} userId={userId} username={username} />
        });

        let adminControls = null
        if (AppState.isAdmin()) {
            adminControls = <Button text="Start" onClick={Network.startGame} />
        }

        return (
            <div className="container">
                <div className="header">
                    <h1>Your Lobby Code:<br />{AppState.lobbyId}</h1>
                </div>
                <div className="flex">
                    {players}
                </div>
                <div className="flex">
                    {adminControls}
                </div>
            </div>
        );
    }

    onLobbyUpdate(data) {
        AppState.lobbyData = { users: data['users'], adminId: data['adminId'] };
        this.forceUpdate();
    }

    onGameStart(data) {
        this.props.changeNavigationState('ingame')
    }
}