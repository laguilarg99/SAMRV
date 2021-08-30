import numpy as np
import glob

# Velocity -> Every value for velocity
# timeTry -> Time needed for each try
# posTarget -> Each position of the target 
# posMouse -> Each position of the mouse

def read_data_from_file(f):
    line = f.readline()
    velocity = []

    if not line:
        return 0,0,0,0

    while(line[0] != '['):
        velocity.append(int(line))
        line = f.readline()
        if not line:
            break

    line = line.replace("[","")
    line = line.replace("]","")
    line = line.split(',')
    timeTry = []
    for i in line:
        timeTry.append(int(i))


    line = f.readline()
    line = line.replace("[","")
    line = line.replace("]","")
    line = line.split(',')
    line = np.array(line)

    posTarget = []

    for i in line:
        posTarget.append(float(i))

    posTarget = np.array(posTarget)
    posTarget = posTarget.reshape(-1,2)


    line = f.readline()
    line = line.replace("[","")
    line = line.replace("]","")
    line = line.split(',')
    line = np.array(line)

    posMouse = []

    for i in line:
        posMouse.append(float(i))

    posMouse = np.array(posMouse)
    posMouse = posMouse.reshape(-1,2)

    return velocity, timeTry, posTarget, posMouse

files = glob.glob("data/*.txt")

f = open("data/data1.txt", "r")
velocity1, timeTry1, posTarget1, posMouse1 = read_data_from_file(f)





f.close()
