#!/usr/bin/python3

import logging
import os
import shutil
import sys

from flask import Flask
from flask import request
from flask import render_template
from flask import make_response

import publishing

app = Flask(__name__)

@app.route('/')
def index():
    publishing_root = publishing.publish(request.headers["X-Sandstorm-Session-Id"])
    return render_template('index.html', publishing_root=publishing_root)

@app.route('/slides.md', methods=['GET'])
def get_slides():
    with open("/var/slides.md", encoding='utf-8') as fp:
        return fp.read()

@app.route('/slides.md', methods=['PUT'])
def save_slides():
    new_slides = request.get_data().decode('utf-8')
    with open('/var/slides.md', 'w', encoding='utf-8') as fp:
        fp.write(new_slides)
    publishing.update_published_slides()
    return make_response("", 200)

if __name__ == '__main__':
    if not os.path.isfile("/var/slides.md"):
        shutil.copy("initial-slides.md", "/var/slides.md")
    publishing.update_static_publish_folder()
    publishing.update_published_slides()
    app.run('0.0.0.0', 8000, debug=True)
