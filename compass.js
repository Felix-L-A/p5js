// GENERAL PURPOSE FUNCTIONS TO MANAGE MOBILE SENSOR PERMISSIONS
// 1. Call setupMobile() in main setup() function
// 2. Put the following line at the start of main draw() function:
//    if (noMobileSensorInput()) return;
// then put whatever you like after this line
// with access to gyro and accelerometer values
// Check the Events section for details:
// https://p5js.org/reference/

let button;
let permissionGranted = false;

function setupMobile() {
  if (
    typeof DeviceOrientationEvent !== "undefined" &&
    typeof DeviceOrientationEvent.requestPermission === "function"
  ) {
    DeviceOrientationEvent.requestPermission()
      .catch(() => {
        button = createButton("ALLOW ACCESS TO SENSORS!");
        button.style("font-size", "16px");
        button.center();
        button.mousePressed(requestAccess);
        throw error;
      })
      .then(() => {
        permissionGranted = true;
      });
  } else {
    textSize(24);
    text("NON/PRE IOS 13 DEVICE!", 0, 0, width, height);
    permissionGranted = true;
  }
}

function requestAccess() {
  DeviceOrientationEvent.requestPermission()
    .then((response) => {
      if (response == "granted") {
        permissionGranted = true;
      } else {
        permissionGranted = false;
      }
    })
    .catch(console.error);
  this.remove();
}

function noMobileSensorInput() {
  let v = false;
  if (!permissionGranted) v = true;
  return v;
}
