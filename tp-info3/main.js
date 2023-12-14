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

// Base rectangular (el piso que sostiene las carreteras)
const geometry = new THREE.BoxGeometry( 1, 10, 30 );
const material = new THREE.MeshBasicMaterial( { color: 0x444444 } );
const baseRectangular = new THREE.Mesh( geometry, material );

baseRectangular.rotation.y = Math.PI/2 
baseRectangular.rotation.x = Math.PI/2

scene.add( baseRectangular );

// Pilares (las torres desde donde salen los cables tensores)
// Pilar 1
let pilarGeometria = new THREE.BoxGeometry( 1, 1, 10 ) 
let pilarMaterial = new THREE.MeshBasicMaterial( { color: 0x848484 } );
let pilar = new THREE.Mesh(pilarGeometria, pilarMaterial)

pilar.translateY(5)
pilar.rotation.x = Math.PI/2
pilar.translateX(10)

scene.add( pilar );

// Pilar 2
pilarGeometria = new THREE.BoxGeometry( 1, 1, 10 ) 
pilarMaterial = new THREE.MeshBasicMaterial( { color: 0x848484 } );
pilar = new THREE.Mesh(pilarGeometria, pilarMaterial)

pilar.translateY(5)
pilar.rotation.x = Math.PI/2
pilar.translateX(-10)

scene.add( pilar );

// Base del pilar (la "piramide" de donde se levanta el pilar)
let basePilarGeometria = new THREE.BoxGeometry( 10, 1, 10 ) 
let basePilarMaterial = new THREE.MeshBasicMaterial( { color: 0x848484 } );
let meshBasePilar = new THREE.Mesh(basePilarGeometria, basePilarMaterial)

const basePilar = new THREE.Object3D()

basePilar.translateY(-20)

basePilar.add(meshBasePilar)

basePilarGeometria = new THREE.BoxGeometry( 7.5, 1, 7.5 ) 
basePilarMaterial = new THREE.MeshBasicMaterial( { color: 0x444444 } );
let meshBasePilar2 = new THREE.Mesh(basePilarGeometria, basePilarMaterial)

meshBasePilar2.translateY(1)

basePilar.add(meshBasePilar2)

basePilarGeometria = new THREE.BoxGeometry( 5, 1, 5 ) 
basePilarMaterial = new THREE.MeshBasicMaterial( { color: 0x848484 } );
let meshBasePilar3 = new THREE.Mesh(basePilarGeometria, basePilarMaterial)

meshBasePilar3.translateY(2)

basePilar.add(meshBasePilar3)

scene.add(basePilar)

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
  phi += 0.01 //plano paralelo a XoZ

  camera.position.z = radio*Math.cos(rho)
  camera.position.y = radio*Math.sin(rho)
  rho += 0.01 // plano paralelo a ZoY

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