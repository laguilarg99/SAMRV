import os
import io
import base64
import matplotlib.pyplot as plt
import numpy as np
import datetime

def createFile(data):
    file = open("filename.txt", "w")
    file.write(data)
    file.close()

def fig_to_base64(fig):
    img = io.BytesIO()
    fig.savefig(img, format='png',
                bbox_inches='tight')
    img.seek(0)

    return base64.b64encode(img.getvalue())

def process_data_json(arr):
    file_name_date = datetime.datetime.now().strftime("%y%m%d_%H%M%S")
    file_name = file_name_date.join(["data", file_name_date, ".txt"])
    file_data = open(file_name, "w")

    for i in arr:
        file_data.write(str(i))
        file_data.write("\n")

