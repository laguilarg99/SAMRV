using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class VOR : MonoBehaviour
{
    
    private Vector3 up;
    // Start is called before the first frame update
    void Start()
    {
    }

    private float valor;

    // Update is called once per frame
    void Update()
    {
        valor = 0.2f;
        up = Camera.main.transform.eulerAngles;
        Vector3 posicionCalculada = new Vector3(valor*up.y, 5.0f + (valor*up.x), 4.0f);
        transform.position = posicionCalculada;
    }
}
