var host = "localhost:5000"

var socket = io()

socket.on('connect', function() {
  console.log("SocketIO connected");
});

document.getElementById("create").addEventListener("click", (evt) => {
    username = document.getElementById("name-input").value
    if(username != ""){
        socket.emit("create lobby", {username: username})
    }
})

document.getElementById("join").addEventListener("click", (evt) => {
    username = document.getElementById("name-input").value
    lobby_code = document.getElementById("lobby-input").value
    if(username != "" && lobby_code != ""){
        socket.emit("join lobby", {username: username, lobby_code: lobby_code})
    }
})

function join_lobby(username, lobby_code){
    fetch(host + "/join/" + lobby_code, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': "application/json",
        },
        body: JSON.stringify({username: username, lobby_code: lobby_code})
    })
    .then(async response => {
        if(response.status == 200){
            console.log(await response.json())
        }else{
            console.error(response)
        }
    })
    .catch(error => console.error(error))
}

function create_lobby(username){
    fetch("http://" + host + "/create", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': "application/json",
        },
        body: JSON.stringify({username: username})
    })
    .then(async response => {
        if(response.status == 200){
            console.log(await response.json())
        }else{
            console.error(response)
        }
    })
    .catch(error => console.error(error))
}