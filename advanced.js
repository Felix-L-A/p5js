let latitude = 0;
let longitude = 0;
let speed = 0; // Geschwindigkeit in m/s
let heading = 0; // Kursrichtung in Grad (0 bis 360)
let statusText = "Starte...";

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
        statusText = "Los geht's!";
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

  // Prüfen, ob DeviceOrientation verfügbar ist
  if (window.DeviceOrientationEvent) {
    window.addEventListener("deviceorientation", (event) => {
      heading = event.alpha || 0; // Kursrichtung
    });
  } else {
    statusText = "Gyroskop wird nicht unterstützt.";
  }
}

function draw() {
  background(30);

  // 2D-Overlay für GPS und Geschwindigkeitsanzeige
  draw2DOverlay();

  // Isometrische Windrose
  drawIsometricWindrose();
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

  // Kurs in Grad anzeigen
  textSize(20);
  text(`Kurs: ${heading.toFixed(0)}°`, width - 150, 50);
}

function drawIsometricWindrose() {
  translate(width / 2, height / 2 + 50); // Mittelpunkt der Windrose
  let tilt = 0.5; // Neigungsfaktor für 3D-Effekt
  let radius = 150;

  // Windrose rotieren basierend auf dem Kurs
  rotate(-radians(heading));

  // Außenkreis der Windrose (als Ellipse für Neigung)
  stroke(255);
  noFill();
  ellipse(0, 0, radius * 2, radius * 2 * tilt);

  // Gradmarkierungen
  for (let i = 0; i < 360; i += 20) {
    fill(200, 100, 50); // Farbe der Gradzahlen (RGB)
    let distance = radius + 30; // Abstand der Gradzahlen zur Windrose
    let angle = radians(i);
    let x1 = radius * cos(angle);
    let y1 = radius * sin(angle) * tilt; // Neigung auf Y-Achse
    let x2 = (radius + 10) * cos(angle);
    let y2 = (radius + 10) * sin(angle) * tilt;

    // Linie zeichnen
    stroke(255);
    line(x1, y1, x2, y2);

    // Gradzahl an größeren Markierungen
    if (i % 40 === 0) {
      fill(255);
      noStroke();
      let xText = (radius + 20) * cos(angle);
      let yText = (radius + 20) * sin(angle) * tilt;
      textAlign(CENTER, CENTER);
      text(i, xText, yText);
    }
  }

  // Rote Nadel (zeigt immer in Fahrrichtung)
  stroke(255, 0, 0);
  strokeWeight(3);
  line(0, 0, 0, -radius * tilt); // Nadel nach oben
}
