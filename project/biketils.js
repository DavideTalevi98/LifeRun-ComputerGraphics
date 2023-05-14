//Raccoglie diverse funzioni come il caricamento di una texture da un'immqgine,
// la crezione di una texture da applicarea allo skybox,
// e tutto ciò che riguarda il caricamento di una mesh da un Obj

function degToRad(d) {
	return d * Math.PI / 180;
}

function radToDeg(r) {
	return r * 180 / Math.PI;
}

function isPowerOf2(value) {
    return (value & (value - 1)) == 0;		
}

var xy = [
[getRndInteger(-50, 50), getRndInteger(-50, 50)],
[getRndInteger(-50, 50), getRndInteger(-50, 50)],
[getRndInteger(-50, 50), getRndInteger(-50, 50)],
[getRndInteger(-50, 50), getRndInteger(-50, 50)],
];

function resetObstacles() {
obstacles = [bufferInfo_tractor, bufferInfo_tractor, bufferInfo_tractor, bufferInfo_tractor];
xy = [
  [getRndInteger(-50, 50), getRndInteger(-50, 50)],
  [getRndInteger(-50, 50), getRndInteger(-50, 50)],
  [getRndInteger(-50, 50), getRndInteger(-50, 50)],
  [getRndInteger(-50, 50), getRndInteger(-50, 50)],
];
}

function getRndInteger(min, max) {
return Math.floor(Math.random() * (max - min)) + min;
}

//funzione che utilizza un'unica immagine per caricare tutte le facce della cubemap	
function loadSkyboxTexture() {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);

    const faceInfos = [
        { target: gl.TEXTURE_CUBE_MAP_POSITIVE_X, url: 'resources/images/box5.jpg', },
        { target: gl.TEXTURE_CUBE_MAP_NEGATIVE_X, url: 'resources/images/box5.jpg', },
        { target: gl.TEXTURE_CUBE_MAP_POSITIVE_Y, url: 'resources/images/box5.jpg', },
        { target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, url: 'resources/images/box5.jpg', },
        { target: gl.TEXTURE_CUBE_MAP_POSITIVE_Z, url: 'resources/images/box5.jpg', },
        { target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, url: 'resources/images/box5.jpg', },
    ];

    const image = new Image();
    image.src = faceInfos[0].url;
    image.addEventListener('load', function () {
        // imposta ogni faccia in modo da renderla renderizzabile
        faceInfos.forEach((faceInfo) => {
            const { target } = faceInfo;
            const level = 0;
            const internalFormat = gl.RGBA;
            const width = 1024;
            const height = 1024;
            const format = gl.RGBA;
            const type = gl.UNSIGNED_BYTE;
            gl.texImage2D(target, level, internalFormat, width, height, 0, format, type, null);
            gl.texImage2D(target, level, internalFormat, format, type, image);
        });
        gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    });

    return texture;
}


//funzione che carica una texture 2D da un'immagine
function loadTextureFromImg(imageSrc) {
    // Crea una nuova texture
    var texture = gl.createTexture();

    // Assegna l'immagine alla texture
    var textureImage = new Image();
    textureImage.src = imageSrc;
    textureImage.addEventListener('load', function () {
        // Lega la texture corrente
        gl.bindTexture(gl.TEXTURE_2D, texture);
        // Carica l'immagine nella texture
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureImage);

        // Controlla se l'immagine ha dimensioni potenza di 2
        if (isPowerOf2(textureImage.width) && isPowerOf2(textureImage.height)) {
            // Genera i livelli di mipmap
            gl.generateMipmap(gl.TEXTURE_2D);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
        } else {
            // Disabilita i mipmap e imposta la ripetizione sui bordi
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);    // Impedisce la ripetizione della texture sull'asse S
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);    // Impedisce la ripetizione della texture sull'asse T
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        }
    });

    return texture;
}




