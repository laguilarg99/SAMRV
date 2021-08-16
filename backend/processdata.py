import os
import io
import base64
import matplotlib.pyplot as plt
import numpy as np

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
    velocity = []
    for i in arr:
        if(i != arr[len(arr)-1]):
            velocity.append(i)
            
    time = arr[len(arr)-1]

    velocity = np.array(velocity)

    #Delete 0 values from array because they appear while begining a new try.
    velocity = velocity[velocity != 0]
    avg_velocity = np.average(velocity)

    fig = plt.figure(figsize=(15,10))
    plt.subplot(121)
    plt.scatter(np.arange(0,len(time), 1), time)
    plt.subplot(122)
    plt.plot(np.arange(0,len(time), 1), time)
    plt.suptitle('Time to get to the point (ms)')
    plt.ylabel('Time')
    plt.xlabel('Try')

    encoded = fig_to_base64(fig)
    my_html = '<img class="card-img-top mt-4 w-100 h-65" src="data:image/png;base64, {}">'.format(encoded.decode('utf-8'))

    return avg_velocity, my_html