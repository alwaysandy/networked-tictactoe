from flask import Flask, render_template, url_for, request, redirect
from flask_socketio import SocketIO, emit, join_room, leave_room, close_room
import json

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)
game = {
    "p1": None,
    "p2": None,
    "turn": None,
}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/tictactoe')
def tictactoe():
    return render_template('tictactoe.html')

@socketio.on('join')
def on_join(data):
    if not game["p1"]:
        print("TO player 1")
        game["p1"] = request.sid
        game["turn"] = game["p1"]
        join_room("ASS")
        pID = json.dumps(game["p1"])
        emit("player", pID, to=game["p1"])
    elif not game["p2"]:
        print("To player 2")
        game["p2"] = request.sid
        join_room("ASS")
        pID = json.dumps(game["p2"])
        emit("player", pID, to=game["p2"])
        emit('joined', pID, broadcast=True)
    print(request.sid + " joined")

@socketio.on('move')
def on_move(c):
    if (request.sid == game["p1"]):
        emit('move', c, to=game["p2"])
    else:
        emit('move', c, to=game["p1"])

@socketio.on('reset_server')
def on_reset():
    if game["turn"] == game["p1"]:
        game["turn"] = game["p2"]
    else:
        game["turn"] = game["p1"]
    turn = json.dumps(game["turn"])
    emit('reset_game', turn, broadcast=True) 

@socketio.on('close_game')
def on_close():
    game["p1"] = None
    game["p2"] = None
    game["turn"] = None
    emit('close', broadcast=True)
    room_close("ASS")

if __name__ == '__main__':
    socketio.run(app)
