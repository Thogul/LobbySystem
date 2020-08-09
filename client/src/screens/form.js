import React from 'react'
import AppState from '../utils/appstate'
import Network from '../utils/network'
import '../styles/form.css'

export default class Form extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
            name: '',
            lobbyId: '',

            displayValidationError: false,
            validationError: '',
        }

        this.handleChange = this.handleChange.bind(this);
        this.onSubmitCreateLobby = this.onSubmitCreateLobby.bind(this);
        this.onSubmitJoinLobby = this.onSubmitJoinLobby.bind(this);
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

    validatelobbyId() {
        if (this.state.lobbyId.length !== 5 || !/^[a-z0-9]+$/i.test(this.state.lobbyId)) {
            this.setState({ displayValidationError: true, validationError: 'The lobby code must be 5 letters/numbers' });
            return false;
        }

        return true;
    }

    async onSubmitJoinLobby() {
        if (this.validateName() && this.validatelobbyId()) {
            await Network.joinLobbyRoom(this.state.name, this.state.lobbyId);

            this.setState({ displayValidationError: false });
            AppState.username = this.state.name;
            AppState.lobbyId = this.state.lobbyId;

            this.props.changeNavigationState('lobby');
        }
    }

    async onSubmitCreateLobby() {
        if (this.validateName()) {
            let lobbyId = await Network.createLobby(this.state.name);
            if (!lobbyId) {
                this.setState({ displayValidationError: true, validationError: 'unable to create a lobby code' });
                return;
            }

            await Network.joinLobbyRoom(this.state.name, lobbyId);

            AppState.lobbyId = lobbyId;
            AppState.username = this.state.name;

            this.setState({ displayValidationError: false });
            this.props.changeNavigationState('lobby');
        }
    }

    render() {
        return (
            <div className="container">
                <div className="login-form">
                    <form>
                        <label htmlFor="name"> <b>Name:</b></label>
                        <br />
                        <input
                            type="text"
                            name="name"
                            value={this.state.name}
                            onChange={this.handleChange}
                            placeholder=""
                            autoFocus
                            required
                        />
                        <br />
                        <label htmlFor="lobbyId"> <b>Lobby Code:</b></label>
                        <br />
                        <input
                            type="text"
                            name="lobbyId"
                            value={this.state.lobbyId}
                            onChange={this.handleChange}
                            maxLength="5"
                            placeholder="ex: DJL5P"
                        />
                        {this.renderValidationError()}
                        <div className="form-button-container">
                            <input className="button" type="button" name="create lobby" onClick={this.onSubmitCreateLobby} value="Create New Lobby" />
                            <input className="button" type="button" name="join lobby" onClick={this.onSubmitJoinLobby} value="Join Lobby" />
                        </div>
                    </form>
                </div>
            </div>
        );
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