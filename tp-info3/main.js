import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 100, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight, false );
document.body.appendChild( renderer.domElement );

// Ejes de coordenadas X = Rojo, Y = Verde, Z = Azul

// Eje X
let ejeMaterial = new THREE.LineBasicMaterial( { color: 0xff0000 } );
let points = [];
points.push( new THREE.Vector3( 0, 0, 0 ) );
points.push( new THREE.Vector3( 30, 0, 0 ) );
let ejeGeometria = new THREE.BufferGeometry().setFromPoints( points );
let eje = new THREE.Line( ejeGeometria, ejeMaterial );
scene.add( eje );

// Eje Y
ejeMaterial = new THREE.LineBasicMaterial( { color: 0x00ff00 } );
points = [];
points.push( new THREE.Vector3( 0, 0, 0 ) );
points.push( new THREE.Vector3( 0, 30, 0 ) );
ejeGeometria = new THREE.BufferGeometry().setFromPoints( points );
eje = new THREE.Line( ejeGeometria, ejeMaterial );
scene.add( eje );

// Eje Z
ejeMaterial = new THREE.LineBasicMaterial( { color: 0x0000ff } );
points = [];
points.push( new THREE.Vector3( 0, 0, 0 ) );
points.push( new THREE.Vector3( 0, 0, 20 ) );
ejeGeometria = new THREE.BufferGeometry().setFromPoints( points );
eje = new THREE.Line( ejeGeometria, ejeMaterial );
scene.add( eje );

// Base carretera (el piso que sostiene las carreteras)
let largoBaseCarretera = 30
let anchoBaseCarretera = 1
let profundoBaseCarretera = 10

const baseCarreteraGeometria = new THREE.BoxGeometry( largoBaseCarretera, anchoBaseCarretera, profundoBaseCarretera );
const baseCarreteraMaterial = new THREE.MeshBasicMaterial( { color: 0x444444 } );
const baseCarretera = new THREE.Mesh( baseCarreteraGeometria, baseCarreteraMaterial );

scene.add( baseCarretera );

// Pilares (las torres desde donde salen los cables tensores)
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

// Base del pilar (la "piramide" de donde se levanta el pilar)
let rectanguloGeometria = new THREE.BoxGeometry( 10, 1, 10 ) 
let rectanguloMaterial = new THREE.MeshBasicMaterial( { color: 0x848484 } );
const rectanguloMesh = new THREE.Mesh(rectanguloGeometria, rectanguloMaterial)

const basePilar = new THREE.Object3D()
// const basePilar2 = new THREE.Object3D()

basePilar.translateY(-10)
// basePilar2.translateY(-10)

basePilar.add(rectanguloMesh)
// basePilar2.add(rectanguloMesh)

rectanguloGeometria = new THREE.BoxGeometry( 7.5, 1, 7.5 ) 
rectanguloMaterial = new THREE.MeshBasicMaterial( { color: 0x444444 } );
const rectanguloMesh2 = new THREE.Mesh(rectanguloGeometria, rectanguloMaterial)

rectanguloMesh2.translateY(1)

basePilar.add(rectanguloMesh2)
// basePilar2.add(rectanguloMesh2)

rectanguloGeometria = new THREE.BoxGeometry( 5, 1, 5 ) 
rectanguloMaterial = new THREE.MeshBasicMaterial( { color: 0x848484 } );
const rectanguloMesh3 = new THREE.Mesh(rectanguloGeometria, rectanguloMaterial)

rectanguloMesh3.translateY(2)

basePilar.add(rectanguloMesh3)
// basePilar2.add(rectanguloMesh3)

// Columnas (las 2 columnas que estan encima de la base y soportan la carretera)
let columnaGeometria = new THREE.BoxGeometry( 1, 10, 1 ) 
let columnaMaterial = new THREE.MeshBasicMaterial( { color: 0x434343 } );
let meshColumna = new THREE.Mesh(columnaGeometria, columnaMaterial)

meshColumna.translateY(3)
meshColumna.translateX(-1)

basePilar.add(meshColumna)
// basePilar2.add(meshColumna)

let meshColumna2 = new THREE.Mesh(columnaGeometria, columnaMaterial)

meshColumna2.translateY(3)
meshColumna2.translateX(1)

basePilar.add(meshColumna2)
// basePilar2.add(meshColumna2)

basePilar.translateX(10)
// basePilar2.translateX(-10)

// const meshBasePilar = new THREE.Mesh(basePilarGeometria, basePilarMaterial)

const basePilar2 = basePilar.clone()
basePilar2.translateX(-20)

scene.add(basePilar)
scene.add(basePilar2)

const x0 = 10
const y0 = 5
const z0 = 15
camera.position.x = x0
camera.position.y = y0
camera.position.z = z0

const radio = Math.sqrt( x0*x0 + y0*y0 + z0*z0 )
let phi = Math.acos(x0/radio)
let rho = Math.acos(z0/radio)

camera.lookAt(new THREE.Vector3(0, 0, 0));

function animate() {
	requestAnimationFrame( animate );

  // Para que se mueva solo:
  camera.position.x = radio*Math.cos(phi)
  camera.position.z = radio*Math.sin(phi)
  // phi += 0.01 //plano paralelo a XoZ

  camera.position.z = radio*Math.cos(rho)
  camera.position.y = radio*Math.sin(rho)
  // rho += 0.01 // plano paralelo a ZoY

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
        phi = Math.acos(x0/radio)
        rho = Math.acos(z0/radio)
        camera.position.x = radio*Math.cos(phi)
        camera.position.y = radio*Math.sin(rho)
        camera.position.z = radio*Math.sin(phi)
        break
      }
    }

} else {

	const warning = WebGL.getWebGLErrorMessage();
	document.getElementById( 'container' ).appendChild( warning );

}