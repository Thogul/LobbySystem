import React from "react"

import AppState from '../utils/appstate'
import Network from "../utils/network";
import LobbyPlayerSection from '../components/lobbyPlayerSection'
import Button from "../components/button";
import '../styles/lobby.css'

export default class Lobby extends React.Component {

    constructor(props) {
        super(props);

        this.forceUpdateHandler = this.forceUpdateHandler.bind(this);
    }

    componentDidMount() {
        AppState.forceUpdateLobby = this.forceUpdateHandler;

        if(Network.socket)
        Network.socket.on('start game', data => this.onGameStart(data))
    }

    componentWillUnmount() {
        AppState.forceUpdateLobby = null;
    }

    forceUpdateHandler() {
        this.forceUpdate();
    }

    render() {
        // Renders a LobbyPlayerSection for each user in the lobby
        if(AppState.lobbyData['users'] === undefined) return null
        const players = AppState.lobbyData['users'].map((user) => {
            let userId = user['userId']
            let username = user['name']
            return <LobbyPlayerSection key={userId} userId={userId} username={username}/>
        });

        let adminControls = null
        if(AppState.isAdmin()){
            adminControls = <Button text="Start" onClick={() => Network.socket.emit('start game', {lobbyId:AppState.lobbyId, userId:AppState.userId})}/>
        }

        return (
            <div className="container">
                <div className="header">
                <h1>Your Lobby Code:<br/>{AppState.lobbyId}</h1>
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
    
    onGameStart(data){
        this.props.changeNavigationState('ingame')
    }
}