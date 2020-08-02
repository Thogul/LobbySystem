export default class AppState {

    static gamestate = {}

    static lobbyCode = undefined
    
    static username = undefined
    static lobbyMembers = []

    static forceUpdateLobby = null

    static clearAppstate() {
        this.gamestate = {}

        this.lobbyCode = undefined
        this.username = undefined
        this.lobbyMembers = []
    }

    static updateLobby(){
        if(this.forceUpdateLobby !== null){
            this.forceUpdateLobby()
        }
    }
}