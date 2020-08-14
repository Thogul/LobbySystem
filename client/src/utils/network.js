import io from 'socket.io-client';
import './appstate'
import AppState from './appstate';

export default class Network {

    static socket = undefined
    static hostURL = "http://localhost:5000"
    static socketURL = "http://localhost:5000" // this may change to ws:// when not on localhost

    /**
     * Events:
     * 'connect'
     * 'reconnect'
     * 
     * Custom events:
     * 'error'
     * 'form response'
     * 'update lobby'
     * 'start game'
     */

    static async createLobby() {
        const code = await fetch(this.hostURL + "/create", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': "application/json",
            },
            body: JSON.stringify({})
        })
            .then(resp => {
                if (resp.status !== 200) {
                    return null
                }
                return resp.json()
            })
            .then(data => {
                console.log("(1) Recieved new lobby code: " + data['lobbyId'])
                return data['lobbyId']
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
            console.log("Socket connected");
        });

        this.socket.on('reconnect', () => {
            console.log("reconnected");
        });

        this.socket.on('error', data => {
            console.log(data);
        });
    }

    static disconnectSocketIO(){
        if(!this.socket) console.error("Unable to find a connection to disconnect");
        this.socket.emit("disconnect");
    }


    static startGame() {
        // Checks if the current user is admin if the required values exits.
        // Then asks the server to start the game
        if(!AppState.isAdmin()) return;
        if(AppState.lobbyId === undefined || AppState.userId === undefined) return;
        Network.socket.emit('start game', {lobbyId: AppState.lobbyId, userId: AppState.userId});
    }


    static joinLobbyRoom(username, lobbyId) {
        if (!this.socket) return;
        this.socket.emit("join room", { username: username, lobbyId: lobbyId });
    }


    static subscribeToFormResponse(callback){
        if(!this.socket){
            console.error("Unable to subscribe to event 'form response' with: " + callback);
            return false;
        }
        this.socket.on('form response', callback);
        return true;
    }


    static unsubscribeFromFormResponse(callback){
        if(!this.socket){
            console.error("Unable to unsubscribe from event 'form response' with: " + callback);
            return false;
        }
        this.socket.removeListener('form response', callback);
        return true;
    }


    static subscribeToLobbyUpdate(callback){
        if(!this.socket){
            console.error("Unable to subscribe to event 'update lobby' with: " + callback);
            return false;
        }
        this.socket.on('update lobby', callback);
        return true;
    }


    static unsubscribeFromLobbyUpdate(callback){
        if(!this.socket){
            console.error("Unable to unsubscribe from event 'update lobby' with: " + callback);
            return false;
        }
        this.socket.removeListener('update lobby', callback);
        return true;
    }


    static subscribeToGameStart(callback){
        if(!this.socket){
            console.error("Unable to subscribe to event 'start game' with: " + callback);
            return false;
        }
        this.socket.on('start game', callback);
        return true;
    }


    static unsubscribeFromGameStart(callback){
        if(!this.socket){
            console.error("Unable to unsubscribe from event 'start game' with: " + callback);
            return false;
        }
        this.socket.removeListener('start game', callback);
        return true;
    }
}