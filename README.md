# SAMRV
## ES: Sistema de Adaptación motora en entorno de realidad virtual
## EN: Motor Adaptation System in a virtual reality environment

There are two branches in this repository:


**master** - Virtual reality environment in Unity 3D

In order to execute this app you only have to import the project to the Unity environment VERSION: 2019.4.21f1


**web** - Web application 

In order to execute this app go to the backend folder and then execute:

```Bash
        docker build . -t processdata
        docker run -d -p 5000:5000 processdata
```

Then go to the frontend folder and execute:

```Bash
        docker build . -t front
        docker run -d -p 80:80 front
```




