function startCompass() {
    window.addEventListener("deviceorientation", (event) => {
        let heading;
        
        if (event.webkitCompassHeading !== undefined) {
            // iOS: Liefert direkt magnetischen Norden
            heading = event.webkitCompassHeading;
        } else if (event.alpha !== null) {
            // Android: Eventuell nicht magnetisch Nord, aber oft eine Näherung
            heading = (360 - event.alpha) % 360;
        } else {
            console.log("Kompass-Sensor nicht verfügbar");
            return;
        }

        console.log("Magnetische Richtung: " + heading.toFixed(2) + "°");
    });
}

// Falls iOS: Erst Berechtigungen anfordern
function requestPermissions() {
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
        DeviceMotionEvent.requestPermission()
        .then(permissionState => {
            if (permissionState === 'granted') {
                console.log("Sensor-Zugriff erlaubt!");
                startCompass();
            } else {
                console.log("Sensor-Zugriff verweigert.");
            }
        })
        .catch(console.error);
    } else {
        startCompass(); // Android braucht keine Extra-Freigabe
    }
}

// Startet das Ganze nach einem Klick (wegen iOS-Sicherheitsanforderungen)
document.addEventListener("click", requestPermissions);
