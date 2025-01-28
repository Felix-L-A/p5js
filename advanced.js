let latitude = 0;
let longitude = 0;
let speed = 0; // Geschwindigkeit in m/s
let headingGPS = 0; // Bewegungsrichtung basierend auf GPS
let altitudeGPS = 0; // Höhe basierend auf GPS
let headingGyro = 0; // Bewegungsrichtung basierend auf Gyroskop
let rotationY = 0; // Neigung (Y-Achse)
let statusText = "Starte...";
let permissionGranted = false; // Zugriff auf Sensoren

function setup() {
  createCanvas(windowWidth, 400); // 2D-Canvas
  textFont('sans-serif');
  textSize(24);

  // Prüfen, ob Geolocation verfügbar ist
  if ("geolocation" in navigator) {
    statusText = "Waiting for GPS ...";
    navigator.geolocation.watchPosition(
      (position) => {
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
        speed = position.coords.speed || 0; // Geschwindigkeit in m/s
        altitudeGPS = position.coords.altitude;
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
    text("Please allow sensor permission", width / 2, height / 2);
    return;
  }

  // Neigungsanzeiger (Wasserlibelle)
  drawInclinationIndicator();
  
  // Kursanzeige über der Windrose
  drawCourseText();

  // 2D-Overlay für GPS und Geschwindigkeit
  draw2DOverlay();

  // Isometrische Windrose
  drawIsometricWindrose();

  // Versionsnummer anzeigen
  fill(0);
  textSize(10);
  text("version 2.3", 20, height - 20); // Position unten links
}

function drawCourseText() {
  push();
  translate(width / 2, height / 2 - 60); // Position über der Windrose
  fill(0); // Farbe des Textes (Schwarz)
  textAlign(CENTER, CENTER);
  textSize(24); // Schriftgröße
  textStyle(BOLD);
  text(`COG: ${headingGPS.toFixed(0)}°           SOG: ${(speed * 3.6).toFixed(2)} km/h`, 0, -90);
  translate(0,110); 
  text(`heading: ${headingGyro.toFixed(0)}°`, 0, -60); // Zentrierter Text
  pop();
}

function draw2DOverlay() {
  fill(0);
  textAlign(LEFT, CENTER);

  // Statusinformationen anzeigen
  text(statusText, 20, 20);
  textStyle(BOLD);
  text(`lon: ${latitude.toFixed(5)}`, 20, 50);
  text(`lat: ${longitude.toFixed(5)}`, 20, 80);
  text(`altitude: ${altitudeGPS} m`, 20, 110);
}

function drawIsometricWindrose() {
  push();
  translate(width / 2, height / 2 ); // Mittelpunkt der Windrose
  let tilt = 0.5; // Neigungsfaktor für 3D-Effekt
  let radius = 200;

  // Statische Windrose (Ellipse bleibt fest)
  stroke(0);
  noFill();
  ellipse(0, 0, radius * 2, radius * 2 * tilt);

    // Rote Nadel (als Dreieck)
  fill(255, 0, 0); // Rote Füllfarbe
  noStroke();
  let needleHeight = 60; // Höhe des Dreiecks
  let needleWidth = 24; // Breite des Dreiecks
  triangle(0, -(radius * tilt), -needleWidth / 2, -(radius * tilt) + needleHeight, 
           needleWidth / 2, -(radius * tilt) + needleHeight);

  // Rotierende Gradmarkierungen und Gradzahlen entlang der Ellipse
  for (let i = 0; i < 360; i += 20) {
    let adjustedAngle = (i - headingGyro - 90 + 360) % 360; // Gradmarkierungen basierend auf Kurs
    let angle = radians(adjustedAngle);

    // Positionen entlang der Ellipse
    let xInner = (radius - 10) * cos(angle);
    let yInner = (radius - 10) * sin(angle) * tilt;
    let xOuter = radius * cos(angle);
    let yOuter = radius * sin(angle) * tilt;

    // Gradmarkierungen zeichnen
    if (i % 40 === 0) {
      stroke(0);
      line(xInner, yInner, xOuter, yOuter);
      fill(0);
      noStroke();
      textSize(14);
      let xText = (radius - 30) * cos(angle);
      let yText = (radius - 30) * sin(angle) * tilt;
      textAlign(CENTER, CENTER);
      text(i, xText, yText);
    } else {
      stroke(0);
      line((radius - 15) * cos(angle), (radius - 15) * sin(angle) * tilt, xInner, yInner);
    }
  }  
  pop();
}

function drawInclinationIndicator() {
  push();
  translate(width / 2, height - 40); // Position unter der Windrose
  let indicatorWidth = 300;
  let positionX = map(rotationY, -30, 30, -indicatorWidth / 2, indicatorWidth / 2);
  stroke(0);
  line(-indicatorWidth / 2, 0, indicatorWidth / 2, 0);
  fill(map(abs(rotationY), 0, 30, 0, 255), 255 - map(abs(rotationY), 0, 30, 0, 255), 0);
  ellipse(positionX, 0, 20, 20);
  fill(0);
  textSize(20);
  textStyle(NORMAL);
  text(`heel: ${rotationY.toFixed(1)}°`, -30, 30);
  pop();
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
    headingGyro = event.alpha || 0;
    rotationY = event.beta || 0;
  });
}
