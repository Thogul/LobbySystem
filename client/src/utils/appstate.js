export default class AppState {

    static gamestate = {};

    static lobbyId = undefined;
    static username = undefined;
    static userId = undefined;

    static lobbyData = {};

    static clearAppstate() {
        this.gamestate = {};

        // Data for the current user
        this.lobbyId = undefined;
        this.username = undefined;
        this.userId = undefined;

        // Data for all lobby members
        this.lobbyData = {};
    }

    // Checks if current user is admin
    static isAdmin(){
        return this.lobbyData['adminId'] !== undefined && this.userId === this.lobbyData['adminId'];
    }
}