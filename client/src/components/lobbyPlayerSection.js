import React from 'react'

import '../styles/lobby.css'
import AppState from '../appstate';

export default class LobbyPlayerSection extends React.Component {

    constructor(props) {
        super(props);

        this.userId = this.props.userId
        this.username = this.props.username
    }

    render() {
        // Change styling if it is the current user and administrator
        if(this.userId === AppState.lobbyData.adminId){
            return (
                <div className={"adminContainer"}>
                    <h2 className="center-text">{this.username}</h2>
                </div>
            );
        }

        if(this.userId === AppState.userId){
            return (
                <div className={"currentPlayerContainer"}>
                    <h2 className="center-text">{this.username}</h2>
                </div>
            );
        }

        // The user is not not admin or current user
        return (
            <div className={"playerContainer"}>
                <h2 className="center-text">{this.username}</h2>
            </div>
        );
    }
}