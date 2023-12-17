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

const renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setSize( window.innerWidth, window.innerHeight, false ); 
renderer.setClearColor( 0x989898, 1); // color del fondo
document.body.appendChild( renderer.domElement ); // agregar render al DOM

///////////////////////////////////////////////////////////////////////////////////////////////
// Ejes de coordenadas X = Rojo, Y = Verde, Z = Azul
///////////////////////////////////////////////////////////////////////////////////////////////
const largoLinea = 200

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
// Base carretera (el piso que sostiene las autoreteras)
///////////////////////////////////////////////////////////////////////////////////////////////
let largoBaseCarretera = 210 // largo es en X
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
let largoPilar = 1 // en X
let anchoPilar = 20// en Y
let profundoPilar = 1 // en Z
let distanciaPilarCentro = 40 // distancia al centro de la carretera (0,0,0)

const pilarGeometria = new THREE.BoxGeometry( largoPilar, anchoPilar, profundoPilar ) 
const pilarMaterial = new THREE.MeshBasicMaterial( { color: 0x848484 } );
const pilar = new THREE.Mesh(pilarGeometria, pilarMaterial)

pilar.translateY(anchoPilar/2)
pilar.translateX(distanciaPilarCentro)

scene.add( pilar );

// Pilar 2
const pilar2 = pilar.clone()

pilar2.translateX(-2*distanciaPilarCentro)

scene.add( pilar2 );

///////////////////////////////
// Cables/tensores
///////////////////////////////
let cablesXPositivo = crearCables()
let cablesXNegativo = crearCables()
cablesXNegativo.rotateY(Math.PI)

pilar.add(cablesXPositivo)
pilar.add(cablesXNegativo)

cablesXPositivo = crearCables()
cablesXNegativo = crearCables()
cablesXNegativo.rotateY(Math.PI)

pilar2.add(cablesXPositivo)
pilar2.add(cablesXNegativo)

///////////////////////////////////////////////////////////////////////////////////////////////
// Base del pilar (la "piramide" de donde se levanta el pilar)
///////////////////////////////////////////////////////////////////////////////////////////////
let anchoBaseColumna = 9

let rectanguloGeometria = new THREE.BoxGeometry( 10, 1, 10 ) 
let rectanguloMaterial = new THREE.MeshBasicMaterial( { color: 0x848484 } );
const rectanguloMesh = new THREE.Mesh(rectanguloGeometria, rectanguloMaterial)

const basePilar = new THREE.Object3D()

basePilar.translateY(-anchoBaseColumna)

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
let largoColumna = 0.5
let anchoColumna = 7
let profundoColumna = 4

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

basePilar.translateX(distanciaPilarCentro)

const basePilar2 = basePilar.clone()
basePilar2.translateX(-2*distanciaPilarCentro)

scene.add(basePilar)
scene.add(basePilar2)

///////////////////////////////////////////////////////////////////////////////////////////////
// Soportes (los)
///////////////////////////////////////////////////////////////////////////////////////////////
// Base del soporte
let largoBaseSoporte = 1.5
let anchoBaseSoporte = 1
let profundoBaseSoporte = 1.5
let distanciaSoportesCentro = 85
let distanciaFilasSoporte = 5
let distanciaSoportes = profundoBaseCarretera/6

let baseSoporteGeometria = new THREE.BoxGeometry( largoBaseSoporte, anchoBaseSoporte, profundoBaseSoporte ) 
let baseSoporteMaterial = new THREE.MeshBasicMaterial( { color: 0x444444 });
let baseSoporteMesh = new THREE.Mesh(baseSoporteGeometria, baseSoporteMaterial)

// baseSoporteMesh.translateY(-5)

const soporte = new THREE.Object3D()

soporte.translateY(-5)

soporte.add(baseSoporteMesh)

// Pilar/columna del soporte
let largoPilarSoporte = 0.5
let anchoPilarSoporte = 4
let profundoPilarSoporte = 0.5

let pilarSoporteGeometria = new THREE.BoxGeometry( largoPilarSoporte, anchoPilarSoporte, profundoPilarSoporte ) 
let pilarSoporteMaterial = new THREE.MeshBasicMaterial( { color: 0x848484 } );
let pilarSoporteMesh = new THREE.Mesh(pilarSoporteGeometria, pilarSoporteMaterial)

pilarSoporteMesh.translateY(anchoBaseSoporte/2 + anchoPilarSoporte/2)

soporte.add(pilarSoporteMesh)

soporte.translateZ(distanciaSoportes)

const soporte2 = soporte.clone()

soporte2.translateZ(2*distanciaSoportes)

const soporte3 = soporte.clone()

soporte3.translateZ(-2*distanciaSoportes)

const soporte4 = soporte.clone()

soporte4.translateZ(-4*distanciaSoportes)

