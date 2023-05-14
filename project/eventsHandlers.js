window.addEventListener("keydown", doKeyDown, true);
window.addEventListener("keyup", doKeyUp, true);
window.addEventListener("touchstart", doTouchDown, true);
window.addEventListener("touchend", doTouchUp, true);

if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
  text.addEventListener("mousedown", mouseDown);
  text.addEventListener("mouseup", mouseUp);
  text.addEventListener("mousemove", mouseMove);
  text.addEventListener("mouseout", mouseUp);
  window.addEventListener("wheel", zoom, { passive: false });
}

var pointerX = -1;
var pointerY = -1;
document.onmousemove = function (event) {
  pointerX = event.pageX;
  pointerY = event.pageY;
};
setInterval(pointerCheck, 1000);
function pointerCheck() {
}

function zoom(event) {
  event.preventDefault();
  D += event.deltaY * +0.01;
}

function mouseDown(e) {
  drag = true;
  cameraLiberabis = true;
  (old_x = e.pageX), (old_y = e.pageY);
  e.preventDefault();
  return false;
}

function mouseUp(e) {
  drag = false;
}

function mouseMove(e) {
  if (!drag) return false;

  dX = (-(e.pageX - old_x) * 2 * Math.PI) / canvas.width;
  dY = (-(e.pageY - old_y) * 2 * Math.PI) / canvas.height;
  THETA += dX;
  PHI += dY;
  if (PHI < 0.22) {
    PHI = 0.22;
  }
  if (THETA > 3.05) {
    THETA = 3.05;
  }
  if (PHI > 3.05) {
    PHI = 3.05;
  }
  (old_x = e.pageX), (old_y = e.pageY);
  e.preventDefault();
}

//Gestore dell'interazione utente
function doKeyDown(e) {
  switch (e.key) {
    case "w":
      key[0] = true;
      break;
    case "a":
      key[1] = true;
      break;
    case "s":
      key[2] = true;
      break;
    case "d":
      key[3] = true;
      break;
    case "ArrowUp":
      cameraPosition[1] += 0.14;
      camera_posteriore=false;
      cambiaCamera=false;
      cameraLiberabis = false;
      break;
    case "ArrowDown":
      camera_posteriore=false;
      cameraPosition[1] -= 0.14;
      cambiaCamera=false;
      cameraLiberabis = false;
      break;
    case "ArrowLeft":
      camera_posteriore=false;
      cameraPosition[0] -= 0.14;
      cambiaCamera=false;
      cameraLiberabis = false;
      break;
    case "ArrowRight":
      camera_posteriore=false;
      cameraPosition[0] += 0.14;
      cambiaCamera=false;
      cameraLiberabis = false;
      break;
    default:
      return;
  }
}
function doKeyUp(e) {
  switch (e.key) {
    case "w":
      key[0] = false;
      break;
    case "a":
      key[1] = false;
      break;
    case "s":
      key[2] = false;
      break;
    case "d":
      key[3] = false;
      break;
    case "ArrowUp":
      break;
    case "ArrowDown":
      break;
    case "ArrowLeft":
      break;
    case "ArrowRight":
      break;
    default:
      return;
  }
}
//mobile interaction
function doTouchDown(e) {
  touch = e.touches[0];
  x = touch.pageX - canvas.offsetLeft;
  y = touch.pageY - canvas.offsetTop;

  // W virtuale
  if (x >= 190 && y >= 351 && x <= 250 && y <= 417) {
    key[0] = true;
  }
  // S virtuale
  if (x >= 190 && y >= 439 && x <= 251 && y <= 500) {
    key[2] = true;
  }
  // A virtuale
  if (x >= 106 && y >= 438 && x <= 167 && y <= 503) {
    key[1] = true;
  }
  // D virtuale
  if (x >= 274 && y >= 440 && x <= 335 && y <= 504) {
    key[3] = true;
  }

  // UP
  if (x >= 640 && y >= 351 && x <= 700 && y <= 417) {
    cameraPosition[1] += 1;
    camera_posteriore=false;
    cambiaCamera=false;
    cameraLiberabis = false;
  }
  // DOWN
  if (x >= 640 && y >= 439 && x <= 700 && y <= 500) {
    cameraPosition[1] -= 1;
    camera_posteriore=false;
    cambiaCamera=false;
    cameraLiberabis = false;
  }
  // LEFT
  if (x >= 556 && y >= 438 && x <= 617 && y <= 503) {
    cameraPosition[0] -= 1;
    camera_posteriore=false;
    cambiaCamera=false;
    cameraLiberabis = false;
  }
  // RIGHT
  if (x >= 724 && y >= 440 && x <= 785 && y <= 504) {
    cameraPosition[0] += 1;
    camera_posteriore=false;
    cambiaCamera=false;
    cameraLiberabis = false;
  }
}
function doTouchUp(e) {
  x = touch.pageX - canvas.offsetLeft;
  y = touch.pageY - canvas.offsetTop;
  // THE W KEY
  if (x >= 190 && y >= 351 && x <= 250 && y <= 417) key[0] = false;
  // THE S KEY
  if (x >= 190 && y >= 439 && x <= 251 && y <= 500) key[2] = false;
  // THE A KEY
  if (x >= 106 && y >= 438 && x <= 167 && y <= 503) key[1] = false;
  // THE D KEY
  if (x >= 274 && y >= 440 && x <= 335 && y <= 504) key[3] = false;
}

window.addEventListener("click", checkButtonClick);

function checkButtonClick(e) {
  x = e.pageX - canvas.offsetLeft;
  y = e.pageY - canvas.offsetTop;
  //retry button
  if (x >= 490 && x <= 650 && y >= 178 && y <= 236 && (morte == true || vittoria ==true)) {
    bikeInit();
    refreshBrochure();
    resetObstacles();
    x_enemu=genValue();
    z_enemu=genValue();
    morte = false;
    vittoria = false;
    cambiaCamera = false;
    cameraLiberabis = false;
    cameraIso = false;
    brochure1 = false;
    brochure2 = false;
    brochure3 = false;
    webglLessonsUI.setupSlider("#LightX", {value: 270, slide: updateLightx, min: 0,max: 450, step: 1,});
    webglLessonsUI.setupSlider("#LightY", {value: 200,slide: updateLighty,min: 100, max: 450,step: 1,});
    webglLessonsUI.setupSlider("#LightZ", {value: 250,slide: updateLightz,min: 100,max: 350, step: 1,});
    x_light = 10;
    y_light = 200;
    z_light = 250;
    cambiaCamera=false;
    cameraLiberabis = false;
    cameraIso=false; 
    cameraLibera=false;
    camera_posteriore=true;
  }
}
