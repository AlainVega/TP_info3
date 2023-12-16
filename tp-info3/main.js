// Desarrolladores:
// * Alain Vega
// * Mathias Martinez

import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';

let fov = 100
let aspect = window.innerWidth / window.innerHeight
let near = 0.1
let far = 1000

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight, false ); 
renderer.setClearColor( 0x989898, 1); // color del fondo
document.body.appendChild( renderer.domElement ); // agregar render al DOM

///////////////////////////////////////////////////////////////////////////////////////////////
// Ejes de coordenadas X = Rojo, Y = Verde, Z = Azul
///////////////////////////////////////////////////////////////////////////////////////////////
const largoLinea = 50

// Eje X
let ejeMaterial = new THREE.LineBasicMaterial( { color: 0xff0000 } );
let points = [];
points.push( new THREE.Vector3( 0, 0, 0 ) );
points.push( new THREE.Vector3( largoLinea, 0, 0 ) );
let ejeGeometria = new THREE.BufferGeometry().setFromPoints( points );
let eje = new THREE.Line( ejeGeometria, ejeMaterial );
scene.add( eje );

// Eje Y
ejeMaterial = new THREE.LineBasicMaterial( { color: 0x00ff00 } );
points = [];
points.push( new THREE.Vector3( 0, 0, 0 ) );
points.push( new THREE.Vector3( 0, largoLinea, 0 ) );
ejeGeometria = new THREE.BufferGeometry().setFromPoints( points );
eje = new THREE.Line( ejeGeometria, ejeMaterial );
scene.add( eje );

// Eje Z
ejeMaterial = new THREE.LineBasicMaterial( { color: 0x0000ff } );
points = [];
points.push( new THREE.Vector3( 0, 0, 0 ) );
points.push( new THREE.Vector3( 0, 0, largoLinea ) );
ejeGeometria = new THREE.BufferGeometry().setFromPoints( points );
eje = new THREE.Line( ejeGeometria, ejeMaterial );
scene.add( eje );
///////////////////////////////////////////////////////////////////////////////////////////////
// Base carretera (el piso que sostiene las carreteras)
///////////////////////////////////////////////////////////////////////////////////////////////
let largoBaseCarretera = 90 // largo es en X
let anchoBaseCarretera = 1 // ancho es en Y
let profundoBaseCarretera = 10 // profundo es en Z

const baseCarreteraGeometria = new THREE.BoxGeometry( largoBaseCarretera, anchoBaseCarretera, profundoBaseCarretera );
const baseCarreteraMaterial = new THREE.MeshDepthMaterial( { color: 0x444444 } ); //MeshBasicMaterial
const baseCarretera = new THREE.Mesh( baseCarreteraGeometria, baseCarreteraMaterial );

scene.add( baseCarretera );

///////////////////////////////////////////////////////////////////////////////////////////////
// Pilares (las torres desde donde salen los cables tensores)
///////////////////////////////////////////////////////////////////////////////////////////////
// Pilar 1
let largoPilar = 1
let anchoPilar = 10
let profundoPilar = 1

let pilarGeometria = new THREE.BoxGeometry( largoPilar, anchoPilar, profundoPilar ) 
let pilarMaterial = new THREE.MeshBasicMaterial( { color: 0x848484 } );
let pilar = new THREE.Mesh(pilarGeometria, pilarMaterial)

pilar.translateY(anchoPilar/2)
// pilar.rotation.x = Math.PI/2
pilar.translateX(10)

scene.add( pilar );

// Pilar 2
let pilar2 = new THREE.Mesh(pilarGeometria, pilarMaterial)

pilar2.translateY(anchoPilar/2)
pilar2.translateX(-10)

scene.add( pilar2 );

///////////////////////////////////////////////////////////////////////////////////////////////
// Base del pilar (la "piramide" de donde se levanta el pilar)
///////////////////////////////////////////////////////////////////////////////////////////////
let rectanguloGeometria = new THREE.BoxGeometry( 10, 1, 10 ) 
let rectanguloMaterial = new THREE.MeshBasicMaterial( { color: 0x848484 } );
const rectanguloMesh = new THREE.Mesh(rectanguloGeometria, rectanguloMaterial)

