from flask import Flask, request
from flask_cors import CORS
import json
import processdata


app = Flask(__name__)
CORS(app)

result = ''

@app.route("/processdata", methods=['POST'])
def processdata_to_front():
    data = request.json
    processdata.process_data_json(data)
    return "OK"

