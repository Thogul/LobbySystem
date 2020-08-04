import React from 'react';
import Lobby from "./screens/lobby"
import Form from "./screens/form"
import Network from './network'

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
	}

	render() {
		switch(this.state.navigationState){
			case 'form':
				return <Form changeNavigationState={this.changeNavigationState}/>
			case 'lobby':
				return <Lobby changeNavigationState={this.changeNavigationState}/>
			case 'ingame':
				return (<div> Sorry, the ingame state is not made :( </div>)
			default:
				return (<div> Sorry, this is an illegal state {this.state.navigationState} </div>)
		}
	}

	changeNavigationState(state){
		console.log("Change state to: " + state)
		this.setState({navigationState: state});
	}
}