const basePilar = new THREE.Object3D()

basePilar.translateY(-10)

basePilar.add(rectanguloMesh)

rectanguloGeometria = new THREE.BoxGeometry( 7.5, 1, 7.5 ) 
rectanguloMaterial = new THREE.MeshBasicMaterial( { color: 0x444444 } );
const rectanguloMesh2 = new THREE.Mesh(rectanguloGeometria, rectanguloMaterial)

rectanguloMesh2.translateY(1)

basePilar.add(rectanguloMesh2)

rectanguloGeometria = new THREE.BoxGeometry( 5, 1, 5 ) 
rectanguloMaterial = new THREE.MeshBasicMaterial( { color: 0x848484 } );
const rectanguloMesh3 = new THREE.Mesh(rectanguloGeometria, rectanguloMaterial)

rectanguloMesh3.translateY(2)

basePilar.add(rectanguloMesh3)

// Columnas (las 2 columnas que estan encima de la base y soportan la carretera)
let largoColumna = 1
let anchoColumna = 7
let profundoColumna = 1

let columnaGeometria = new THREE.BoxGeometry( largoColumna, anchoColumna, profundoColumna ) 
let columnaMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff } );
let meshColumna = new THREE.Mesh(columnaGeometria, columnaMaterial)

meshColumna.translateY(2 + anchoColumna/2) //donde tercer rectangulo altura + la mitad de la columna
meshColumna.translateX(-1)

basePilar.add(meshColumna)

let meshColumna2 = new THREE.Mesh(columnaGeometria, columnaMaterial)

meshColumna2.translateY(2 + anchoColumna/2) //donde tercer rectangulo altura + la mitad de la columna
meshColumna2.translateX(1)

basePilar.add(meshColumna2)

basePilar.translateX(10)

const basePilar2 = basePilar.clone()
basePilar2.translateX(-20)

scene.add(basePilar)
scene.add(basePilar2)

///////////////////////////////////////////////////////////////////////////////////////////////
// Soportes (los)
///////////////////////////////////////////////////////////////////////////////////////////////
// Base del soporte
let largoBaseSoporte = 2
let anchoBaseSoporte = 1
let profundoBaseSoporte = 2

let baseSoporteGeometria = new THREE.BoxGeometry( largoBaseSoporte, anchoBaseSoporte, profundoBaseSoporte ) 
let baseSoporteMaterial = new THREE.MeshBasicMaterial( { color: 0x444444 });
let baseSoporteMesh = new THREE.Mesh(baseSoporteGeometria, baseSoporteMaterial)

// baseSoporteMesh.translateY(-5)

const soporte = new THREE.Object3D()

soporte.translateY(-5)

soporte.add(baseSoporteMesh)

// Pilar/columna del soporte
let largoPilarSoporte = 1
let anchoPilarSoporte = 4
let profundoPilarSoporte = 1

let pilarSoporteGeometria = new THREE.BoxGeometry( largoPilarSoporte, anchoPilarSoporte, profundoPilarSoporte ) 
let pilarSoporteMaterial = new THREE.MeshBasicMaterial( { color: 0x848484 } );
let pilarSoporteMesh = new THREE.Mesh(pilarSoporteGeometria, pilarSoporteMaterial)

pilarSoporteMesh.translateY(anchoBaseSoporte/2 + anchoPilarSoporte/2)

soporte.add(pilarSoporteMesh)

soporte.translateZ(1.5)

// scene.add(soporte)

const soporte2 = soporte.clone()

soporte2.translateZ(3)

// scene.add(soporte2)

const soporte3 = soporte.clone()

soporte3.translateZ(-3)

// scene.add(soporte3)

const soporte4 = soporte.clone()

soporte4.translateZ(-6)

// scene.add(soporte4)

const filaSoporte = new THREE.Object3D()
filaSoporte.add(soporte)
filaSoporte.add(soporte2)
filaSoporte.add(soporte3)
filaSoporte.add(soporte4)

filaSoporte.translateX(25)

// scene.add(filaSoporte)

const filaSoporte2 = filaSoporte.clone()

filaSoporte2.translateX(5)

// scene.add(filaSoporte2)

const filaSoporte3 = filaSoporte.clone()

