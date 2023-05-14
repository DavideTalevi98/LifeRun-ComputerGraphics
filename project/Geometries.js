//Buffers degli Obj
let bufferInfo_tractor
let bufferInfo_floor
let bufferInfo_bike
let bufferInfo_skybox
let bufferInfo_brochure
let bufferInfo_sign
let bufferInfo_police
//Buffers delle texture
let texture_tractor
let texture_bike
let texture_skybox
let texture_sign
let texture_floor
let texture_brochure
let texture_police

function setGeo(gl) {
    loadTractor()
    loadBrochure()
    loadSign()
    loadPolice()
    loadBike()
    loadFloor()
    loadSkyBox()  
}

function loadFloor()
{
		const S =70; 		
		const H = 0; 
		const textureCoords = [ 0,0, 1,0, 0,1, 1,1,];

		const arrays_floor = {
		   position: 	{ numComponents: 3, data: [-S,H,-S, S,H,-S, -S,H,S,  S,H,S, ], },
		   texcoord: 	{ numComponents: 2, data: textureCoords, },
		   //color: 	{ numComponents: 3, data: [0.7,0.7,0.7,  0.7,0.7,0.7,  0.7,0.7,0.7,  0.7,0.7,0.7], },
		   indices: 	{ numComponents: 3, data: [0,2,1, 	2,3,1,], },
		   normal:		{numComponents: 3, data: [0,1,0,	0,1,0,	0,1,0,	0,1,0,], },
		};

		bufferInfo_floor = webglUtils.createBufferInfoFromArrays(gl, arrays_floor);
        texture_floor = loadTextureFromImg("resources/images/plane.jpg")
	
}


function loadBrochure() {
    loadObj("resources/obj/brochure2.obj")
    const brochure_array = {
        position: {numComponents: 3, data:webglVertexData[0],},
        texcoord: {numComponents: 2, data:webglVertexData[1],},
        normal: {numComponents: 3, data:webglVertexData[2],},
    }
    bufferInfo_brochure = webglUtils.createBufferInfoFromArrays(gl, brochure_array)
    texture_brochure = loadTextureFromImg("resources/images/brochure.png")
}

function loadSign(){
    loadObj("resources/obj/sign.obj")
    const sign_array = {
        position: {numComponents: 3, data:webglVertexData[0],},
        texcoord: {numComponents: 2, data:webglVertexData[1],},
        normal: {numComponents: 3, data:webglVertexData[2],},
    }
    bufferInfo_sign = webglUtils.createBufferInfoFromArrays(gl, sign_array)
    texture_sign = loadTextureFromImg("resources/images/ME.jpg")
}

function loadPolice(){
    loadObj("resources/obj/police2.obj")
    const police_array = {
        position: {numComponents: 3, data:webglVertexData[0],},
        texcoord: {numComponents: 2, data:webglVertexData[1],},
        normal: {numComponents: 3, data:webglVertexData[2],},
    }
    bufferInfo_police = webglUtils.createBufferInfoFromArrays(gl, police_array)
    texture_police = loadTextureFromImg("resources/images/police.jpg")
}


function loadTractor() {
    loadObj("resources/obj/Tractor.obj")
    const tractor_array = {
        position: {numComponents: 3, data: webglVertexData[0],},
        texcoord: {numComponents: 2, data: webglVertexData[1],},
        normal: {numComponents: 3, data: webglVertexData[2],},
    }

    bufferInfo_tractor = webglUtils.createBufferInfoFromArrays(gl, tractor_array)
    texture_tractor = loadTextureFromImg("resources/images/CIPRESSI.jpeg")
    
}

function loadBike() {
    loadObj("resources/obj/bike2.obj")
    const bike_infos = {
        position: {numComponents: 3, data: webglVertexData[0],},
        texcoord: {numComponents: 2, data: webglVertexData[1],},
        normal: {numComponents: 3, data: webglVertexData[2],},
    }
    bufferInfo_bike = webglUtils.createBufferInfoFromArrays(gl, bike_infos)
    texture_bike = loadTextureFromImg("resources/images/bike.jpeg")
}


function loadSkyBox(){
    texture_skybox = loadSkyboxTexture()
    bufferInfo_skybox = webglUtils.createBufferInfoFromArrays(gl, {
       position: {
           data: new Float32Array([
               -1, -1, // bottom-left triangle
                1, -1,
               -1,  1,
               -1,  1, // top-right triangle
                1, -1,
                1,  1,
           ]),
           numComponents: 2,
       },
   });
}





