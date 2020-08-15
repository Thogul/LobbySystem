import React from 'react';
import Lobby from "./screens/lobby"
import Form from "./screens/form"
import GameScreen from './screens/gamescreen'
import Network from './utils/network'
import AppState from './utils/appstate'

export default class App extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			navigationState: 'form' // usable states: form, lobby, ingame
		}

		// 'this' will now always be in the context of App in changeNavigationState
		this.changeNavigationState = this.changeNavigationState.bind(this)
	}

	componentDidMount() {
		// Connects to SocketIO when App mounts to avoid double 
		// constructer call in App due to artifact of React.strictMode in index.js
		Network.connectSocketIO();

		// This creates a lobby and enters the gamestate 
		//this.debugStartup();
	}

	componentWillUnmount(){
		
	}

	render() {
		switch (this.state.navigationState) {
			case 'form':
				return <Form changeNavigationState={this.changeNavigationState} />
			case 'lobby':
				return <Lobby changeNavigationState={this.changeNavigationState} />
			case 'ingame':
				return <GameScreen changeNavigationState={this.changeNavigationState} />
			default:
				return (<div> Sorry, this is an illegal state {this.state.navigationState} </div>)
		}
	}

	changeNavigationState(state) {
		console.log("Change state to: " + state)
		this.setState({ navigationState: state });
	}

	async debugStartup() {
		// For debug:
		// Creates a lobby, joins the room and starts the game
		const code = await Network.createLobby();

		let onStart = (data) => {
			Network.unsubscribeFromGameStart(onStart)
			this.changeNavigationState('ingame');
		}

		let onLobbyUpdate = (data) => {
			AppState.lobbyData = { users: data['users'], adminId: data['adminId'] };
			Network.unsubscribeFromLobbyUpdate()
			Network.subscribeToGameStart(onStart);
			Network.startGame();
		}

		let onJoin = (data) => {
			const ack = data['ack'];
			const lobbyId = data['lobbyId'];
			const username = data['username'];
			const userId = data['userId'];

			if (ack) {
				AppState.lobbyId = lobbyId;
				AppState.username = username;
				AppState.userId = userId;
				// Have to listen to lobby updates to know the adminId (Should maybe change???)
				Network.subscribeToLobbyUpdate(onLobbyUpdate);
			}

			Network.unsubscribeFromFormResponse(this.onFormResponse);
		}

		Network.subscribeToFormResponse(onJoin);
		Network.joinLobbyRoom("debugger", code);
	}
}