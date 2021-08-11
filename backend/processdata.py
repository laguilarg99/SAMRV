import os

def createFile(data):
    file = open("filename.txt", "w")
    file.write(data)
    file.close()