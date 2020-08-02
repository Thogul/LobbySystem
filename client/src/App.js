import React from 'react';
import Lobby from "./screens/lobby"
import Network from './network'

export default class App extends React.Component {

	constructor() {
        super()
		Network.connectSocketIO()
	}

	render() {
		return (
			<div>
				<Lobby />
			</div>
		)
	}
}