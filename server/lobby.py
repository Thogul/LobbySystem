class Lobby():
    def __init__(self, lobby_id, user=None):
        self.lobby_id = lobby_id
        if user:
            self.users = [user]
            self.connected = 1
        else:
            self.users = []
    
    def join(self, user):
        self.connected += 1
        self.users.append(user)
    
    def leave(self, user):
        if user in self.users:
            self.connected -= 1
            self.users.remove(user)

    def __str__(self):
        return self.lobby_id