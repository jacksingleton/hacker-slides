#!/usr/bin/python3

import shutil
import os
import logging

from flask import Flask
from flask import request
from flask import make_response

app = Flask(__name__)

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/slides.md', methods=['GET'])
def get_slides():
    with open("/var/slides.md", encoding='utf-8') as fp:
        return fp.read()

@app.route('/slides.md', methods=['PUT'])
def save_slides():
    new_slides = request.get_data().decode('utf-8')
    with open('/var/slides.md', 'w', encoding='utf-8') as fp:
        fp.write(new_slides)
    return make_response("", 200)

if __name__ == '__main__':
    if not os.path.isfile("/var/slides.md"):
        shutil.copy("initial-slides.md", "/var/slides.md")
    app.run('0.0.0.0', 8000, debug=True)
