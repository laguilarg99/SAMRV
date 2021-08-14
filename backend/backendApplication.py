from flask import Flask, request
from flask_cors import CORS
import processdata


app = Flask(__name__)
CORS(app)

result = ''

@app.route("/hola", methods=['POST'])
def hola():
    return "hola"
    # response = request.get_json()
    # result = response['value']
    # processdata.createFile(result)
    # return 'OK', 200, response

@app.route("/adios", methods=['POST'])
def adios():
    return "adios"
