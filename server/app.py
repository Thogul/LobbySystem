from flask import Flask, render_template, jsonify, request, send_from_directory
from flask_cors import CORS
from flask_socketio import SocketIO, emit, join_room, leave_room, send
import ast

#local imports:
from game_room import Game_room

app  = Flask(__name__)
CORS(app)
socketio = SocketIO(app)

#adding debug config
app.config["DEBUG"] = True

users = ["thomas", "lars", "thogul", "larsaur"]

lobbies = [Game_room("test")]

@app.route("/")
def index():
    """Here we want to show lobbies and stuff"""
    return send_from_directory("../client/", "index.html")

@app.route("/src/<filename>")
def src_files(filename):
    """Returns the source files for the website"""
    return send_from_directory("../client/src", filename)
    
@app.route("/users")
def get_users():
    info = { "users" : users}
    return jsonify(info)

@app.route("/user/<username>", methods=['GET', 'POST'])
def get_user(username):
    """Maybe intersting later idk"""
    info = {}
    if request.method == 'POST':
        data = request.json
        name = data["username"]
        if name is not None and name not in users:
            users.append(name)
            info["info"] = f"added user {name}"
        else:
            info["info"] = "error adding user"
    else:
        if username in users:
            info["info"] = "this user exists"
            info["user"] = username
            info["len"] = len(username)
        else:
            info["info"] = "This user does not exist"

    return jsonify(info)

@socketio.on('message')
def handle_message(message):
    print('recieved message: ' + message)

@socketio.on('connect')
def handle_connect():
    print("device connected")
    emit('my response', {'data' : 'Connected!'})

#testing room stuff...
@socketio.on('join')
def on_join(data):
    username = data['username']
    users.append(username)
    room = data['room']
    if room in lobbies:
        join_room(room)
        send(username + ' Has enterd the room', room=room)
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