const filaSoporte = new THREE.Object3D()
filaSoporte.add(soporte)
filaSoporte.add(soporte2)
filaSoporte.add(soporte3)
filaSoporte.add(soporte4)

filaSoporte.translateX(distanciaSoportesCentro)

const filaSoporte2 = filaSoporte.clone()

filaSoporte2.translateX(distanciaFilasSoporte)

const filaSoporte3 = filaSoporte.clone()

filaSoporte3.translateX(2*distanciaFilasSoporte)

const filaSoporte4 = filaSoporte.clone()

filaSoporte4.translateX(3*distanciaFilasSoporte)

const grupoSoporte = new THREE.Object3D()
grupoSoporte.add(filaSoporte)
grupoSoporte.add(filaSoporte2)
grupoSoporte.add(filaSoporte3)
grupoSoporte.add(filaSoporte4)

scene.add(grupoSoporte)

const grupoSoporte2 = grupoSoporte.clone()

grupoSoporte2.rotateY(Math.PI)

scene.add(grupoSoporte2)

// Agrupamos todos objetos del puente en un nuevo objeto puente
const puente = new THREE.Object3D()
puente.add(baseCarretera)
puente.add(pilar)
puente.add(pilar2)
puente.add(basePilar)
puente.add(basePilar2)
puente.add(grupoSoporte)
puente.add(grupoSoporte2)

scene.add(puente)

///////////////////////////////////////////////////////////////////////////////////////////////
// Definicion de la posicion de la camara, angulos, animaciones, lookat, luces
///////////////////////////////////////////////////////////////////////////////////////////////

// Posicion de la camara:
const x0 = 10
const y0 = 15
const z0 = 100
camera.position.x = x0
camera.position.y = y0
camera.position.z = z0

// Determinacion de los angulos de la posicion de la camara
const r0 = Math.sqrt( x0*x0 + y0*y0 + z0*z0 )
let radio = r0
let phi = Math.acos(x0/radio) // angulo en el plano XOZ
let rho = Math.acos(z0/radio) // angulo en el plano ZOY

// Booleano para activar las animaciones
let animacionAutos = false
let animacionCamara = false

camera.lookAt(new THREE.Vector3(0, 0, 0));

// Luces
const luzAmbiente = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(luzAmbiente);

const luzDireccional = new THREE.DirectionalLight(0xffffff, 0.8);
luzDireccional.position.set(-20, 30, 10);
scene.add(luzDireccional); 

///////////////////////////////////////////////////////////////////////////////////////////////
// Vehiculos
///////////////////////////////////////////////////////////////////////////////////////////////
const auto = crearAuto(0xff00ff);
auto.scale.set(0.1, 0.1, 0.1)
auto.position.x = -largoBaseCarretera/2
auto.position.z = 2.5
scene.add(auto);

const auto2 = crearAuto(0x00ffff);
auto2.scale.set(0.1, 0.1, 0.1)
auto2.rotateY(Math.PI)
auto2.position.x = largoBaseCarretera/2
auto2.position.z = -2.5
scene.add(auto2);

///////////////////////////////////////////////////////////////////////////////////////////////
// Plano agua
///////////////////////////////////////////////////////////////////////////////////////////////

const aguaGeometria = new THREE.PlaneGeometry(100, 500)
aguaGeometria.rotateX(Math.PI/2)
const aguaTextura = new THREE.TextureLoader().load('Minecraft_Water.png')
aguaTextura.wrapS = aguaTextura.wrapT = THREE.RepeatWrapping
aguaTextura.repeat.set(50, 250)
const aguaMaterial = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, map: aguaTextura })
const aguaPlano = new THREE.Mesh(aguaGeometria, aguaMaterial)
aguaPlano.translateY(-10)
scene.add(aguaPlano)

///////////////////////////////////////////////////////////////////////////////////////////////
// Plano tierra
///////////////////////////////////////////////////////////////////////////////////////////////

const tierraGeometria = new THREE.PlaneGeometry(500, 20)
tierraGeometria.rotateX(Math.PI/4)
tierraGeometria.rotateY(Math.PI/2)
const tierraTextura = new THREE.TextureLoader().load('Minecraft_Dirt.png')
tierraTextura.wrapS = tierraTextura.wrapT = THREE.RepeatWrapping
tierraTextura.repeat.set(30, 1)
const tierraMaterial = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, map: tierraTextura })
const tierraPlano = new THREE.Mesh(tierraGeometria, tierraMaterial)
tierraPlano.translateY(-10)
tierraPlano.translateX(50)
scene.add(tierraPlano)

///////////////////////////////////////////////////////////////////////////////////////////////
// Plano pasto
///////////////////////////////////////////////////////////////////////////////////////////////

