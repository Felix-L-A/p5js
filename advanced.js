let latitude = 0;
let longitude = 0;
let speed = 0; // Geschwindigkeit in m/s
let statusText = "Starte...";
let heading = 0; // Kursrichtung in Grad (0 bis 360)

// Eventlistener für das Gyroskop
if (window.DeviceOrientationEvent) {
  window.addEventListener("deviceorientation", (event) => {
    heading = event.alpha || 0; // Kursrichtung
  });
} else {
  statusText = "Gyroskop wird nicht unterstützt.";
}

function setup() {
  createCanvas(600, 400, WEBGL); // WEBGL für 3D-Darstellung der Windrose
  textFont('Arial');
}

function draw() {
  background(30);

  // 2D-Ebene für Text
  draw2DOverlay();

  // 3D-Ebene für die geneigte Windrose
  drawTiltedWindrose();
}

function draw2DOverlay() {
  // Schalte auf 2D-Rendering um
  resetMatrix();
  noLights(); // Deaktiviere 3D-Licht, um Text besser darzustellen
  fill(255);
  textAlign(LEFT, CENTER);
  textSize(16);

  // Anzeige von Status, Position und Geschwindigkeit
  text(statusText, 20, 20);
  text(`Breitengrad: ${latitude.toFixed(5)}`, 20, 50);
  text(`Längengrad: ${longitude.toFixed(5)}`, 20, 80);
  let speedKmh = (speed * 3.6).toFixed(2);
  text(`Geschwindigkeit: ${speedKmh} km/h`, 20, 110);

  // Anzeige der aktuellen Gradzahl
  textSize(20);
  text(`Kurs: ${heading.toFixed(0)}°`, width - 200, 50);
}

function drawTiltedWindrose() {
  // 3D-Darstellung der Windrose
  push();
  translate(0, 50, -300); // Position der Windrose
  rotateX(radians(60)); // Neigung der Windrose für räumlichen Eindruck
  rotateZ(radians(-heading)); // Drehung der Windrose entsprechend der Kursrichtung

  // Außenkreis der Windrose
  stroke(255);
  noFill();
  ellipse(0, 0, 300, 300);

  // Gradmarkierungen
  for (let i = 0; i < 360; i += 20) {
    let angle = radians(i);
    let x1 = 140 * cos(angle);
    let y1 = 140 * sin(angle);
    let x2 = 150 * cos(angle);
    let y2 = 150 * sin(angle);

    // Linien
    stroke(255);
    line(x1, y1, x2, y2);

    // Gradzahl (nur bei größeren Markierungen)
    if (i % 40 === 0) {
      push();
      fill(255);
      noStroke();
      let xText = 170 * cos(angle);
      let yText = 170 * sin(angle);
      translate(xText, yText, 0); // Position der Gradzahlen
      rotateZ(-radians(-heading)); // Rotiere die Gradzahlen passend zur Richtung
      textSize(14);
      text(i, 0, 0);
      pop();
    }
  }

  // Rote Nadel (zeigt immer in Fahrrichtung)
  stroke(255, 0, 0);
  strokeWeight(3);
  line(0, 0, 0, -120); // Nadel zeigt nach oben (Fahrtrichtung)
  pop();
}

