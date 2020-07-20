from player import Player

class Lobby():
    def __init__(self, lobby_id, player=None):
        self.lobby_id = lobby_id
        if player:
            self.players = [player]
            self.connected = 1
        else:
            self.players = []
    
    def join(self, player):
        self.connected += 1
        self.players.append(player)
    
    def leave(self, player):
        if player in self.players:
            self.connected -= 1
            self.players.remove(player)

    def __str__(self):
        return self.lobby_id