from flask import Flask, render_template, request, make_response, jsonify
from flask import Markup
from flask_bootstrap import Bootstrap
from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, IntegerField, SelectField
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
# print(app.config['UPLOAD_FOLDER'])
ip_address = 'localhost'
port = '5001'

file_glob = glob(os.path.join(app.config['QC_FOLDER'], 'T1_*'))
status_dict = dict()
for f in file_glob:
    status_dict[f] = 'Undone'

@app.route('/', methods=['GET', 'POST'])
def index():
    full_filename = os.path.join(app.config['UPLOAD_FOLDER'], 'lina.jpeg')
    selfie = os.path.join(app.config['UPLOAD_FOLDER'], 'selfie.jpg')
    sean = os.path.join(app.config['UPLOAD_FOLDER'], 'sean.png')
    file_glob = glob(os.path.join(app.config['QC_FOLDER'], 'T1_*'))
    fname = sorted([os.path.basename(f) for f in file_glob])
    status = ['Undone'] * len(fname)
    return render_template('index.html', user_image=full_filename, selfie=selfie,
           table=fname, sean=sean, status=status)

@app.route('/<name>', methods=['GET', 'POST'])
def user(name):
    name_url = os.path.join(app.config['QC_FOLDER'], name)
    new_name_url_list = [w.replace("\\", "/") for w in name_url]
    new_name_url = ''.join(new_name_url_list)
    print(name)
    num = name.split('_')[1].split('.')[0]
    label_url = os.path.join(app.config['QC_FOLDER'], 'Label_' + num + '.png')
    new_label_url_list = [w.replace("\\", "/") for w in label_url]
    new_label_url = ''.join(new_label_url_list)
    download_label = 'Label_' + num + '_edited.png'

    file_glob = glob(os.path.join(app.config['QC_FOLDER'], 'T1_*'))
    fname = sorted([os.path.basename(f) for f in file_glob])
    ind = fname.index(name)
    if ind != 0 and ind != len(fname)-1:
        nextP = 'http://' + ip_address + ':' + port + '/' + fname[ind+1]
        prevP = 'http://' + ip_address + ':' + port + '/' + fname[ind-1]
    elif ind == 0:
        nextP = 'http://' + ip_address + ':' + port + '/' + fname[ind+1]
        prevP = 'http://' + ip_address + ':' + port + '/' + fname[-1]
    elif ind == len(fname)-1:
        nextP = 'http://' + ip_address + ':' + port + '/' + fname[0]
        prevP = 'http://' + ip_address + ':' + port + '/' + fname[ind - 1]
    undoneForm = UndoneForm()
    unclearForm = UnclearForm()
    editedForm = EditedForm()
    if request.method == 'POST':
        print(form.validate())
    return render_template('user.html',name=name, name_url=new_name_url, label_url=new_label_url,
           download_label=download_label, nextP=nextP, prevP=prevP, form=form)

@app.route('/home')
def home():
    selfie = os.path.join(app.config['UPLOAD_FOLDER'], 'selfie.jpg')
    return render_template('home.html',text=content, selfie = selfie)

@app.route('/charts')
def chart():
    labels = ["January","February","March","April","May","June","July","August"]
    values = [10,9,8,7,6,4,7,8]
    return render_template('chart.html', values=values, labels=labels)

class UndoneForm(FlaskForm):
    submit = SubmitField('Undone')

class EditedForm(FlaskForm):
    submit = SubmitField('Edited')

class UnclearForm(FlaskForm):
    submit = SubmitField('Unclear')

if __name__ == "__main__":
     app.run(host='localhost', port=5001, debug=True, threaded=True)
