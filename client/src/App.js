import React from 'react';
import Lobby from "./screens/lobby"
import Form from "./screens/form"
import GameScreen from './screens/gamescreen'
import Network from './utils/network'

export default class App extends React.Component {

	constructor(props) {
        super(props);
		
		this.state = {
			navigationState: 'form' // usable states: form, lobby, ingame
		}

		// 'this' will now always be in the context of App in changeNavigationState
		this.changeNavigationState = this.changeNavigationState.bind(this)
	}

	componentDidMount(){
		// Connects to SocketIO when App mounts to avoid double 
		// constructer call in App due to artifact of React.strictMode in index.js
		Network.connectSocketIO();

		// This creates a lobby and enters the gamestate 
		//this.debugStartup();
	}

	render() {
		switch(this.state.navigationState){
			case 'form':
				return <Form changeNavigationState={this.changeNavigationState}/>
			case 'lobby':
				return <Lobby changeNavigationState={this.changeNavigationState}/>
			case 'ingame':
				return <GameScreen changeNavigationState={this.changeNavigationState}/>
			default:
				return (<div> Sorry, this is an illegal state {this.state.navigationState} </div>)
		}
	}

	changeNavigationState(state){
		console.log("Change state to: " + state)
		this.setState({navigationState: state});
	}

	async debugStartup(){
		// For debug:
		const code = await Network.createLobby();
		await Network.joinLobbyRoom("debugger", code);
		Network.socket.emit('start game', {lobbyId : code, userId : 0})
		this.changeNavigationState('ingame')
	}
}