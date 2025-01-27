let latitude = 0;
let longitude = 0;
let speed = 0;      // Geschwindigkeit in m/s (kommt über die Geolocation-API)
let statusText = "Starte...";

function setup() {
  createCanvas(600, 400);
  textAlign(CENTER, CENTER);
  textSize(20);
  
  // Prüfen, ob Geolocation verfügbar ist
  if ("geolocation" in navigator) {
    statusText = "GPS wird angefragt...";

    // watchPosition liefert fortlaufend Positionsupdates
    navigator.geolocation.watchPosition(
      position => {
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
        speed = position.coords.speed; // Meter pro Sekunde
        if (speed === null) {
          speed = 0; // Kann "null" zurückgeben, wenn nicht verfügbar
        }
        statusText = "GPS-Daten empfangen!";
      },
      error => {
        console.error(error);
        statusText = "Fehler beim Empfangen der GPS-Daten.";
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000
      }
    );
  } else {
    statusText = "Geolocation wird nicht unterstützt.";
  }
}

function draw() {
  background(420);
  fill(0);
  
  // Zeige Status und (falls verfügbar) Latitude, Longitude, Speed an
  text(statusText, width / 2, 40);
  
  text(`Breitengrad: ${latitude.toFixed(5)}`, width / 2, 80);
  text(`Längengrad: ${longitude.toFixed(5)}`, width / 2, 110);
  
  // Geschwindigkeit kommt von der API in m/s, ggf. in km/h umrechnen ( * 3.6 )
  let speedKmh = (speed * 3.6).toFixed(2);
  text(`Geschwindigkeit: ${speedKmh} km/h`, width / 2, 140);
}
