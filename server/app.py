from flask import Flask, render_template, jsonify, request, send_from_directory
from flask_cors import CORS #Cross site rescource sharing stuff idk, it works
from flask_socketio import SocketIO, emit, join_room, leave_room, send

#local imports:
# Should change to lobby class later
from lobby import Lobby
#for generating lobby keys
from key_gen import Key_gen

#Instansiating app server and adding socketIO finctionality
app  = Flask(__name__)
CORS(app)
socketio = SocketIO(app)

#app server Configs
app.config["DEBUG"] = True

#Temp for testing
users = ["thomas", "lars", "thogul", "larsaur"]

#list of lobbies that are live
lobbies = [Lobby("test")]

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
    ##data = request.json
    lobbyID = lobby_key_gen.new_key()
    lobbies.append(Lobby(lobbyID))
    return jsonify({'lobbyID' : lobbyID, 'success' : True})
    
@socketio.on('message')
def handle_message(message):
    """Idk what we are using this for right now, maybe for later"""
    print('recieved message: ' + message)

@socketio.on('connect')
def handle_connect():
    """If we want to do something when a device connects to the lobbies"""
    print("device connected")
    emit('my response', {'data' : 'Connected!'})

#testing room stuff...
@socketio.on('join')
def on_join(data):
    username = data['username']
    users.append(username)
    lobby = data['room']
    if lobby in lobbies:
        join_room(lobby)
        send(username + ' Has enterd the room', room=lobby)
    else:
        emit('my response', {'data' : 'Room does not exist'})

@socketio.on('leave')
def on_leave(data):
    username = data['username']
    room = data['room']
    leave_room(room)
    send(username + ' has left the room')


if __name__ == '__main__':
    #app.run(host='0.0.0.0', debug=True)
    socketio.run(app, host='0.0.0.0')