const pastoGeometria = new THREE.PlaneGeometry(500, 200)
pastoGeometria.rotateY(Math.PI/2)
pastoGeometria.rotateZ(Math.PI/2)
const pastoTextura = new THREE.TextureLoader().load('Minecraft_Grass.jpg')
pastoTextura.wrapS = pastoTextura.wrapT = THREE.RepeatWrapping
pastoTextura.repeat.set(50, 10)
const pastoMaterial = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, map: pastoTextura })
const pastoPlano = new THREE.Mesh(pastoGeometria, pastoMaterial)
pastoPlano.translateY(-3)
pastoPlano.translateX(150)
scene.add(pastoPlano)

const pastoPlano2 = pastoPlano.clone()
pastoPlano2.position.set(0, 0, 0)
pastoPlano2.translateX(-150)
pastoPlano2.translateY(-10)
scene.add(pastoPlano2)

///////////////////////////////////////////////////////////////////////////////////////////////
// Loop de frames
///////////////////////////////////////////////////////////////////////////////////////////////

function animate() {
	requestAnimationFrame( animate );

  // Para que se mueva solo:
  if (animacionAutos === true) {
    if (auto.position.x < largoBaseCarretera/2) {
      auto.position.x += 0.1
      auto2.position.x -= 0.1
    } else {
      auto.position.x = -largoBaseCarretera / 2
      auto2.position.x = largoBaseCarretera / 2
    }
  }
  
  if (animacionCamara === true) {
    camera.position.x = radio*Math.cos(phi)
    camera.position.z = radio*Math.sin(phi)
    phi += 0.001 //plano paralelo a XoZ
  }

  camera.lookAt(new THREE.Vector3(0, 0, 0));
	renderer.render( scene, camera );
}

if ( WebGL.isWebGLAvailable() ) {

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
        auto.position.x = -largoBaseCarretera/2
        auto2.position.x = largoBaseCarretera/2
        break
      case '+':
        radio--
        ajustarZoom(radio)
        break
      case "-":
        radio++
        ajustarZoom(radio)
        break
      case "a":
        animacionAutos = !animacionAutos
        break
      case "s":
        animacionCamara = !animacionCamara
        break
    }
  }

  document.addEventListener("wheel", (event) => {
    const delta = Math.sign(event.deltaY)
    if (delta === -1) {
      radio--
      ajustarZoom(radio)
    }
    else if (delta === 1) {
      radio++
      ajustarZoom(radio)
    }
  })

} else {
	const warning = WebGL.getWebGLErrorMessage();
	document.getElementById( 'container' ).appendChild( warning );
}

function ajustarZoom(radio) {
  camera.position.x = radio*Math.cos(phi)
  camera.position.y = radio*Math.sin(rho)
  camera.position.z = radio*Math.sin(phi)
}

function crearCables() {
  const cables = new THREE.Group()
  const material = new THREE.LineBasicMaterial( { color: 0x444444 } );

  let points = [];
  let t = anchoPilar/3
  let dc = 10 // distancia del cable
  let yc = ((anchoPilar - t)/19) + t // y del cable
  let deltaY = (2*(anchoPilar - t) + 19*t)/((anchoPilar - t) + 19*t)
  let xc = Math.sqrt(dc*dc - yc*yc) // x del cable

  for ( let i = 2; i <= 19; i++) {
    yc = ((anchoPilar - t)/19)*i + t
    xc = xc*deltaY
    dc = Math.sqrt(xc*xc + yc*yc)
    points.push( new THREE.Vector3( 0, yc, 0 ) );
    points.push( new THREE.Vector3( xc, 0, 0 ) );
    const geometria = new THREE.BufferGeometry().setFromPoints( points );
    const linea = new THREE.Line( geometria, material );
    cables.add(linea)
    points = []
  }
  
  cables.translateY(-anchoPilar/2)
  return cables
}

function crearRueda() {
  const geometria = new THREE.BoxGeometry(12, 12, 33);
  const material = new THREE.MeshPhongMaterial({ color: 0x333333 });
  const rueda = new THREE.Mesh(geometria, material);
  return rueda;
}

function crearAuto(color) {
  const auto = new THREE.Group();
  
  const ruedaTrasera = crearRueda();
  ruedaTrasera.position.y = 6;
  ruedaTrasera.position.x = -18;
  auto.add(ruedaTrasera);
  
  const ruedaDelantera = crearRueda();
  ruedaDelantera.position.y = 6;  
  ruedaDelantera.position.x = 18;
  auto.add(ruedaDelantera);

  const cuerpo = new THREE.Mesh(
    new THREE.BoxGeometry(60, 15, 30),
    new THREE.MeshPhongMaterial({ color: color }) // 0x78b14b
  );
  cuerpo.position.y = 12;
  auto.add(cuerpo);

  const cabin = new THREE.Mesh(
    new THREE.BoxGeometry(33, 12, 24),
    new THREE.MeshPhongMaterial({ color: 0xffffff })
  );
  cabin.position.x = -6;
  cabin.position.y = 25.5;
  auto.add(cabin);

  return auto;
}