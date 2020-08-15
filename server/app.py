from flask import Flask, render_template, jsonify, request, send_from_directory
from flask_cors import CORS #Cross site rescource sharing stuff idk, it works TODO
from flask_socketio import SocketIO, emit, join_room, leave_room, send
import time
from threading import Timer

#local imports:
# Should change to lobby class later
from lobby import Lobby
#for generating lobby keys
from key_gen import Key_gen


"""Rescources:
flask-socketio doc
https://flask-socketio.readthedocs.io/en/latest/

python socketio doc
https://python-socketio.readthedocs.io/en/latest/

socketio generic doc(?)
https://socket.io/docs/
"""

#Instansiating app server and adding socketIO finctionality
app  = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*") #TODO cors should change when flask serves the react app in production

#app server Configs
app.config["DEBUG"] = True

# Dictionary of lobbies that are live key is lobbyId
lobbies = {}
# Dictionary of active players, the key is the socketid
players = {}

lobby_key_gen = Key_gen() #for making lobby IDs

@app.route("/")
def index():
    """Serves the main page for creating and joining lobbies"""
    return send_from_directory("../client/", "index.html")

@app.route("/src/<path:filename>")
def src_files(filename):
    """Returns the source files for the website"""
    path = filename.split("/")
    return send_from_directory("../client/src/" + "/".join(path[:-1]), path[-1])

@app.route("/create", methods = ['POST'])
def create_lobby():
    lobbyId = lobby_key_gen.new_key()
    lobby = Lobby(lobbyId)
    lobbies[lobbyId] = lobby
    #Deletes the lobby if no one joines after 5 seconds
    delete_unused_lobby_timeout(lobby, 5)
    print(f"Created lobby {lobbyId}")
    return jsonify({'lobbyId' : lobbyId})

def delete_unused_lobby_timeout(lobby, timeout):
    """Waits for timeout seconds and deletes the lobby if it is never used"""
    def delete(lobby):
        if(lobby != None):
            if(len(lobby.players) == 0):
                print(f"The lobby {lobby.lobbyId} was deleted because no one joined")
                del lobbies[lobby.lobbyId]
                del lobby 
    lobby_delete_timer = Timer(timeout, delete, (lobby,))
    lobby_delete_timer.start()
    
    
@socketio.on('message')
def handle_message(message):
    pass

@socketio.on('connect')
def handle_connect():
    pass

#testing room stuff...
@socketio.on('join room')
def on_join(data):
    # Get user data on joining room
    username = data['username']
    lobbyId = data['lobbyId']
    socketId = request.sid
    
    # Check if the lobby exists
    if lobbyId in lobbies.keys():
        lobby = lobbies[lobbyId]
        
        # Stops player from joining if lobby is full
        if lobby.is_full():
            print("lobby is full")
            emit('form response', {'ack': False, 'msg': "The lobby is full", 'username': None, 'lobbyId': None})
            return
        
        # Adding the user to the lobby with username and the spesific socketId and getting the userId
        player = lobby.join(username, socketId)
        players[socketId] = player
        # Joining user in the socketIO room
        join_room(lobbyId)
        emit('form response', {'ack': True, 'msg': "", 'username': username, 'lobbyId': lobbyId, 'userId': player.userId})
        # Sending the updated lobbyData to the coresponding room
        update_lobby(lobby)
        print(f"{username} {socketId} joined {lobbyId}")
    else:
        print(f"room: {lobbyId} not found")
        emit('form response', {'ack': False, 'msg': "The lobby does not exist", 'username': None, 'lobbyId': None})
        emit('error', {'data' : f'Room: {lobbyId} does not exist'})

@socketio.on('start game')
def on_game_start(data):
    lobbyId = data['lobbyId']
    userId = data['userId']
    
    if lobbyId in lobbies.keys():
        lobby = lobbies[lobbyId]
        if lobby.get_admin().userId == userId:
            emit('start game', room=lobbyId)
            print(f"starting game {lobbyId}")
        else:
            emit('error', {'data': f"The user {userId} is not admin of {lobbyId}"})
    else:
            emit('error', {'data': f"{lobbyId} does not exist"})
            
@socketio.on('leave lobby')
def on_leave_lobby():
    remove_socket_from_lobby(request.sid)
        
@socketio.on('disconnect')
def on_disconnect():
    remove_socket_from_lobby(request.sid)

def update_lobby(lobby):
    """Sends all the current lobby data to all members of the lobby"""
    lobby_data = {
            'users': [player.to_dict() for player in lobby.players],
            'adminId': min([player.userId for player in lobby.players]),
    }
    emit('update lobby', lobby_data, room=lobby.lobbyId)
    
def remove_socket_from_lobby(socketId):
    """Deletes the player with the socketId from its lobby, the lobby is also deleted if empty"""
    # If the socketId is not used to create a player, nothing needs to be done
    if socketId not in players.keys():
        return
    
    # Remove the player from the lobby
    lobby = players[socketId].lobby
    lobby.leave(players[socketId])
    leave_room(lobby.lobbyId)
    
    # Remove the player from the players dictionary
    print(f"{players[socketId].name} {socketId} left {lobby.lobbyId}")
    del players[socketId]
    
    # Delete the lobby if it is empty, if not update all players in the lobby
    if(len(lobby.players) == 0):
        print(f"The lobby {lobby.lobbyId} was deleted")
        del lobbies[lobby.lobbyId]
        del lobby
    else:
        update_lobby(lobby)

if __name__ == '__main__':
    #app.run(host='0.0.0.0', debug=True)
    socketio.run(app, host='localhost')