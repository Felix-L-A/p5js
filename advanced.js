let latitude = 0;
let longitude = 0;
let speed = 0; // Geschwindigkeit in m/s
let heading = 0; // Kursrichtung in Grad (0 bis 360)
let statusText = "Starte...";
let permissionGranted = false; // Zugriff auf Sensoren

function setup() {
  createCanvas(600, 400); // 2D-Canvas
  textFont('sans-serif');
  textSize(16);

  // Prüfe, ob iOS eine Berechtigung erfordert
  if (typeof(DeviceOrientationEvent) !== 'undefined' && typeof(DeviceOrientationEvent.requestPermission) === 'function') {
    createPermissionButton(); // Button für iOS
  } else {
    // Android/Chrome oder andere Browser (keine Berechtigung erforderlich)
    permissionGranted = true;
    setupOrientationListener(); // Bewegungssensor aktivieren
  }

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
}

function drawCourseText() {
  push();
  translate(width / 2, height / 2 - 130); // Position über der Windrose
  fill(255); // Farbe des Textes (Weiß)
  textAlign(CENTER, CENTER);
  textSize(20); // Schriftgröße
  text(Kurs: ${heading.toFixed(0)}°, 0, 0); // Zentrierter Text
  pop();
}

function draw2DOverlay() {
  fill(255);
  textAlign(LEFT, CENTER);

  // Statusinformationen anzeigen
  text(statusText, 20, 20);
  text(Breitengrad: ${latitude.toFixed(5)}, 20, 50);
  text(Längengrad: ${longitude.toFixed(5)}, 20, 80);

  // Geschwindigkeit in km/h anzeigen
  let speedKmh = (speed * 3.6).toFixed(2);
  text(Geschwindigkeit: ${speedKmh} km/h, 20, 110);

    // Versionsnummer unten links anzeigen
  textSize(10); // Kleine Schriftgröße
  text("Version 1.0", 10, height - 10); // Position unten links
  
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

  // Rote Nadel (zeigt nach oben auf die oberste Gradzahl)
  fill(255, 0, 0);
  noStroke();
  let needleHeight = 40;
  let needleWidth = 20;
  let x1 = 0;
  let y1 = -(radius * tilt) + needleHeight;
  let x2 = -needleWidth / 2;
  let y2 = -(radius * tilt);
  let x3 = needleWidth / 2;
  let y3 = -(radius * tilt);
  triangle(x1, y1, x2, y2, x3, y3);
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
    heading = event.alpha || 0; // Kursrichtung
  });
}
