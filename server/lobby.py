from game.player import Player

class Lobby():
    
    def __init__(self, lobbyId):
        self.lobbyId = lobbyId
        self.players = []
        self.next_player_id = 0

    def join(self, playerName, socketId):
        newPlayer = Player(playerName, self.next_player_id, socketId, self)
        self.players.append(newPlayer)
        self.next_player_id = self.next_player_id + 1
        return newPlayer
        
    def leave(self, player):
        if player in self.players:
            self.players.remove(player)
            
    def is_full(self):
        return len(self.players) >= 4
            
    def get_admin(self):
        adminId = min([player.userId for player in self.players])
        return next(player for player in self.players if player.userId == adminId)
    

    def __str__(self):
        return self.lobbyId
        