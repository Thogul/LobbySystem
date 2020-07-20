from game.player import Player

class Lobby():
    def __init__(self, lobby_id):
        self.lobby_id = lobby_id
        self.players = []
    
    def join(self, playerName):
        newPlayer = Player(playerName, len(self.players))
        self.players.append(newPlayer)
    
    def leave(self, player):
        if player in self.players:
            self.players.remove(player)

    def __str__(self):
        return self.lobby_id


