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
