from flask import Flask, render_template, request, make_response, jsonify
from flask import Markup
from flask_bootstrap import Bootstrap
from flask_misaka import Misaka
import os
import pandas as pd
# import dataAnalysis as da

content = ""
with open("readme.md", "r") as f:
     content = f.read()

PEOPLE_FOLDER = os.path.join('static', 'people_photo')

app = Flask(__name__)
app.config['SECRET_KEY'] = 'iridescent'
app.config['UPLOAD_FOLDER'] = PEOPLE_FOLDER
bootstrap = Bootstrap(app)
Misaka(app) # To use markdown in the template


@app.route('/')
def index():
    full_filename = os.path.join(app.config['UPLOAD_FOLDER'], 'lina.jpeg')
    # selfie = os.path.join(app.config['UPLOAD_FOLDER'], 'IMG_8441.jpg')
    return render_template('index.html', user_image=full_filename)

@app.route('/user/<name>')
def user(name):
    return render_template('user.html',name=name)

@app.route('/home')
def home():
    return render_template('home.html',text=content)

@app.route('/charts')
def chart():
    labels = ["January","February","March","April","May","June","July","August"]
    values = [10,9,8,7,6,4,7,8]
    return render_template('chart.html', values=values, labels=labels)

if __name__ == "__main__":
     app.run(host='0.0.0.0', port=5001, debug=True)