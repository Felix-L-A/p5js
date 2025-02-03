
let latitude = 0;
let longitude = 0;
let speed = 0; // Geschwindigkeit in m/s
let altitudeGPS = 0; //GPS Höhe
let headingGPS = 0; // Bewegungsrichtung basierend auf GPS
let headingGyro = 0; // Bewegungsrichtung basierend auf Gyroskop
let rotationY = 0; // Neigung (Y-Achse)
let statusText = "Starte...";
let permissionGranted = false; // Zugriff auf Sensoren

function setup() {
  createCanvas(windowWidth, 400); // 2D-Canvas
  textFont('sans-serif');
  
  // Prüfen, ob Geolocation verfügbar ist
  if ("geolocation" in navigator) {
    statusText = "Waiting for GPS ...";
    navigator.geolocation.watchPosition(
      (position) => {
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
        speed = position.coords.speed || 0; // Geschwindigkeit in m/s
        altitudeGPS = position.coords.altitude; // Höhe in Metern über dem Meeresspiegel
        if (position.coords.heading !== null) {
          headingGPS = position.coords.heading; // Bewegungsrichtung in Grad
        }
        statusText = "Let's go!";
      },
      (error) => {
        console.error(error);
        statusText = "receiving no GPS data.";
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000,
      }
    );
  } else {
    statusText = "Geolocation not supported.";
  }

  // Prüfen, ob iOS eine Berechtigung erfordert
  if (typeof(DeviceOrientationEvent) !== 'undefined' && typeof(DeviceOrientationEvent.requestPermission) === 'function') {
    createPermissionButton(); // Button für iOS
  } else {
    // Android/Chrome oder andere Browser (keine Berechtigung erforderlich)
    permissionGranted = true;
    setupOrientationListener(); // Bewegungssensor aktivieren
  }
}

function draw() {
  background(255);

  // Wenn keine Berechtigung für Sensoren erteilt wurde
  if (!permissionGranted) {
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(20);
    text("Please allow sensor permission", width / 2, height / 2-50);
    textSize(12);
    text("Compass v1.0", width / 2, height / 2+50);
    return;
  }
  
  // Kursanzeige über der Windrose
  drawCourseText();

  // Versionsnummer anzeigen
  fill(0);
  textSize(10);
  text("version 1.5", 20, height - 20); // Position unten links
}

function drawCourseText() {
  push();
  translate(width / 2, height / 2 - 80); // Position über der Skala
  fill(0); // Farbe des Textes (Schwarz)
  textAlign(CENTER, TOP);
  textSize(40); // Schriftgröße
  textStyle(BOLD);
  text(`COG: ${headingGPS.toFixed(0)}°           SOG: ${(speed * 3.6).toFixed(1)} km/h`, 0, -90);
  translate(0,100); 
  textStyle(BOLD);
  text(`heading: ${headingGyro.toFixed(0)}°`, 0, -100); // Zentrierter Text
  pop();
}



}

function createPermissionButton() {
  let button = createButton("Request Sensor Access");
  button.style("font-size", "24px");
  button.center();
  button.mousePressed(() => {
    DeviceOrientationEvent.requestPermission().then((response) => {
      if (response === "granted") {
        permissionGranted = true;
        setupOrientationListener();
        button.remove();
      }
    });
  });
}

function setupOrientationListener() {
  window.addEventListener("deviceorientation", (event) => {
    headingGyro = (360 - event.alpha) % 360;
   });
}
