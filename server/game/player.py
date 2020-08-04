class Player():
    def __init__(self, name, id, socket_id ):
        self.name = name
        self.id = id
        self.socket_id = socket_id
        self.hitPoints = 100
        self.defence = 22
        self.attackDamage = 10
        self.threatLevel = 0
    
    def to_dict(self):
        return {
            'name': self.name,
            'userId': self.id,
        }
    
    def __str__(self):
        return self.name


