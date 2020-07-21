import io from 'socket.io-client/dist/socket.io';

export default class Network{

    static socket = undefined
    static host_url = "http://localhost:5000"
    static socket_url = "http://localhost:5000" // this may change to ws:// when not on localhost

    static connectSocketIO(username, room) {
        // Create the socket
		this.socket = io(this.socket_url);
        
        this.socket.on('connect', () => { 
            console.log("connect")
            this.socket.emit("join", {username: username, room: room})
		});
    }

    static join_lobby(username, lobby_code){

        console.log("Joining lobby")

        /*fetch(this.host_url + "/join", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': "application/json",
            },
            body: JSON.stringify({username: username, lobby_code: lobby_code})
        })
        .then(async response => {
            if(response.status === 200){
                console.log(await response.json())
            }else{
                console.error(response)
            }
        })
        .catch(error => console.error(error))*/

        this.connectSocketIO(username, lobby_code)
    }

    static create_lobby(username){

        console.log("Creating lobby")

        fetch(this.host_url + "/create", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': "application/json",
            },
            body: JSON.stringify({username: username})
        })
        .then(async response => {
            if(response.status === 200){
                console.log(await response.json())
            }else{
                console.error(response)
            }
        })
        .catch(error => console.error(error))
    }

    

}