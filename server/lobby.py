class Lobby():
    def __init__(self, lobby_code, user=None):
        self.lobby_code = lobby_code
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
        return self.lobby_code