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
import json
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

status_file = os.path.join('static', 'status.json')
file_glob = glob(os.path.join(app.config['QC_FOLDER'], 'T1_*'))
fname = sorted([os.path.basename(f) for f in file_glob])

if os.path.isfile(status_file):
    with open(status_file, 'r') as fp:
        status_dict = json.load(fp)
    if len(status_file) != len(file_glob):
        data_set = set(list(status_dict.keys()))
        glob_set = set(fname)
        newly_added = glob_set - (glob_set & data_set)
        newly_added = list(newly_added)
        for f in newly_added:
            status_dict[f] = 'Undone'
        with open(status_file, 'w') as fp:
            json.dump(status_dict, fp)

if not os.path.isfile(status_file):
    status_dict = dict()
    for f in fname:
        status_dict[f] = 'Undone'
    with open(status_file, 'w') as fp:
        json.dump(status_dict, fp)


@app.route('/', methods=['GET', 'POST'])
def index():
    full_filename = os.path.join(app.config['UPLOAD_FOLDER'], 'lina.jpeg')
    selfie = os.path.join(app.config['UPLOAD_FOLDER'], 'selfie.jpg')
    sean = os.path.join(app.config['UPLOAD_FOLDER'], 'sean.png')
    # file_glob = glob(os.path.join(app.config['QC_FOLDER'], 'T1_*'))
    # fname = sorted([os.path.basename(f) for f in file_glob])
    with open(status_file, 'r') as fp:
        status_dict = json.load(fp)
    status = list(status_dict.values())
    label_class = ['label label-default'] * len(status)
    for i, stat in enumerate(status):
        if stat == 'Unclear':
            label_class[i] = 'label label-warning'
        elif stat == 'Edited':
            label_class[i] = 'label label-success'
    return render_template('index.html', user_image=full_filename, selfie=selfie,
           table=fname, sean=sean, status=status, label_class=label_class)

@app.route('/<name>', methods=['GET', 'POST'])
def user(name):
    name_url = os.path.join(app.config['QC_FOLDER'], name)
    new_name_url_list = [w.replace("\\", "/") for w in name_url]
    new_name_url = ''.join(new_name_url_list)
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
        if 'Undone' in request.form.values():
            status_dict[name] = 'Undone'
        elif 'Edited' in request.form.values():
            status_dict[name] = 'Edited'
        elif 'Unclear' in request.form.values():
            status_dict[name] = 'Unclear'
        with open(status_file, 'w') as fp:
            json.dump(status_dict, fp)

    return render_template('user.html',name=name, name_url=new_name_url, label_url=new_label_url,
           download_label=download_label, nextP=nextP, prevP=prevP, undoneForm=undoneForm,
           unclearForm=unclearForm, editedForm=editedForm)

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
    submit1 = SubmitField('Undone')

class EditedForm(FlaskForm):
    submit2 = SubmitField('Edited')

class UnclearForm(FlaskForm):
    submit3 = SubmitField('Unclear')

if __name__ == "__main__":
     app.run(host='localhost', port=5001, debug=True, threaded=True)
