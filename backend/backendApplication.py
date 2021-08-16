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
    avg, html = processdata.process_data_json(data)
    html = html + "<h1 id=\"velocity_avg_value\" class=\"d-none\">"+ str(avg) + "</h1>"
    return html
    # response = request.get_json()   
    # result = response['value']
    # processdata.createFile(result)
    # return 'OK', 200, response
