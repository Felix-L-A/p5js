let latitude = 0;
let longitude = 0;
let speed = 0; // Geschwindigkeit in m/s
let headingGPS = 0; // Bewegungsrichtung basierend auf GPS
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

  // Kurs-Skala
  drawHeadingScale();

  // Versionsnummer anzeigen
  fill(0);
  textSize(10);
  text("version 1.2", 20, height - 20); // Position unten links
}

function drawCourseText() {
  push();
  translate(width / 2, height / 2 - 60); // Position über der Windrose
  fill(0); // Farbe des Textes (Schwarz)
  textAlign(CENTER, TOP);
  textSize(30); // Schriftgröße
  text(`COG: ${headingGPS.toFixed(0)}°           SOG: ${(speed * 3.6).toFixed(2)} km/h`, 0, -90);
  translate(0,100); 
  text(`heading: ${headingGyro.toFixed(0)}°`, 0, -100); // Zentrierter Text
  pop();
}

function draw2DOverlay() {
  fill(0);
  textAlign(LEFT, CENTER);

  // Statusinformationen anzeigen
  text(statusText, 20, 20);
  text(`lon: ${latitude.toFixed(5)}`, 20, 50);
  text(`lat: ${longitude.toFixed(5)}`, 20, 80);
}


function drawHeadingScale() {
  push();
  translate(width / 2, height / 2 + 50); // Mitte des Displays für die Skala

  let scaleWidth = width * 0.8; // Skala über 80% der Bildschirmbreite
  let scaleHeight = 40; // Höhe der Skala
  let fieldOfView = 50; // ±50° um den aktuellen Kurs
  let tickSpacing = scaleWidth / (fieldOfView * 2 / 10); // Abstand der Ticks (alle 10°)
  
  // Hintergrund der Skala
  fill(240);
  rect(-scaleWidth / 2, -40, scaleWidth, scaleHeight+40);

  // Start- und Endwinkel für die Skala (120° Sichtfeld)
  let startAngle = headingGyro - fieldOfView;
  let endAngle = headingGyro + fieldOfView;

  // Skala zeichnen
  for (let i = startAngle; i <= endAngle; i += 10) {
    let adjustedAngle = (i + 360) % 360; // Sicherstellen, dass der Winkel 0-360° bleibt
    let xPos = map(i, startAngle, endAngle, -scaleWidth / 2, scaleWidth / 2); // Position der Markierung
    
    let fontSize = map(abs(i - headingGyro), 0, fieldOfView, 40, 12); // Schriftgröße abhängig vom Abstand
    let lineThickness = map(abs(i - headingGyro), 0, fieldOfView, 5, 1); // Linienbreite abhängig von Abstand


    // Tick-Marke zeichnen
    stroke(0);
    strokeWeight(lineThickness); // **Linienstärke abhängig von Abstand**
      
    stroke(0);
    line(xPos, -scaleHeight / 4 +35, xPos, scaleHeight / 4 +30); // Tick-Marke
    
    stroke(0);
    line(xPos, -scaleHeight / 4 -15, xPos, scaleHeight / 4 -50); // Tick-Marke

   
    // Zahl anzeigen**
      fill(0);
      noStroke();
      textSize(fontSize);
      textAlign(CENTER, CENTER);
      text(adjustedAngle.toFixed(0), xPos, scaleHeight / 2 - 20); // Zahlen unterhalb der Skala
      
  }

 // **Rote Kurs-Nadel bleibt statisch in der Mitte**
  fill(255, 0, 0);
  noStroke();
  let needleHeight = 10; // Höhe des Dreiecks
  let needleWidth = 40; // Breite des Dreiecks
  
  // **Untere Nadel (zeigt nach unten)** (obere ecke: X,Y, )
  triangle(0, scaleHeight / 2 +10,
           -needleWidth / 2, scaleHeight / 2 + 40, 
           needleWidth / 2, scaleHeight / 2 + 40);

  // **Obere Nadel (gespiegelt nach oben)**
  triangle(0, -scaleHeight / 2 - 10, -needleWidth / 2, -scaleHeight / 2 -40, 
           needleWidth / 2, -scaleHeight / 2 -40);

   pop();
}

function drawInclinationIndicator() {
  push();
  translate(width / 2 -10, height - 40); // Position unter der Windrose
  let indicatorWidth = 300;
  let positionX = map(rotationY, -30, 30, -indicatorWidth / 2, indicatorWidth / 2);
  stroke(0);
  line(-indicatorWidth / 2, 0, indicatorWidth / 2, 0);
  fill(map(abs(rotationY), 0, 30, 0, 255), 255 - map(abs(rotationY), 0, 30, 0, 255), 0);
  ellipse(positionX, 0, 20, 20);
  fill(0);
  textSize(20);
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

