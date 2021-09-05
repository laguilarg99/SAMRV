import numpy as np
import glob
import math
import statistics as st
import matplotlib.pyplot as plt
from numpy.lib.function_base import angle
from sklearn import linear_model
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

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
        if(k < beginingTry.size):
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


def return_final_velocity(velocity):
    final_velocity = []

    for i in velocity:
        final_velocity.append(i)

    final_velocity = np.array(final_velocity)
    return final_velocity

def predict_linear_regresion(final_velocity):
    x = np.array(range(0,final_velocity.size))
    y = final_velocity
    plt.plot(x,y,marker='.', markersize=1)
    plt.show()

    x = x.reshape(-1,1)


    data_train, data_test, target_train, target_test = train_test_split(x,y, random_state = 10)

    linear = linear_model.LinearRegression()
    linear.fit(data_train, target_train)

    x = np.array(range(final_velocity.size+1,final_velocity.size*20))
    x = x.reshape(-1,1)
    pred1 = linear.predict(x)
    pred1 = np.array(pred1)

    x = np.array(range(0,(final_velocity.size*20)-1))
    y = np.concatenate((final_velocity, pred1), axis=None)

    dimension = 550000
    x_final = []
    y_final = []

    for i in range(0, dimension):
        if(i < x.size)&(i < y.size):
            x_final.append(x[i])
            y_final.append(y[i])
    
    x = np.array(x_final)
    y = np.array(y_final)
        
    return x,y

def calculate_time_data(timeTry):
    x = np.array(range(0,timeTry.size))
    y = timeTry

    dimension = 150
    x_final = []
    y_final = []

    for i in range(0, dimension):
        if(i < x.size)&(i < y.size):
            x_final.append(x[i])
            y_final.append(y[i])
    
    x = np.array(x_final)
    y = np.array(y_final)

    return x,y

f = open("data/data1.txt", "r")
velocity1, timeTry1, posTarget1, posMouse1 = read_data_from_file(f)
f.close()

f = open("data/data2.txt", "r")
velocity2, timeTry2, posTarget2, posMouse2 = read_data_from_file(f)
f.close()

f = open("data/data3.txt", "r")
velocity3, timeTry3, posTarget3, posMouse3 = read_data_from_file(f)
f.close()

f = open("data/data4.txt", "r")
velocity4, timeTry4, posTarget4, posMouse4 = read_data_from_file(f)
f.close()

f = open("data/data51.txt", "r")
velocity51, timeTry51, posTarget51, posMouse51 = read_data_from_file(f)
f.close()

f = open("data/data2.txt", "r")
velocity6, timeTry6, posTarget6, posMouse6 = read_data_from_file(f)
f.close()

f = open("data/data3.txt", "r")
velocity7, timeTry7, posTarget7, posMouse7 = read_data_from_file(f)
f.close()

final_velocity1 = return_final_velocity(velocity1)
final_velocity2 = return_final_velocity(velocity2)
final_velocity3 = return_final_velocity(velocity3)
final_velocity4 = return_final_velocity(velocity4)
final_velocity51 = return_final_velocity(velocity51)
final_velocity6 = return_final_velocity(velocity6)
final_velocity7 = return_final_velocity(velocity7)

angles1 = calculate_angles(posMouse1, posTarget1)
angles2 = calculate_angles(posMouse2, posTarget2)
angles3 = calculate_angles(posMouse3, posTarget3)
angles4 = calculate_angles(posMouse4, posTarget4)
angles51 = calculate_angles(posMouse51, posTarget51)
angles6 = calculate_angles(posMouse6, posTarget6)
angles7 = calculate_angles(posMouse7, posTarget7)

x1,y1 = predict_linear_regresion(final_velocity1)
x2,y2 = predict_linear_regresion(final_velocity2)
x3,y3 = predict_linear_regresion(final_velocity3)
x4,y4 = predict_linear_regresion(final_velocity4)
x51,y51 = predict_linear_regresion(final_velocity51)
x6,y6 = predict_linear_regresion(final_velocity6)
x7,y7 = predict_linear_regresion(final_velocity7)

