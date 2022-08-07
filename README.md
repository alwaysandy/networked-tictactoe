# networked-tictactoe
TicTacToe that can be played by 2 people over a flask socketIO server

To use, install flask-socketio, eventlet and gunicorn
!! eventlet must be version 0.30.2

Run with: gunicorn -b 0.0.0.0:5000 --worker-class eventlet -w 1 server:app