var depthFramebuffer, depthTextureSize, depthTexture, unusedTexture;
//funzione per creare depth framebuffer
function createTextureLight() {
    // Crea una nuova texture per il profondo
    depthTexture = gl.createTexture();
    depthTextureSize = 1024;
    // Assegna la texture al contesto
    gl.bindTexture(gl.TEXTURE_2D, depthTexture);
    // Carica i dati nella texture
    gl.texImage2D(
        gl.TEXTURE_2D, // target
        0, // mip level
        gl.DEPTH_COMPONENT, // internal format
        depthTextureSize, // width
        depthTextureSize, // height
        0, // border
        gl.DEPTH_COMPONENT, // format
        gl.UNSIGNED_INT, // type
        null); // data
    // Imposta i filtri per la texture
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    // Crea un framebuffer per la texture
    depthFramebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, depthFramebuffer);
    // Assegna la texture al framebuffer
    gl.framebufferTexture2D(
        gl.FRAMEBUFFER, // target
        gl.DEPTH_ATTACHMENT, // attachment point
        gl.TEXTURE_2D, // texture target
        depthTexture, // texture
        0); // mip level

    // Crea una texture inutilizzata
    unusedTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, unusedTexture);
    gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        depthTextureSize,
        depthTextureSize,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        null,
    );
    // Imposta i filtri per la texture inutilizzata
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    // Assegna la texture inutilizzata al framebuffer
    gl.framebufferTexture2D(
        gl.FRAMEBUFFER, // target
        gl.COLOR_ATTACHMENT0, // attachment point
        gl.TEXTURE_2D, // texture target
        unusedTexture, // texture
        0); // mip level
}



// MESH.OBJ 

var webglVertexData = [
	    [],   // posizione
	    [],   // coordinate del testo
	    [],   // normali
];

function getObjToDraw(objsToDraw, name){

	  return objsToDraw.find(x => x.name === name);
}



function loadObj(url) {
	let xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {	
		if (xhttp.readyState == 4) {
			parseOBJ(xhttp.responseText);
	   }
	};
	xhttp.open("GET", url, false);
	xhttp.send(null);
}
//prende in input una stringa in formato OBJ e crea un array di vertex data utilizzabile in WebGL
function parseOBJ(text) {
	webglVertexData = [
	    [],   // positions
	    [],   // texcoords
	    [],   // normals
	];
	
	const objPositions = [[0, 0, 0]];
  	const objTexcoords = [[0, 0]];
  	const objNormals = [[0, 0, 0]];
 
	const objVertexData = [
	    objPositions,
	    objTexcoords,
	    objNormals,
	  ];

	  // same order as `f` indices

	  //f 1/2/3 -> 1 2 3
	function addVertex(vert) {
		const ptn = vert.split('/');
		ptn.forEach((objIndexStr, i) => {
		  if (!objIndexStr) {
		    return;
		  }
		  const objIndex = parseInt(objIndexStr);
		  const index = objIndex + (objIndex >= 0 ? 0 : objVertexData[i].length);
		  //webglVertexData pubblica
		  webglVertexData[i].push(...objVertexData[i][index]);
		});
	}

	const keywords = {
	    v(parts) {
	      objPositions.push(parts.map(parseFloat));
	    },
	    vn(parts) {
	      objNormals.push(parts.map(parseFloat));
	    },
	    vt(parts) {
	      // should check for missing v and extra w?
	      objTexcoords.push(parts.map(parseFloat));
	    },
	    f(parts) {
	      const numTriangles = parts.length - 2;
	      for (let tri = 0; tri < numTriangles; ++tri) {
	        addVertex(parts[0]);
	        addVertex(parts[tri + 1]);
	        addVertex(parts[tri + 2]);
	      }
	    },
	  };

	//	\w* = almeno una lettere o un numero
	// ?:x = meccia gli spazi singoli bianchi (anche più di uno)
	// . = classi di caratteri, meccia ogni singolo carattere tranne i terminatori di linea
	const keywordRE = /(\w*)(?: )*(.*)/;
	const lines = text.split('\n');
	//let identifica una variabile in un determinato blocco di codice
	for (let lineNo = 0; lineNo < lines.length; ++lineNo) {
	const line = lines[lineNo].trim();
	if (line === '' || line.startsWith('#')) {
		//la riga è vuota o è un commento
	  continue;
	}
	//ritorna la stringa 
	const m = keywordRE.exec(line);
	if (!m) {
	  continue;
	}
	const [, keyword, unparsedArgs] = m;
	const parts = line.split(/\s+/).slice(1);
	const handler = keywords[keyword];
	if (!handler) {
	  continue;
	}

	handler(parts, unparsedArgs); //gestisce gli argomenti che non hai gestito
	}

}