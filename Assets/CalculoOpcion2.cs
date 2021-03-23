using System.Collections;
using System.Collections.Generic;
using System;
using UnityEngine;

public class CalculoOpcion2 : MonoBehaviour
{
    //Se almacena el tamaño relativo 
    //del punto respecto el tamaño de la pantalla
    //0.4º Diameter
    private double TamPunto; 

    //Distancia máxima a la que se puede posicionar
    //el punto respecto el tamaño de la pantalla
    //30º of straight head
    private double TamEspacioMax;
    

    //Distancia máxima de desplacamiento relativo
    //25º máx
    private double TamDesplazamientoMax;
    
    //Distancia mínima de desplacamiento relativo
    //10º máx
    private double TamDesplazamientoMin;
    
    //Distancia a la que se aleja para provocar error
    //5º Displacing the target
    private double TamErrorMax;

    //Distancia a la que se aleja para provocar error
    //3º Displacing the target
    private double TamErrorMin;

    //Distancia a la que se considera correcto
    //3º Horizontal and Vertical directions
    private double TamCorrect;

    //Tiempo para que aparezca un nuevo punto
    // 1 s
    private double t = 1;

    //Distancia Eye to Screen en mm tomando la distancia desde
    //la mirada al centro de la pantalla
    private double GazeScreen = 0;

    //Funcion que convierte los angulos de grados a radianes y viceversa segun el parámetro 
    //introducido:
    //0 = grados -> radianes
    //1 = radianes -> grados
    private double calculaGR(float angulo, int type){
        double result = 0.0f;

        switch (type)
        {
            case 0:
                result = angulo*(Math.PI/180); //radianes
                break;
            case 1:
                result = angulo*(180/Math.PI); //grados
                break;
            default:
                break;
        }

        return result;
    }

    //Calcula las dimensiones necesarias de los componentes del experimento
    private void calculaValores(){

        double punto = calculaGR(0.4f,0);
        double radio = calculaGR(30.0f,0);
        //double min PARÁBOLA
        double desplazamientoMax = calculaGR(25.0f,0);
        double desplazamientoMin = calculaGR(10.0f,0);
        double ErrorMax = calculaGR(5.0f,0);
        double ErrorMin = calculaGR(3.0f,0);
        double correcto = ErrorMin;

        //Tamaño del punto
        //0.4º de diametro
        TamPunto = GazeScreen * Math.Tan(punto);
        
        //Área en la que apareceran los puntos
        //30º circunferencia máxima - Min: Determinado por una parabola de 45º
        TamEspacioMax = GazeScreen * Math.Tan(radio);

        //Desplazamiento que pueden sufrir los puntos
        //10-25º en cualquier dirección
        TamDesplazamientoMax = GazeScreen * Math.Tan(desplazamientoMax);
        TamDesplazamientoMin = GazeScreen * Math.Tan(desplazamientoMin);

        //Error que pueden sufrir los puntos de forma inducida
        //3-5º en cualquier dirección
        TamErrorMax = GazeScreen * Math.Tan(ErrorMax);
        TamErrorMin = GazeScreen * Math.Tan(ErrorMin);

        //Comprobar que el valor es correcto <3º Vertical y Horizontal
        TamCorrect = GazeScreen * Math.Tan(correcto);

    }


    //Almacena la posicion inicial
    Vector3 origin;

    //Almacena la posición actual del punto
    Vector3 posicionActual;
    
    //Elemento aleatorios para la probabilidad del 65%
    private int numero = 0;


    //Para calcular cuando se induce al error
    //se calcula la probabilidad de un CS (Complex Spikes) después de 
    //una sacada, en nuestro caso, como no disponemos de 
    //esa información, nos valdremos de sus resultados
    //aprox. 65%
    //Array con 65 valores aleatorios para calcular dicha probabilidad
    private int [] probabilidad = {63, 83, 47, 46, 27, 8, 75, 54, 80, 41, 97, 73, 75, 80, 26, 21, 30, 11, 24, 5, 39, 4, 29, 36, 48, 67, 13, 98, 26, 91, 61, 47, 46, 24, 
                0, 22, 73, 58, 62, 45, 61, 37, 77, 80, 84, 49, 12, 74, 9, 80, 98, 22, 90, 25, 84, 79, 25, 51, 84, 92, 99, 5, 87, 3, 76};
    
    //Array con las 8 posibles direcciones en las que se puede mover el punto
    private double [] directions = {0.0,  Math.PI/4, Math.PI/2, (3*Math.PI)/4, Math.PI,  (5*Math.PI)/4,  (3*Math.PI)/2,  (7*Math.PI)/4};
    

    //Contador que controla si el punto debe volver a su posición original o si debería moverse en una de 
    //la ocho direcciones
    private int contador = 0;
    
    // Start is called before the first frame update
    void Start()
    {
        origin = transform.position;
    }

    
    private void move(){
        Vector3 posicionAux = transform.position;
        
        while(Vector3.Distance(posicionAux, transform.position) == 0){
            int n = UnityEngine.Random.Range(0, directions.Length);
            float theta = (float) directions[n];
            float posicionRango = UnityEngine.Random.Range((float)TamDesplazamientoMin, (float)TamDesplazamientoMax);
            float x = Mathf.Sin(theta)* posicionRango;
            float y = Mathf.Cos(theta)* posicionRango;
            Vector3 posicionCalculada = new Vector3(x,y,-5.0f);
            
            if(Vector3.Distance(origin, posicionCalculada) < (float) TamEspacioMax){
                posicionAux = transform.position;
                transform.position = posicionCalculada;
            }
        }
    }

    private void moveError(){
       Vector3 posicionCalculada = transform.position;
        
        while(Vector3.Distance(posicionCalculada, transform.position) == 0){
            int n = UnityEngine.Random.Range(0, directions.Length);
            float theta = (float) directions[n];
            float posicionRango = UnityEngine.Random.Range((float)TamErrorMin, (float)TamErrorMax);
            float x = Mathf.Sin(theta)* posicionRango;
            float y = Mathf.Cos(theta)* posicionRango;
            posicionCalculada = new Vector3(x,y,0.0f);
            
            if(Vector3.Distance(origin, posicionCalculada) < (float) TamEspacioMax){
                transform.position += posicionCalculada;
            }
        }
    }

    // Update is called once per frame
    void Update()
    {

        GazeScreen = 650;
        calculaValores();
        transform.localScale = new Vector3( (float)TamPunto, (float)TamPunto, (float)TamPunto);
        numero = (numero + 1)%100;

        if(t >= 0){
            t -= Time.deltaTime;
            if(t >= 0.5 && t <= 0.6 && contador == 1 && Array.Exists(probabilidad, element => element == numero)){
                moveError();
                contador = 0;
                return;
            }
            return;        
        }else{
            t = 1;
            if(contador == 0){
                contador = 1;
                move();  
            }       
        }

    }
}

