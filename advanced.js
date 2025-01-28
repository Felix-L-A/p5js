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
    let angle = radians(i);
  let x1 = (radius - 10) * cos(angle); // Startpunkt näher zur Mitte
  let y1 = (radius - 10) * sin(angle) * tilt; // Neigung auf Y-Achse
    let x2 = (radius + 5) * cos(angle);
    let y2 = (radius + 5) * sin(angle) * tilt;   
    


    // Linie zeichnen
    stroke(255);
    line(x1, y1, x2, y2);

    // Gradzahl an größeren Markierungen
    if (i % 40 === 0) {
      fill(255); // Farbe der Gradzahlen
      noStroke();
      textSize(14); // Schriftgröße der Gradzahlen
      let distance = radius + 30; // Abstand der Gradzahlen zur Windrose
      let xText = distance * cos(angle); // X-Position der Gradzahl
      let yText = distance * sin(angle) * tilt; // Y-Position der Gradzahl (mit Neigung)
      textAlign(CENTER, CENTER);
      text(i, xText, yText); // Zeichne die Gradzahl
    }
  }

/*  // Rote Nadel (zeigt immer in Fahrrichtung)
  stroke(255, 0, 0);
  strokeWeight(3);
  line(0, 0, 0, -radius * tilt); // Nadel nach oben
  */
  
  // Rote Nadel (als Dreieck)
fill(255, 0, 0); // Rote Füllfarbe
noStroke();
let needleHeight = 40; // Höhe des Dreiecks
let needleWidth = 20; // Breite des Dreiecks

// Dreieckspunkte (nach oben zeigend)
let x1 = 0; // Spitze des Dreiecks
let y1 = -(radius * tilt+35) + needleHeight; // Spitze leicht oberhalb des Windrosenradius
let x2 = -needleWidth / 2; // Linker Eckpunkt
let y2 = (radius * tilt-100); // Basislinie unten
let x3 = needleWidth / 2; // Rechter Eckpunkt
let y3 = (radius * tilt-100); // Basislinie unten

// Zeichne das Dreieck
triangle(x1, y1, x2, y2, x3, y3);
}
