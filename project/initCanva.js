var canvas = document.getElementById("myCanvas");
var text = document.getElementById("text");
var gl = canvas.getContext("webgl");



const textCanvas = document.getElementById("text");
const ctx = textCanvas.getContext("2d");

//ext serve per la depth texture, se non supportato il render non avviene correttamente (NERO A SCHERMO!!!!)
var ext = gl.getExtension('WEBGL_depth_texture');
if (!ext) {
  alert("ERRORE! WEBGL_depth_texture non è supportato"); 
}
