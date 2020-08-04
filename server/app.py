from flask import Flask, render_template, jsonify, request, send_from_directory
from flask_cors import CORS #Cross site rescource sharing stuff idk, it works
from flask_socketio import SocketIO, emit, join_room, leave_room, send
import time

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

#dictionary of lobbies that are live key is lobbyId
lobbies = {}

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
    lobbies[lobbyId] = Lobby(lobbyId)
    return jsonify({'lobbyId' : lobbyId})
    
@socketio.on('message')
def handle_message(message):
    """Idk what we are using this for right now, maybe for later"""
    pass

@socketio.on('connect')
def handle_connect():
    """If we want to do something when a device connects to the lobbies"""
    pass

#testing room stuff...
@socketio.on('join room')
def on_join(data):
    # Get user data on joining room
    username = data['username']
    lobbyId = data['lobbyId']
    
    # Check if the lobby exists
    if lobbyId in lobbies.keys():
        lobby = lobbies[lobbyId]
        # Adding the user to the lobby with username and the spesific socketId and getting the userId
        user_id = lobby.join(username, request.sid)
        user_data = {
            "userId": user_id,
        }
        emit('update user', user_data)
        # Joining user in the socketIO room
        join_room(lobbyId)
        # Sending the updated lobbyData to the coresponding room
        lobby_data = {
            'users': [player.to_dict() for player in lobby.players],
            'adminId': min([player.id for player in lobby.players]),
        }
        
        emit('update lobby', lobby_data, room=lobbyId)
    else:
        print(f"room: {lobbyId} not found")
        emit('error', {'data' : f'Room: {lobbyId} does not exist'})
        
@socketio.on('start game')
def on_game_start(data):
    lobbyId = data['lobbyId']
    userId = data['userId']
    
    if lobbyId in lobbies.keys():
        lobby = lobbies[lobbyId]
        if lobby.get_admin().id == userId:
            emit('start game', room=lobbyId)
            print(f"starting game {lobbyId}")
        else:
            emit('error', {'data': f"The user {userId} is not admin of {lobbyId}"})
    else:
            emit('error', {'data': f"{lobbyId} does not exist"})
        

@socketio.on('leave')
def on_leave(data):
    username = data['username']
    lobbyId = data['lobbyId']
    leave_room(lobbyId)
    send(username + ' has left the room', room=lobbyId)


if __name__ == '__main__':
    #app.run(host='0.0.0.0', debug=True)
    socketio.run(app, host='0.0.0.0')