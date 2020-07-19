class Game_room():
    def __init__(self, room, user=None):
        self.room = room
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
        return self.room