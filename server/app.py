from flask import Flask, render_template

app  = Flask(__name__)

@app.route("/")
def index():
    """Here we want to show lobbies and stuff"""
    return render_template("index.html")

@app.route("/user/<username>")
def get_user(username):
    """Maybe intersting later idk"""
    if(username == "Thogul"):
        return f"<h1>{username} is best user</h1>"
    else:
        return f"No user with name {username} found"

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)