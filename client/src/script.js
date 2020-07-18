var host = "http://192.168.1.224:5000"

document.getElementById("create").addEventListener("click", (evt) => {
    username = document.getElementById("name-input").value
    fetch(host + "/user/" + username, {
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
})

document.getElementById("join").addEventListener("click", (evt) => {
    lobby_code = document.getElementById("lobby-input").innerText
    username = document.getElementById("name-input").innerText
    fetch(host + "/join/" + lobby_code, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': "application/json",
        },
        body: JSON.stringify({lobby_code: lobby_code, username: username})
    })
    .then(async response => {
        if(response.status == 200){
            console.log(await response.json())
        }else{
            console.error(response)
        }
    })
    .catch(error => console.error(error))
})