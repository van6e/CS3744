using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class ManagerScript : MonoBehaviour
{

		public Button button;

		public GameObject prefab;
		public GameObject cube;

		public Toggle deleteToggle;
		public Toggle rotateToggle;
		public Toggle translateToggle;

		public Ray ray;
		public RaycastHit hit;
		public GameObject hitCube;

		private Vector3 previousPosition;

		// Variables for the camera functions
		// Taken from the Camera Manipulation assignment solution
		public float transDampCoeff = 0.015f;
    public float rotDampCoeff = 0.015f;
    public float zoomMultiplier = 0.1f;
    private Vector3 prevMousePos;

    // Start is called before the first frame update
    void Start() {
			button.onClick.AddListener(AddCube);
    }

    // Update is called once per frame
    void Update() {
			// Camera zooming/translating/rotating functions
			// Taken from the Camera Manipulation assignment solution
    	zoomer();
			translator();
			rotator();

			if (Input.GetMouseButton(0)) {
				// Calls delete() if the delete toggle is on
				if (deleteToggle.isOn) {
					delete();
				}
				// Calls translate() if the translate toggle is on
				if (translateToggle.isOn) {
					translate();
				}
				// Calls rotate() if the rotate toggle is on
				if (rotateToggle.isOn) {
					rotate();
				}
			}

			previousPosition = Input.mousePosition;
    }

		/* When the button is clicked, a cube should be added into the scene 5 units in
		 * front of the camera. */
		public void AddCube() {
			Vector3 cameraPosition = Camera.main.transform.position;
			prefab.SetActive(true);
			cube = Instantiate(prefab, new Vector3(cameraPosition.x, cameraPosition.y, cameraPosition.z + 5), Quaternion.identity);
		}

		/* Returns the hit object if an object was hit. */
		public GameObject HitCube() {
			ray = Camera.main.ScreenPointToRay(Input.mousePosition);
				if (Physics.Raycast(ray, out hit)) {
					if (Input.GetMouseButtonDown(0)) { //maintains original object when mulitple objects intersect
						hitCube = hit.collider.gameObject;
					}
				}
				return hitCube;
		}

		/* Deletes a cube from the scene whenever a user left clicks the cube. */
		public void delete() {
			GameObject deleteHit = HitCube();
			if (deleteHit != null ) {
				Destroy(deleteHit); //delete the object that has been hit by the ray
			}
		}

		/* Translates a cube through the scene when the left button is clicked and dragged. */
		public void translate() {
			GameObject translateHit = HitCube();
			if (translateHit != null) {
				translateHit.transform.Translate(0.01f * (Input.mousePosition - previousPosition), Space.World);
			}
		}

		/* Rotates a cube through the scene when the left button is clicked and dragged. */
		public void rotate() {
			GameObject rotateHit = HitCube();
			if (rotateHit != null) {
				Vector3 difference = previousPosition - Input.mousePosition;
				rotateHit.transform.Rotate(-1 * zoomMultiplier * Vector3.right * difference.y, Space.Self);
				rotateHit.transform.Rotate(zoomMultiplier * Vector3.up * difference.x, Space.Self);
			}
		}

		// Taken from the Camera Manipulation assignment solution
		void zoomer() {
        float scrollData = Input.mouseScrollDelta.y;
        Camera.main.transform.Translate(new Vector3(0, 0, scrollData * zoomMultiplier), Space.Self);
    }

		// Taken from the Camera Manipulation assignment solution
    void translator() {
        bool middleButton = Input.GetMouseButton(2);
        bool middleStart = Input.GetMouseButtonDown(2);
        if (middleStart) {
            prevMousePos = Input.mousePosition;
        }
        if (middleButton) {
            Vector3 currentPos = Input.mousePosition;
            Vector3 translationVector = prevMousePos - Input.mousePosition;
            Camera.main.transform.Translate(translationVector * transDampCoeff, Space.Self);
            prevMousePos = Input.mousePosition;
        }
    }

		// Taken from the Camera Manipulation assignment solution
    void rotator() {
        bool rightButton = Input.GetMouseButton(1);
        bool rightStart = Input.GetMouseButtonDown(1);
        if (rightStart) {
            prevMousePos = Input.mousePosition;
        }
        if (rightButton) {
            Vector3 vecDiff = (Input.mousePosition - prevMousePos) * rotDampCoeff;
            Vector3 rotVec = new Vector3(vecDiff.y*-1, vecDiff.x, 0.0f);
            Vector3 currentRot = Camera.main.transform.rotation.eulerAngles;
            currentRot += rotVec;
            Camera.main.transform.rotation = Quaternion.Euler(currentRot);
            prevMousePos = Input.mousePosition;
        }
		}
}