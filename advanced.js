let latitude = 0;
let longitude = 0;
let speed = 0; // Geschwindigkeit in m/s
let heading = 0; // Bewegungsrichtung basierend auf GPS
let rotationY = 0; // Neigung (Y-Achse)
let statusText = "Starte...";
let permissionGranted = false; // Zugriff auf Sensoren

function setup() {
  createCanvas(600, 400); // 2D-Canvas
  textFont('sans-serif');
  textSize(16);

  // Prüfen, ob Geolocation verfügbar ist
  if ("geolocation" in navigator) {
    statusText = "GPS wird angefragt...";
    navigator.geolocation.watchPosition(
      (position) => {
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
        speed = position.coords.speed || 0; // Geschwindigkeit in m/s
        if (position.coords.heading !== null) {
          heading = position.coords.heading; // Bewegungsrichtung in Grad
        }
        statusText = "GPS-Daten empfangen!";
      },
      (error) => {
        console.error(error);
        statusText = "Fehler beim Empfangen der GPS-Daten.";
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000,
      }
    );
  } else {
    statusText = "Geolocation wird nicht unterstützt.";
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
  background(30);

  // Wenn keine Berechtigung für Sensoren erteilt wurde
  if (!permissionGranted) {
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(20);
    text("Bitte Sensorzugriff erlauben", width / 2, height / 2);
    return;
  }

  // Kursanzeige über der Windrose
  drawCourseText();

  // 2D-Overlay für GPS und Geschwindigkeit
  draw2DOverlay();

  // Isometrische Windrose
  drawIsometricWindrose();

  // Neigungsanzeiger (Wasserlibelle)
  drawInclinationIndicator();
}

function drawCourseText() {
  push();
  translate(width / 2, height / 2 - 130); // Position über der Windrose
  fill(255); // Farbe des Textes (Weiß)
  textAlign(CENTER, CENTER);
  textSize(20); // Schriftgröße
  text(`Kurs: ${heading.toFixed(0)}°`, 0, 0); // Zentrierter Text
  pop();
}

function draw2DOverlay() {
  fill(255);
  textAlign(LEFT, CENTER);

  // Statusinformationen anzeigen
  text(statusText, 20, 20);
  text(`Breitengrad: ${latitude.toFixed(5)}`, 20, 50);
  text(`Längengrad: ${longitude.toFixed(5)}`, 20, 80);

  // Geschwindigkeit in km/h anzeigen
  let speedKmh = (speed * 3.6).toFixed(2);
  text(`Geschwindigkeit: ${speedKmh} km/h`, 20, 110);

  // Versionsnummer unten links anzeigen
  textSize(10); // Kleine Schriftgröße
  text("Version 1.5", 10, height - 10); // Position unten links
}

function drawIsometricWindrose() {
  translate(width / 2, height / 2 + 50); // Mittelpunkt der Windrose
  let tilt = 0.5; // Neigungsfaktor für 3D-Effekt
  let radius = 150;

  // Statische Windrose (Ellipse bleibt fest)
  stroke(255);
  noFill();
  ellipse(0, 0, radius * 2, radius * 2 * tilt);

  // Rotierende Gradmarkierungen und Gradzahlen entlang der Ellipse
  for (let i = 0; i < 360; i += 20) {
    let adjustedAngle = (i - heading + 360) % 360; // Gradmarkierungen basierend auf Kurs
    let angle = radians(adjustedAngle);

    // Positionen entlang der Ellipse
    let xInner = (radius - 20) * cos(angle);
    let yInner = (radius - 20) * sin(angle) * tilt;
    let xOuter = radius * cos(angle);
    let yOuter = radius * sin(angle) * tilt;

    // Gradmarkierungen zeichnen
    if (i % 40 === 0) {
      // Große Markierungen (alle 40°)
      stroke(255);
      line(xInner, yInner, xOuter, yOuter);

      // Gradzahlen anzeigen
      fill(255);
      noStroke();
      textSize(14);
      let xText = (radius - 30) * cos(angle); // Gradzahlen weiter innen
      let yText = (radius - 30) * sin(angle) * tilt;
      textAlign(CENTER, CENTER);
      text(i, xText, yText);
    } else {
      // Kleine Markierungen (alle 20°)
      stroke(255);
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
  translate(width / 2, height - 80); // Position unter der Windrose

  let indicatorWidth = 300; // Breite der Wasserlibelle
  let indicatorHeight = 10; // Höhe der Libelle (Linie)
  let maxInclination = 30; // Maximaler Neigungswert für volle Anzeige
  let positionX = map(rotationY, -maxInclination, maxInclination, -indicatorWidth / 2, indicatorWidth / 2);

  // Hintergrundlinie (Libelle)
  stroke(255);
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
  fill(255);
  textSize(16);
  text(`Neigung (Y): ${rotationY.toFixed(1)}°`, 0, 30); // Text unter der Linie
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
