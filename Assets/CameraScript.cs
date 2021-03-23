using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CameraScript : MonoBehaviour
{

    // Start is called before the first frame update
    void Start()
    {
        UnityEngine.XR.XRDevice.DisableAutoXRCameraTracking (GetComponent<Camera>(), true);
        
    }

    // Update is called once per frame
    void Update()
    {
         Camera.main.transform.rotation = Quaternion.Euler(0,0,0);
    }
}
