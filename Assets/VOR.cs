using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class VOR : MonoBehaviour
{
    
    private Quaternion up;
    private GameObject mainCamera;
    // Start is called before the first frame update
    void Start()
    {
        mainCamera = GameObject.Find("CameraRig");
    }

    private float valor;
    private int direccion = 1;
    private int contador = 0;

    // Update is called once per frame
    void Update()
    {   
        valor = 2.0f;
        up =   mainCamera.transform.GetChild(0).transform.rotation;;
        if(up.x >= -0.075 && up.x <= 0.075 && up.y >= -0.075 && up.y <= 0.075 && contador == 1){
            direccion = direccion * (-1);
            contador = 0;
            transform.position = new Vector3(0.0f, 5.0f, 4.0f);
        }else if(up.x <= -0.075 || up.x >= 0.075 || up.y <= -0.075 || up.y >= 0.075) { 
            contador = 1;
            Vector3 posicionCalculada = new Vector3( (direccion)*-valor*up.y, 5.0f + (valor*up.x)*(direccion), 4.0f);
            transform.position = posicionCalculada;
        }

        
    }
}
