class Player():
    def __init__(self, name, id):
        self.name = name
        self.id = id
        self.hitPoints = 100
        self.defence = 22
        self.attackDamage = 10
        self.threatLevel = 0
    
    def __str___(self):
        return self.name


        