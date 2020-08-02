import io from 'socket.io-client';
import './appstate'
import AppState from './appstate';

export default class Network {

    static socket = undefined
    static hostURL = "http://localhost:5000"
    static socketURL = "http://localhost:5000" // this may change to ws:// when not on localhost

    static async createLobby(username) {
        const code = await fetch(this.hostURL + "/create", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': "application/json",
            },
            body: JSON.stringify({ username: username })
        })
            .then(resp => {
                if (resp.status !== 200) {
                    return null
                }
                return resp.json()
            })
            .then(data => {
                console.log("(1) Recieved new lobby code: " + data['lobby_code'])
                return data['lobby_code']
            })
            .catch(error => {
                console.error(error)
                return null
            })
        return code
    }

    static connectSocketIO() {
        // Create the socket
        this.socket = io(this.socketURL, {
            path: '/socket.io',
            jsonp: false,
            reconnection: true,
            reconnectionDelay: 100,
            reconnectionAttempts: 100000,
            pingTimeout: 30000,
            secure: true,
        });

        this.socket.on('connect', () => {
            console.log("Socket connected")
        });

        this.socket.on('reconnect', () => {
            console.log("reconnected")
        })

        // handle the event sent with socket.send()
        this.socket.on('update lobby', data => {
            AppState.lobbyMembers = data['users']
            AppState.updateLobby()
            console.log(data['users'])
        })

        this.socket.on('error', data => {
            console.log(data)
        })
    }

    static async joinLobbyRoom(username, lobby_code) {
        if (!this.socket) {
            return
        }
        await this.socket.emit("join room", { username: username, lobby_code: lobby_code })
    }
}