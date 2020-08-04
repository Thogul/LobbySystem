from game.player import Player

class Lobby():
    
    def __init__(self, lobbyId):
        self.lobbyId = lobbyId
        self.players = []
        self.next_player_id = 0

    
    def join(self, playerName, socket_id):
        newPlayer = Player(playerName, self.next_player_id, socket_id)
        self.players.append(newPlayer)
        self.next_player_id = self.next_player_id + 1
        return newPlayer.id
        
    def get_admin(self):
        adminId = min([player.id for player in self.players])
        return next(player for player in self.players if player.id == adminId)
    
    def leave(self, player):
        if player in self.players:
            self.players.remove(player)

    def __str__(self):
        return self.lobbyId
        




