import React from "react"

import Network from '../network'
import AppState from '../appstate'
import '../styles/lobby.css'

export default class Lobby extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            name: '',
            lobbyCode: '',

            displayValidationError: false,
            validationError: '',

            inLobby: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.onSubmitCreateLobby = this.onSubmitCreateLobby.bind(this);
        this.onSubmitJoinLobby = this.onSubmitJoinLobby.bind(this);
        this.forceUpdateHandler = this.forceUpdateHandler.bind(this);
    }

    componentDidMount() {
        AppState.forceUpdateLobby = this.forceUpdateHandler;
    }

    componentWillUnmount() {
        AppState.forceUpdateLobby = null;
    }

    forceUpdateHandler() {
        this.forceUpdate();
    }

    // Handles change event in the form, it is only made to handle type=text
    handleChange(event) {
        const target = event.target;
        const name = target.name;
        const value = target.value;
        this.setState({ [name]: value.toUpperCase() });
    }

    validateName() {
        if (this.state.name === "") {
            this.setState({ displayValidationError: true, validationError: 'Name cannot be empty' });
            return false;
        }

        return true;
    }

    validateLobbyCode() {
        if (this.state.lobbyCode.length !== 5 || !/^[a-z0-9]+$/i.test(this.state.lobbyCode)) {
            this.setState({ displayValidationError: true, validationError: 'The lobby code must be 5 letters/numbers' });
            return false;
        }

        return true;
    }

    async onSubmitJoinLobby() {
        if (this.validateName() && this.validateLobbyCode()) {
            await Network.joinLobbyRoom(this.state.name, this.state.lobbyCode);

            this.setState({ displayValidationError: false });
            AppState.username = this.state.name;
            AppState.lobbyCode = this.state.lobbyCode;

            this.setState({ inLobby: true });
        }
    }

    async onSubmitCreateLobby() {
        if (this.validateName()) {
            let lobbyCode = await Network.createLobby(this.state.name);
            if (!lobbyCode) {
                this.setState({ displayValidationError: true, validationError: 'unable to create a lobby code' });
                return;
            }

            await Network.joinLobbyRoom(this.state.name, lobbyCode);

            AppState.lobbyCode = lobbyCode;
            AppState.username = this.state.name;

            this.setState({ inLobby: true, displayValidationError: false });
        }
    }

    render() {
        if (!this.state.inLobby) {
            return this.renderForm()
        }
        return this.renderLobby()
    }

    renderLobby() {

        const names = AppState.lobbyMembers.map((name) => {
            return <li key={name}>{name}</li>
        })

        return (
            <div className="container">
                <b> Your lobby code: {AppState.lobbyCode}</b>
                <br/>
                <b> Your name: {AppState.username}</b>
                <br/>                
                <br/>                
                <br/>                
                <br/>                
                <b>All lobby members</b>
                <ul>
                    {names}
                </ul>
            </div>
        )
    }

    renderForm() {
        return (
            <div className="container">
                <div className="login-form">
                    <form>
                        <label> <b>Name:</b>
                            <input
                                type="text"
                                name="name"
                                value={this.state.name}
                                onChange={this.handleChange}
                                placeholder=""
                                autoFocus
                                required
                            />
                        </label>
                        <br />
                        <label> <b>Lobby Code:</b>
                            <input
                                type="text"
                                name="lobbyCode"
                                value={this.state.lobbyCode}
                                onChange={this.handleChange}
                                maxLength="5"
                                placeholder="ex: DJL5P"
                            />
                        </label>
                        {this.renderValidationError()}
                        <input type="button" name="create lobby" onClick={this.onSubmitCreateLobby} value="Create New Lobby" />
                        <input type="button" name="join lobby" onClick={this.onSubmitJoinLobby} value="Join Lobby" />
                    </form>
                </div>
            </div>
        )
    }

    renderValidationError() {
        if (this.state.displayValidationError) {
            return (
                <div className="error-message">
                    {this.state.validationError}
                </div>
            )
        }
    }
}