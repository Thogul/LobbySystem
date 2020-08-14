class Player():
    def __init__(self, name, userId, socketId, lobby):
        self.name = name
        self.userId = userId
        self.socket_id = socketId
        self.hitPoints = 100
        self.defence = 22
        self.attackDamage = 10
        self.threatLevel = 0
        self.lobby = lobby
    
    def to_dict(self):
        return {
            'name': self.name,
            'userId': self.userId,
        }
    
    def __str__(self):
        return self.name


