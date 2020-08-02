from random import randint

class Key_gen():
    def __init__(self, max_len : int = 5):
        self.max_len = max_len
        self.count = 0

    def new_key(self) -> str:
        characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
        code = ""   
        for _ in range(self.max_len):
            ch = randint(0, len(characters) - 1)
            code += characters[ch]
        
        self.count += 1
        return code