"use strict";
var camera_posteriore=true;
var cambiaCamera=false;
var cameraIso=false;
var click_end=false;
let cameraTarget = [0, 0, 0]     //eye location of the camera dove guardiamo
let cameraPosition = [0, 0, 0]    // center where the camera is pointed ovvero D
let up = [0, 1, 0]  //se cambia up, ruota l'intero SDR, quindi cambiano gli assi
const zNear = 0.1   // faccia più piccola del frustum znear
const zFar = 200   // faccia più grande del frustum znear
const fieldOfViewRadians = degToRad(60);    //fov, aumentando questo, aumento l'ampiezza della visuale (tipo grandangolo)
const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
var D = 17
var cameraLiberabis = false;
var cameraLibera = false; // drag del mouse
var drag;
var bias = -0.00005;
var THETA= degToRad(86);
var PHI=degToRad(23);	
var x_light= 10, 
y_light= 200,
z_light= 250, 
x_targetlight= 0,	
y_targetlight= 0,	
z_targetlight= 0, 				
width_projLight= 3000,
height_projLight= 1500,
fovLight = 18,
lightIntensity= 2.5,
shadowIntensity=0.9;
var clock = 0;

var viewParamsChanged = false

//matrici 
var lightWorldMatrix;
var lightProjectionMatrix;
var projectionMatrix;
var cameraMatrix;

//valori posizione iniziale nemico
var x_enemu = xz[0];
var z_enemu = xz[1];

//funzioni per aggiornare la posizione della fonte di luce (una per asse)
function updateLightx(event, ui){
    x_light= ui.value;

}
function updateLighty(event, ui){
    y_light= ui.value;

}
function updateLightz(event, ui){
    z_light= ui.value;

}

//variabili di controllo
var doneSomething=false; 
var nstep=0; 
var timeNow=0;
//
const PHYS_SAMPLING_STEP=20; 

var meshProgramInfo = webglUtils.createProgramInfo(gl, [vertShader, fragShader]);

//skybox
var skyboxProgramInfo = webglUtils.createProgramInfo(gl, [skyVertShader, skyFragShader])

//sun
var sunProgramInfo = webglUtils.createProgramInfo(gl, [sunVertShader, sunFragShader])

//color
var colorProgramInfo = webglUtils.createProgramInfo(gl, [colorVertShader, colorFragShader])
    

setGeo(gl);

bikeInit();
createTextureLight();
//initLightPosition sliders
webglLessonsUI.setupSlider("#LightX", {value: 10, slide: updateLightx, min: 0, max: 450, step: 1});
webglLessonsUI.setupSlider("#LightY", {value: 200, slide: updateLighty, min: 100, max: 450, step: 1});
webglLessonsUI.setupSlider("#LightZ", {value: 250, slide: updateLightz, min: 100, max: 350, step: 1});

function update(time){
	if(nstep*PHYS_SAMPLING_STEP <= timeNow){ //skip the frame if the call is too early
		bikeMove(); 
		nstep++; 
		doneSomething=true;
		window.requestAnimationFrame(update);
		return; // return as there is nothing to do
	}
	timeNow=time;   
	if (doneSomething) {	
        render(time);   
		doneSomething=false;
	}
	window.requestAnimationFrame(update); // get next frame
}


function render(time) { 
    
    time*=0.001;
    gl.enable(gl.DEPTH_TEST);
    // first draw from the POV of the light
    lightWorldMatrix = m4.lookAt(
        [x_light, y_light, z_light],          			// position
        [x_targetlight, y_targetlight, z_targetlight], 	// target
        up,                                				// up
    );

    lightProjectionMatrix = m4.perspective(
        degToRad(fovLight),
        width_projLight / height_projLight,
        8,  	// near: top of the frustum
        700);   // far: bottom of the frustum

    gl.bindFramebuffer(gl.FRAMEBUFFER, depthFramebuffer);
    gl.viewport(0, 0, depthTextureSize, depthTextureSize);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


    drawScene(lightProjectionMatrix, lightWorldMatrix, m4.identity(), lightWorldMatrix, colorProgramInfo,time);

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    gl.clearColor(0, 0, 0, 1); //setta tutto a nero se 0,0,0,1
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


    let textureMatrix = m4.identity();
    textureMatrix = m4.translate(textureMatrix, 0.5, 0.5, 0.5);
    textureMatrix = m4.scale(textureMatrix, 0.5, 0.5, 0.5);
    textureMatrix = m4.multiply(textureMatrix, lightProjectionMatrix);
    textureMatrix = m4.multiply(textureMatrix, m4.inverse(lightWorldMatrix));
            

    var projection = m4.perspective(fieldOfViewRadians, aspect, 0.1, 1200);

    // Compute the camera's matrix using look at.
    var camera = m4.lookAt(cameraPosition, cameraTarget, up);

    // Make a view matrix from the camera matrix.
    var view = m4.inverse(camera);

    //Visuale da Dietro
    if (camera_posteriore){
        cameraPosition = [posX +(D*Math.sin(degToRad(facing))), posY+12, posZ+(D*Math.cos(degToRad(facing)))]            
    }
    //Visuale Libera
    if(cameraLiberabis){
        cameraPosition = [D*1.5*Math.sin(PHI)*Math.cos(THETA),D*1.5*Math.sin(PHI)*Math.sin(THETA),D*1.5*Math.cos(PHI)];
    }
    //Visuale da Davanti
    if(cambiaCamera && !cameraLiberabis){   
        cameraPosition = [posX+(-D*Math.sin(degToRad(facing))), posY+10, posZ+(-D*Math.cos(degToRad(facing)))];		
    }
    //Visuale fissa Isometrica
    if (cameraIso){
        cameraPosition=[-90,180,90];
    }
    
    if(!cameraIso){
        cameraTarget = [posX, posY, posZ]}
    else{
        cameraTarget = [0,0,0];
    }

    drawScene(projection,camera, textureMatrix, lightWorldMatrix, sunProgramInfo,time);
    drawSkybox(gl, skyboxProgramInfo, view, projection)
    drawMiscElements();
}
update();
window.requestAnimationFrame(update);




