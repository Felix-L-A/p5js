function setup() {
  createCanvas(windowWidth, 400); // 2D-Canvas
  textFont('sans-serif');

        document.getElementById("start-button").addEventListener("click", requestPermissions);

        function startCompass() {
            if (!window.DeviceOrientationEvent) {
                document.getElementById("compass-heading").innerText = "DeviceOrientation wird nicht unterstützt.";
                return;
            }

            window.addEventListener("deviceorientation", (event) => {
                let heading;
                
                if (event.webkitCompassHeading !== undefined) {
                    // iOS gibt direkt magnetischen Norden aus
                    heading = event.webkitCompassHeading;
                } else if (event.alpha !== null) {
                    // Android: Berechnung als Notlösung
                    heading = (360 - event.alpha) % 360;
                } else {
                    document.getElementById("compass-heading").innerText = "Kompass-Sensor nicht verfügbar.";
                    return;
                }

                document.getElementById("compass-heading").innerText = 
                    "Magnetische Richtung: " + heading.toFixed(2) + "°";
            });
        }

        function requestPermissions() {
            if (typeof DeviceMotionEvent.requestPermission === 'function') {
                DeviceMotionEvent.requestPermission()
                .then(permissionState => {
                    if (permissionState === 'granted') {
                        console.log("Sensor-Zugriff erlaubt!");
                        startCompass();
                    } else {
                        document.getElementById("compass-heading").innerText = "Zugriff auf Sensoren verweigert.";
                    }
                })
                .catch(error => {
                    console.error("Fehler beim Anfordern der Berechtigung:", error);
                    document.getElementById("compass-heading").innerText = "Berechtigung konnte nicht angefordert werden.";
                });
            } else {
                // Android braucht keine Extra-Freigabe
                startCompass();
            }
        }
 
