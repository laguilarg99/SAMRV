import numpy as np
import glob
import math
import statistics as st
import matplotlib.pyplot as plt
from numpy.lib.function_base import angle

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
    line = np.array(line)
    timeTry = []
    for i in line:
        timeTry.append(int(i))

    timeTry = np.array(timeTry)

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

def calculate_init_try(i, posMouse1, posTarget1):
    beginingTry = []
    counter = 0
    k = 0
    for j in posMouse1:
        if ((j[0]>=posTarget1[0][0])&(j[0]<=posTarget1[0][0]+15)&(j[1]>=posTarget1[0][1])&(j[1]<=posTarget1[0][1]+15)):
            if(counter == 0):
                beginingTry.append(k)
            counter += 1
        elif(counter >= i):
            counter = 0
        k += 1        
    beginingTry = np.array(beginingTry)
    return beginingTry

def calculate_pos_begining(posMouse1, posTarget1):
    pos = 0
    accuracy = 1000

    for i in range(20):
        beginingTry = calculate_init_try(i, posMouse1, posTarget1)
        if(abs(beginingTry.size - timeTry1.size) < accuracy):
            accuracy = abs(beginingTry.size - timeTry1.size)
            pos = i

    return calculate_init_try(pos, posMouse1, posTarget1)


def calculate_pos_ending(posTarget1):
    endTry = []

    for i in range(1,posTarget1.shape[0],3):
        endTry.append(posTarget1[i])


    return np.array(endTry)

def get_angles(posMouse1,endingTry, beginingTry):
    k = 0
    angles = []
    for i in endingTry:
        a = posMouse1[beginingTry[k]]
        b = posMouse1[beginingTry[k]+35]
        c = i
        
        ba = a - b
        bc = c - b

        cosine_angle = np.dot(ba, bc) / (np.linalg.norm(ba) * np.linalg.norm(bc))
        angle = np.arccos(cosine_angle)
        angles.append(math.degrees(angle))
        k += 1

    return np.array(angles)

def calculate_angles(posMouse1, posTarget1): 
    beginingTry = calculate_pos_begining(posMouse1, posTarget1)
    endingTry = calculate_pos_ending(posTarget1)
    return get_angles(posMouse1, endingTry, beginingTry)

files = glob.glob("data/*.txt")

f = open("data/data1.txt", "r")
velocity1, timeTry1, posTarget1, posMouse1 = read_data_from_file(f)
f.close()

final_velocity = []

for i in velocity1:
    if(i > 200) & (i < 2500):
        final_velocity.append(i)

final_velocity = np.array(final_velocity)

angles = calculate_angles(posMouse1, posTarget1)




x = range(0,final_velocity.size)
y = final_velocity

plt.plot(x, y, 'o')

m,b = np.polyfit(x, y, 1)

plt.plot(x, m*x + b)
plt.show()


fig, ax = plt.subplots()
ax.boxplot(angles)
plt.show()

print(st.mean(angles))
print(st.mean(velocity1))
print(st.mean(timeTry1))


