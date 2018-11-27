from flask import Flask, render_template, request, make_response, jsonify
from flask import Markup
from flask_bootstrap import Bootstrap
from flask_misaka import Misaka
import os
import pandas as pd
from glob import glob
from flask_table import Table, Col
# import dataAnalysis as da

"""
class Item(object):
    def __init__(self, name):
        self.name = name

class ItemTable(Table):
    name = Col('Name')
"""
content = ""
with open("readme.md", "r") as f:
     content = f.read()

PEOPLE_FOLDER = os.path.join('static', 'people_photo')
QC_FOLDER = os.path.join('static', 'img', 'ImgToQC')

app = Flask(__name__)
app.config['SECRET_KEY'] = 'iridescent'
app.config['UPLOAD_FOLDER'] = PEOPLE_FOLDER
app.config['QC_FOLDER'] = QC_FOLDER
app.config['ENV'] = ""
bootstrap = Bootstrap(app)
Misaka(app) # To use markdown in the template
print(app.config['UPLOAD_FOLDER'])

@app.route('/')
def index():
    full_filename = os.path.join(app.config['UPLOAD_FOLDER'], 'lina.jpeg')
    selfie = os.path.join(app.config['UPLOAD_FOLDER'], 'selfie.jpg')
    sean = os.path.join(app.config['UPLOAD_FOLDER'], 'sean.png')
    file_glob = glob(os.path.join(app.config['QC_FOLDER'], 'T1_*'))
    fname = sorted([os.path.basename(f) for f in file_glob])
    status = ['Undone'] * len(fname)
    return render_template('index.html', user_image=full_filename, selfie=selfie,
           table=fname, sean=sean, status=status)

@app.route('/<name>')
def user(name):
    name_url = os.path.join(app.config['QC_FOLDER'], name)
    num = name.split('_')[1].split('.')[0]
    label_url = os.path.join(app.config['QC_FOLDER'], 'Label_' + num + '.png')
    return render_template('user.html',name=name, name_url=name_url, label_url=label_url)

@app.route('/home')
def home():
    selfie = os.path.join(app.config['UPLOAD_FOLDER'], 'selfie.jpg')
    return render_template('home.html',text=content, selfie = selfie)

@app.route('/charts')
def chart():
    labels = ["January","February","March","April","May","June","July","August"]
    values = [10,9,8,7,6,4,7,8]
    return render_template('chart.html', values=values, labels=labels)

if __name__ == "__main__":
     app.run(host='localhost', port=5001, debug=True, threaded=True)
