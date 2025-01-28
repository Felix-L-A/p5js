let latitude = 0;
let longitude = 0;
let speed = 0; // Geschwindigkeit in m/s
let headingGPS = 0; // Bewegungsrichtung basierend auf GPS
let headingGyro = 0; // Bewegungsrichtung basierend auf Gyroskop
let rotationY = 0; // Neigung (Y-Achse)
let statusText = "Starte...";
let permissionGranted = false; // Zugriff auf Sensoren

function setup() {
  createCanvas(800, 400); // 2D-Canvas
  textFont('sans-serif');
  textSize(16);

  // Prüfen, ob Geolocation verfügbar ist
  if ("geolocation" in navigator) {
    statusText = "Waiting for GPS ...";
    navigator.geolocation.watchPosition(
      (position) => {
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
        speed = position.coords.speed || 0; // Geschwindigkeit in m/s
        if (position.coords.heading !== null) {
          heading = position.coords.heading; // Bewegungsrichtung in Grad
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

}

function drawCourseText() {
  push();
  translate(width / 2, height / 2 + 50); // Position über der Windrose
  fill(0); // Farbe des Textes (Weiß)
  textAlign(CENTER, CENTER);
  textSize(20); // Schriftgröße
  textStyle(BOLD);
  text(`bearing: ${headingGyro.toFixed(0)}°`, 0, 0); // Zentrierter Text
  pop();
}

function draw2DOverlay() {
  fill(0);
  textAlign(LEFT, CENTER);

  // Statusinformationen anzeigen
  text(statusText, 20, 20);
  text(`lon: ${latitude.toFixed(5)}`, 20, 50);
  text(`lat: ${longitude.toFixed(5)}`, 20, 80);

  translate(width / 2, height / 2 - 60); // Position oberhalb der Windrose
  fill(0); // Farbe des Textes (schwarz)
  textAlign(CENTER, CENTER);
  textSize(20); // Schriftgröße
  textStyle(BOLD);
  let speedKmh = (speed * 3.6).toFixed(2); // Geschwindigkeit in km/h
  text(`COG: ${headingGPS.toFixed(0)}°        SOG: ${speedKmh} km/h`, 0, 0); // Text anzeigen

  // Versionsnummer unten links anzeigen
  textSize(10); // Kleine Schriftgröße
  text("version 1.8", 10, height - 10); // Position unten links
}

function drawIsometricWindrose() {
  translate(width / 2, height / 2 + 50); // Mittelpunkt der Windrose
  let tilt = 0.5; // Neigungsfaktor für 3D-Effekt
  let radius = 150;

  // Statische Windrose (Ellipse bleibt fest)
  stroke(0);
  noFill();
  ellipse(0, 0, radius * 2, radius * 2 * tilt);

  // Rotierende Gradmarkierungen und Gradzahlen entlang der Ellipse
  for (let i = 0; i < 360; i += 20) {
    let adjustedAngle = (i - heading + 360) % 360; // Gradmarkierungen basierend auf Kurs
    let angle = radians(adjustedAngle);

    // Positionen entlang der Ellipse
    let xInner = (radius - 10) * cos(angle);
    let yInner = (radius - 10) * sin(angle) * tilt;
    let xOuter = radius * cos(angle);
    let yOuter = radius * sin(angle) * tilt;

    // Gradmarkierungen zeichnen
    if (i % 40 === 0) {
      // Große Markierungen (alle 40°)
      stroke(0);
      line(xInner, yInner, xOuter, yOuter);

      // Gradzahlen anzeigen
      fill(0);
      noStroke();
      textSize(14);
      let xText = (radius - 30) * cos(angle); // Gradzahlen weiter innen
      let yText = (radius - 30) * sin(angle) * tilt;
      textAlign(CENTER, CENTER);
      text(i, xText, yText);
    } else {
      // Kleine Markierungen (alle 20°)
      stroke(0);
      let xInnerSmall = (radius - 15) * cos(angle); // Kürzere Markierungen
      let yInnerSmall = (radius - 15) * sin(angle) * tilt;
      line(xInnerSmall, yInnerSmall, xInner, yInner);
    }
  }

  // Rote Nadel (als Dreieck)
  fill(255, 0, 0); // Rote Füllfarbe
  noStroke();
  let needleHeight = 40; // Höhe des Dreiecks
  let needleWidth = 20; // Breite des Dreiecks

  // Dreieckspunkte (nach oben zeigend)
  let x1 = 0; // Spitze des Dreiecks
  let y1 = -(radius * tilt + 35) + needleHeight; // Spitze leicht oberhalb des Windrosenradius
  let x2 = -needleWidth / 2; // Linker Eckpunkt
  let y2 = (radius * tilt - 100); // Basislinie unten
  let x3 = needleWidth / 2; // Rechter Eckpunkt
  let y3 = (radius * tilt - 100); // Basislinie unten

  // Zeichne das Dreieck
  triangle(x1, y1, x2, y2, x3, y3);

}

function drawInclinationIndicator() {
  push();
  translate(width / 2, height - 40); // Position unter der Windrose

  let indicatorWidth = 300; // Breite der Wasserlibelle
  let indicatorHeight = 10; // Höhe der Libelle (Linie)
  let maxInclination = 30; // Maximaler Neigungswert für volle Anzeige
  let positionX = map(rotationY, -maxInclination, maxInclination, -indicatorWidth / 2, indicatorWidth / 2);

  // Hintergrundlinie (Libelle)
  stroke(0);
  strokeWeight(2);
  line(-indicatorWidth / 2, 0, indicatorWidth / 2, 0); // Horizontale Linie

  // Farbe des Indikators basierend auf der Neigung
  let colorValue = map(abs(rotationY), 0, maxInclination, 0, 255); // Von Grün zu Rot
  let fillColor = color(colorValue, 255 - colorValue, 0); // Grün bis Rot
  fill(fillColor);

  // Beweglicher Punkt
  noStroke();
  ellipse(positionX, 0, 20, 20); // Punkt basierend auf Y-Achse

  // Y-Achsen-Wert anzeigen
  textAlign(CENTER, CENTER);
  fill(0);
  textSize(16);
  textStyle(BOLD);
  text(`heel: ${rotationY.toFixed(1)}°`, 0, 30); // Text unter der Linie
  pop();
}

function createPermissionButton() {
  let button = createButton("Sensorzugriff anfordern");
  button.style("font-size", "24px");
  button.center();
  button.mousePressed(() => {
    DeviceOrientationEvent.requestPermission()
      .then((response) => {
        if (response === 'granted') {
          permissionGranted = true;
          setupOrientationListener(); // Eventlistener hinzufügen
          button.remove(); // Button entfernen
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Sensorzugriff verweigert.");
      });
  });
}

function setupOrientationListener() {
  // Eventlistener für Bewegungssensor
  window.addEventListener("deviceorientation", (event) => {
    rotationY = event.beta || 0; // Neigung (Y-Achse)
  });
}