filaSoporte3.translateX(10)

// scene.add(filaSoporte3)

const filaSoporte4 = filaSoporte.clone()

filaSoporte4.translateX(15)

// scene.add(filaSoporte4)

const grupoSoporte = new THREE.Object3D()
grupoSoporte.add(filaSoporte)
grupoSoporte.add(filaSoporte2)
grupoSoporte.add(filaSoporte3)
grupoSoporte.add(filaSoporte4)

scene.add(grupoSoporte)

const grupoSoporte2 = grupoSoporte.clone()

// grupoSoporte2.translateX(-75)
// grupoSoporte2.translateY(15)
// grupoSoporte2.translateX(-50)
grupoSoporte2.rotateY(Math.PI)

scene.add(grupoSoporte2)

///////////////////////////////////////////////////////////////////////////////////////////////
// Definicion de la posicion de la camara, angulos, animaciones, lookat, luces
///////////////////////////////////////////////////////////////////////////////////////////////

// Posicion de la camara:
const x0 = 10
const y0 = 15
const z0 = 50
camera.position.x = x0
camera.position.y = y0
camera.position.z = z0

// Determinacion de los angulos de la posicion de la camara
const r0 = Math.sqrt( x0*x0 + y0*y0 + z0*z0 )
let radio = r0
let phi = Math.acos(x0/radio) // angulo en el plano XOZ
let rho = Math.acos(z0/radio) // angulo en el plano ZOY

// Booleano para activar la animacion
let animacion = true

camera.lookAt(new THREE.Vector3(0, 0, 0));

const light = new THREE.AmbientLight( { color: 0xffffff, intensity: 1 } ); 
scene.add( light );

///////////////////////////////////////////////////////////////////////////////////////////////
// Loop de frames
///////////////////////////////////////////////////////////////////////////////////////////////

function animate() {
	requestAnimationFrame( animate );

  // Para que se mueva solo:
  if (animacion === true) {
    camera.position.x = radio*Math.cos(phi)
    camera.position.z = radio*Math.sin(phi)
    phi += 0.01 //plano paralelo a XoZ

    camera.position.z = radio*Math.cos(rho)
    camera.position.y = radio*Math.sin(rho)
    rho += 0.01 // plano paralelo a ZoY
  }

  camera.lookAt(new THREE.Vector3(0, 0, 0));
	renderer.render( scene, camera );
}

if ( WebGL.isWebGLAvailable() ) {

	// Initiate function or other initializations here
	animate();

  document.addEventListener("keydown", onDocumentKeyDown, false);
  function onDocumentKeyDown(event) {
    let key = event.key;
    switch (key) {
      case 'ArrowLeft':
        phi += 0.1
        camera.position.x = radio*Math.cos(phi)
        camera.position.z = radio*Math.sin(phi)
        break
      case'ArrowUp':
        rho += 0.1;
        camera.position.z = radio*Math.cos(rho)
        camera.position.y = radio*Math.sin(rho)
        break
      case 'ArrowRight':
        phi -= 0.1
        camera.position.x = radio*Math.cos(phi)
        camera.position.z = radio*Math.sin(phi)
        break
      case 'ArrowDown':
        rho -= 0.1;
        camera.position.z = radio*Math.cos(rho)
        camera.position.y = radio*Math.sin(rho)
        break
      case 'r':
        radio = r0
        phi = Math.acos(x0/radio)
        rho = Math.acos(z0/radio)
        camera.position.x = radio*Math.cos(phi)
        camera.position.y = radio*Math.sin(rho)
        camera.position.z = radio*Math.sin(phi)
        break
      case '+':
        radio--
        camera.position.x = radio*Math.cos(phi)
        camera.position.y = radio*Math.sin(rho)
        camera.position.z = radio*Math.sin(phi)
        break
      case "-":
        radio++
        camera.position.x = radio*Math.cos(phi)
        camera.position.y = radio*Math.sin(rho)
        camera.position.z = radio*Math.sin(phi)
        break
      case "a":
        animacion = animacion === true ? false : true
      }
    }

} else {

	const warning = WebGL.getWebGLErrorMessage();
	document.getElementById( 'container' ).appendChild( warning );

}