plt.plot(x1, y1, alpha=0)
plt.plot(x2, y2, alpha=0)
plt.plot(x3, y3, alpha=0)
plt.plot(x4, y4, alpha=0)
plt.plot(x51, y51, alpha=0)
m1,b1 = np.polyfit(x1, y1, 1)
m2,b2 = np.polyfit(x2, y2, 1)
m3,b3 = np.polyfit(x3, y3, 1)
m4,b4 = np.polyfit(x4, y4, 1)
m51,b51 = np.polyfit(x51, y51, 1)
plt.plot(x1, m1*x1 + b1)
plt.plot(x2, m2*x2 + b2)
plt.plot(x3, m3*x3 + b3)
plt.plot(x4, m4*x4 + b4)
plt.plot(x51, m51*x51 + b51)
plt.show()

plt.plot(x6, y6, alpha=0)
plt.plot(x7, y7, alpha=0)
m6,b6 = np.polyfit(x6, y6, 1)
m7,b7 = np.polyfit(x7, y7, 1)
plt.plot(x6, m6*x6 + b6)
plt.plot(x7, m7*x7 + b7)
plt.show()

fig, ax = plt.subplots()
data_box_plot = {'1': angles1, '2': angles2, '3': angles3, '4': angles4, '5' : angles51, '6':angles6, '7': angles7}
ax.boxplot(data_box_plot.values())
plt.show()

x1,y1 = calculate_time_data(timeTry1)
x2,y2 = calculate_time_data(timeTry2)
x3,y3 = calculate_time_data(timeTry3)
x4,y4 = calculate_time_data(timeTry4)
x51,y51 = calculate_time_data(timeTry51)
x6,y6 = calculate_time_data(timeTry6)
x7,y7 = calculate_time_data(timeTry7)

plt.plot(x1, y1, alpha=0)
plt.plot(x2, y2, alpha=0)
plt.plot(x3, y3, alpha=0)
plt.plot(x4, y4, alpha=0)
plt.plot(x51, y51, alpha=0)
m1,b1 = np.polyfit(x1, y1, 1)
m2,b2 = np.polyfit(x2, y2, 1)
m3,b3 = np.polyfit(x3, y3, 1)
m4,b4 = np.polyfit(x4, y4, 1)
m51,b51 = np.polyfit(x51, y51, 1)
plt.plot(x1, m1*x1 + b1)
plt.plot(x2, m2*x2 + b2)
plt.plot(x3, m3*x3 + b3)
plt.plot(x4, m4*x4 + b4)
plt.plot(x51, m51*x51 + b51)
plt.show()

plt.plot(x6, y6, alpha=0)
plt.plot(x7, y7, alpha=0)
m6,b6 = np.polyfit(x6, y6, 1)
m7,b7 = np.polyfit(x7, y7, 1)
plt.plot(x6, m6*x6 + b6)
plt.plot(x7, m7*x7 + b7)
plt.show()

print("Media angulos 1: ")
print(st.mean(angles1))
print("Media velocidad 1: ")
print(st.mean(velocity1))
print("Media tiempo 1: ")
print(st.mean(timeTry1))

print("Media angulos 2: ")
print(st.mean(angles2))
print("Media velocidad 2: ")
print(st.mean(velocity2))
print("Media tiempo 2: ")
print(st.mean(timeTry2))

print("Media angulos 3: ")
print(st.mean(angles3))
print("Media velocidad 3: ")
print(st.mean(velocity3))
print("Media tiempo 3: ")
print(st.mean(timeTry3))


print("Media angulos 4: ")
print(st.mean(angles4))
print("Media velocidad 4: ")
print(st.mean(velocity4))
print("Media tiempo 4: ")
print(st.mean(timeTry4))

print("Media angulos 51: ")
print(st.mean(angles51))
print("Media velocidad 51: ")
print(st.mean(velocity51))
print("Media tiempo 51: ")
print(st.mean(timeTry51))

print("Media angulos 6: ")
print(st.mean(angles6))
print("Media velocidad 6: ")
print(st.mean(velocity6))
print("Media tiempo 6: ")
print(st.mean(timeTry6))

print("Media angulos 7: ")
print(st.mean(angles7))
print("Media velocidad 7: ")
print(st.mean(velocity7))
print("Media tiempo 7: ")
print(st.mean(timeTry7))
