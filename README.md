Um deine p5.js-Anwendung (oder jede beliebige statische Website) über GitHub Pages zu veröffentlichen, gehst du am besten folgendermaßen vor:
________________________________________
1. Repository erstellen oder verwenden
1.	GitHub-Account anlegen (hast du schon).
2.	Neues Repository anlegen (hast du schon).
o	Achte darauf, dass es ein öffentliches Repository ist (privat geht zwar inzwischen auch mit GitHub Pages, aber öffentlich ist einfacher zum Start).
o	Du kannst es z.B. my-p5-sketch nennen.
________________________________________
2. Projektdateien vorbereiten
Stelle sicher, dass in deinem lokalen Projekt mindestens diese Dateien liegen:
1.	index.html – Deine Haupt-HTML-Datei.
2.	sketch.js – Dein p5.js-Sketch.
3.	p5.js – Entweder als lokale Kopie oder über ein CDN eingebunden.
Beispiel:
bash
KopierenBearbeiten
/my-p5-sketch/
├── index.html
└── sketch.js
In der index.html könntest du z.B. Folgendes haben:
html
KopierenBearbeiten
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Mein p5.js-Sketch</title>
    <!-- p5.js vom CDN laden, das erspart dir eine lokale Kopie -->
    <script src="https://cdn.jsdelivr.net/npm/p5@1.6.0/lib/p5.min.js"></script>
    <!-- Dein Sketch -->
    <script src="sketch.js"></script>
  </head>
  <body>
  </body>
</html>
________________________________________
3. Dateien ins GitHub-Repository hochladen
a) Entweder über die GitHub-Weboberfläche
1.	Gehe in dein neu erstelltes Repository.
2.	Klicke auf „Add file“ → „Upload files“.
3.	Ziehe per Drag & Drop deine lokalen Projektdateien (index.html, sketch.js) ins Browser-Fenster.
4.	„Commit changes“ anklicken.
b) Oder über Git (lokal)
1.	Öffne ein Terminal (Git Bash, etc.).
2.	Klone dein Repository:
bash
KopierenBearbeiten
git clone https://github.com/DEIN_USERNAME/my-p5-sketch.git
3.	Kopiere bzw. erstelle deine Projektdateien in den neu geklonten Ordner.
4.	Führe aus:
bash
KopierenBearbeiten
git add .
git commit -m "Initial commit mit p5.js-Files"
git push origin main
________________________________________
4. GitHub Pages aktivieren
1.	Gehe in deinem Repository oben auf den Reiter Settings.
2.	Scrolle links in der Seitenleiste zu Pages (früher war das eine separate Kategorie, jetzt meist unter „Code and Automation“ → „Pages“).
3.	Wähle bei „Branch“ z.B. main (und root-Ordner, falls du keine anderen Unterordner hast).
4.	Klicke auf „Save“.
5.	Nach ein paar Sekunden oder Minuten zeigt GitHub dir einen Link wie:
csharp
KopierenBearbeiten
Your site is published at https://DEIN_USERNAME.github.io/my-p5-sketch/
Dieser Link ist deine öffentlich erreichbare Website.
________________________________________
5. Zugriff auf deine App
•	Rufe die generierte URL in deinem Browser auf, z.B.
https://DEIN_USERNAME.github.io/my-p5-sketch/
•	Wenn du später Änderungen machst (z.B. dein sketch.js anpasst), brauchst du nur:
1.	Lokal committen und pushen (oder per Web-Interface hochladen).
2.	Kurz warten (ein paar Sekunden bis wenige Minuten).
3.	Die Änderungen erscheinen automatisch auf deiner GitHub Pages-Seite.
________________________________________
6. Besonderheiten bei p5.js und Geolocation
•	Für Geolocation auf dem iPhone (und allgemein in mobilen Browsern) benötigst du HTTPS.
•	GitHub Pages liefert dein Projekt automatisch über HTTPS aus – perfekt für Geolocation-Anwendungen.
•	Wenn du deinen Sketch testest, wird bei Verwendung von navigator.geolocation möglicherweise ein Pop-up / Dialog erscheinen, der um Erlaubnis bittet, den Standort zu teilen.
________________________________________
Zusammenfassung der Schritte:
1.	Repository erstellen (öffentlich).
2.	Dateien (index.html, sketch.js, etc.) hochladen.
3.	GitHub Pages über „Settings“ → „Pages“ → Branch main → „Save“ aktivieren.
4.	Link abwarten, öffnen und deine App genießen.
5.	Bei Änderungen einfach committen & pushen – GitHub Pages aktualisiert die Seite automatisch.
Damit hast du dein p5.js-Projekt (oder jede andere statische Web-Anwendung) schnell und kostenlos online auf GitHub Pages. Viel Spaß beim Veröffentlichen deines Sketches!
