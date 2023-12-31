// Desarrolladores:
// * Alain Vega
// * Mathias Martinez

import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let fov = 100
let aspect = window.innerWidth / window.innerHeight
let near = 0.1
let far = 1000

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0197f6);
const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );

const renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setSize( window.innerWidth, window.innerHeight, false ); 
renderer.setClearColor( 0x989898, 1 ); // color del fondo
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
let profundoBaseCarretera = 25 // profundo es en Z

const baseCarreteraGeometria = new THREE.BoxGeometry( largoBaseCarretera, anchoBaseCarretera, profundoBaseCarretera );
const baseCarreteraMaterial = new THREE.MeshPhongMaterial( { color: 0x888888 } ); 
const baseCarretera = new THREE.Mesh( baseCarreteraGeometria, baseCarreteraMaterial );

///////////////////////////
// Carretera puente
///////////////////////////
const carreteras = crearCarretera()
baseCarretera.add( carreteras );

///////////////////////////
// Separador vial (separador de carreteras)
///////////////////////////
let largoSeparador = largoBaseCarretera
let anchoSeparador = 1
let profundoSeparador = 1

const separadorGeometria = new THREE.BoxGeometry( largoSeparador, anchoSeparador, profundoSeparador/4.5 );
const separadorMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff } ); 
const separadorMesh = new THREE.Mesh( separadorGeometria, separadorMaterial );

separadorMesh.translateY(1)

baseCarretera.add(separadorMesh)

///////////////////////////
// vallaPetonal (las 2 vallas que delimitan donde pueden caminar las personas)
///////////////////////////
let largoValla = largoBaseCarretera
let anchoValla = 3.5
let profundoValla = 0.3

const vallaGeometria = new THREE.BoxGeometry(largoValla, anchoValla, profundoValla)
const vallaMaterial = new THREE.MeshPhongMaterial( {color: 0xffffff } )
const vallaMesh = new THREE.Mesh(vallaGeometria, vallaMaterial)

const valla = new THREE.Group()

vallaMesh.translateZ(profundoBaseCarretera/2)

const vallaMesh2 = vallaMesh.clone()

vallaMesh2.translateZ(-1)

const valla1 = new THREE.Group()

valla1.add(vallaMesh)
valla1.add(vallaMesh2)

const valla2 = valla1.clone()

valla2.rotateY(Math.PI)

valla.add(valla1)
valla.add(valla2)

baseCarretera.add(valla)

////////////////////////////
// Camino tierra
///////////////////////////
let distanciaCaminoTierraAsuncionCentro = largoBaseCarretera/2 + 90
let distanciaCaminoTierraChacoCentro = largoBaseCarretera/2 + 100
let asuncionY = -3
let chacoY = -10
let largoCarreteraPasto = 0.2

const carreteraTierra = baseCarretera.clone()
carreteraTierra.scale.x = largoCarreteraPasto
carreteraTierra.translateX(-distanciaCaminoTierraChacoCentro - largoBaseCarretera*(largoCarreteraPasto/2))
carreteraTierra.translateY(chacoY)
scene.add(carreteraTierra)

const carreteraTierra2 = baseCarretera.clone()
carreteraTierra2.scale.x = largoCarreteraPasto
carreteraTierra2.translateX(distanciaCaminoTierraAsuncionCentro + largoBaseCarretera*(largoCarreteraPasto/2))
carreteraTierra2.translateY(asuncionY)
scene.add(carreteraTierra2)

///////////////////////////
// Carretera pendiente subida/bajada (del puente al camino tierra)
///////////////////////////
const carreteraPendiente = baseCarretera.clone()

// largo del segmento con pendiente
const largoCarreteraInclinada = Math.sqrt(
  (largoBaseCarretera/2 - distanciaCaminoTierraAsuncionCentro)**2 + (0 - asuncionY)**2)
carreteraPendiente.scale.x = largoCarreteraInclinada/largoBaseCarretera

// trasladarse al punto medio de donde termina el puente y empieza la carretera en el pasto
carreteraPendiente.translateX((largoBaseCarretera/2 + distanciaCaminoTierraAsuncionCentro)/2)
carreteraPendiente.translateY((0 + asuncionY)/2)

// angulo de giro
carreteraPendiente.rotateZ(-Math.acos( (distanciaCaminoTierraAsuncionCentro - largoBaseCarretera/2)
  /largoCarreteraInclinada ))

scene.add(carreteraPendiente)

const carreteraPendiente2 = baseCarretera.clone()

// largo del segmento con pendiente
const largoCarreteraInclinada2 = Math.sqrt(
  (largoBaseCarretera/2 - distanciaCaminoTierraChacoCentro)**2 + (0 - chacoY)**2)
carreteraPendiente2.scale.x = largoCarreteraInclinada2/largoBaseCarretera

// trasladarse al punto medio de donde termina el puente y empieza la carretera en el pasto
carreteraPendiente2.translateX(-(largoBaseCarretera/2 + distanciaCaminoTierraChacoCentro)/2)
carreteraPendiente2.translateY((0 + chacoY)/2)

// angulo de giro
carreteraPendiente2.rotateZ(Math.acos( (distanciaCaminoTierraChacoCentro - largoBaseCarretera/2)
  /largoCarreteraInclinada2 ))

scene.add(carreteraPendiente2)


///////////////////////////////////////////////////////////////////////////////////////////////
// Pilares (las torres desde donde salen los cables tensores)
///////////////////////////////////////////////////////////////////////////////////////////////
// Pilar 1 
let largoPilar = 1 // en X
let anchoPilar = 20// en Y
let profundoPilar = 1 // en Z
let distanciaPilarCentro = 40 // distancia al centro de la carretera (0,0,0)

const pilarGeometria = new THREE.BoxGeometry( largoPilar, anchoPilar, profundoPilar ) 
const pilarMaterial = new THREE.MeshPhongMaterial( { color: 0x848484 } );
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
let rectanguloMaterial = new THREE.MeshPhongMaterial( { color: 0x848484 } );
const rectanguloMesh = new THREE.Mesh(rectanguloGeometria, rectanguloMaterial)

const basePilar = new THREE.Object3D()

basePilar.translateY(-anchoBaseColumna)

basePilar.add(rectanguloMesh)

rectanguloGeometria = new THREE.BoxGeometry( 7.5, 1, 7.5 ) 
rectanguloMaterial = new THREE.MeshPhongMaterial( { color: 0x444444 } );
const rectanguloMesh2 = new THREE.Mesh(rectanguloGeometria, rectanguloMaterial)

rectanguloMesh2.translateY(1)

basePilar.add(rectanguloMesh2)

rectanguloGeometria = new THREE.BoxGeometry( 5, 1, 5 ) 
rectanguloMaterial = new THREE.MeshPhongMaterial( { color: 0x848484 } );
const rectanguloMesh3 = new THREE.Mesh(rectanguloGeometria, rectanguloMaterial)

rectanguloMesh3.translateY(2)

basePilar.add(rectanguloMesh3)

// Columnas (las 2 columnas que estan encima de la base y soportan la carretera)
let largoColumna = 0.5
let anchoColumna = 7
let profundoColumna = 4

let columnaGeometria = new THREE.BoxGeometry( largoColumna, anchoColumna, profundoColumna ) 
let columnaMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff } );
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
let baseSoporteMaterial = new THREE.MeshPhongMaterial( { color: 0x444444 });
let baseSoporteMesh = new THREE.Mesh(baseSoporteGeometria, baseSoporteMaterial)

const soporte = new THREE.Object3D()

soporte.add(baseSoporteMesh)

// Pilar/columna del soporte
let largoPilarSoporte = 0.5
let anchoPilarSoporte = 8
let profundoPilarSoporte = 0.5

let pilarSoporteGeometria = new THREE.BoxGeometry( largoPilarSoporte, anchoPilarSoporte, profundoPilarSoporte ) 
let pilarSoporteMaterial = new THREE.MeshPhongMaterial( { color: 0x848484 } );
let pilarSoporteMesh = new THREE.Mesh(pilarSoporteGeometria, pilarSoporteMaterial)

pilarSoporteMesh.translateY(anchoBaseSoporte/2 + anchoPilarSoporte/2)

soporte.translateY(-anchoPilarSoporte -anchoBaseSoporte)

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
let distanciaAutos = 3.5

const autos = new THREE.Group()

const auto = crearAuto(0xff00ff);
auto.scale.set(0.1, 0.1, 0.1)
auto.position.x = -largoBaseCarretera/2
auto.position.z = distanciaAutos
autos.add(auto);

const auto2 = crearAuto(0x00ffff);
auto2.scale.set(0.1, 0.1, 0.1)
auto2.rotateY(Math.PI)
auto2.position.x = largoBaseCarretera/2
auto2.position.z = -distanciaAutos
autos.add(auto2);

const auto3 = crearAuto(0xffff00);
auto3.scale.set(0.1, 0.1, 0.1)
auto3.position.x = -largoBaseCarretera/2
auto3.position.z = 2.5*distanciaAutos
autos.add(auto3);

const auto4 = crearAuto(0xff0000);
auto4.scale.set(0.1, 0.1, 0.1)
auto4.rotateY(Math.PI)
auto4.position.x = largoBaseCarretera/2
auto4.position.z = -2.5*distanciaAutos
autos.add(auto4);

///////////////////////////////////////////////////////////////////////////////////////////////
// Agrupamos todos objetos del puente en un nuevo objeto puente
///////////////////////////////////////////////////////////////////////////////////////////////
const puente = new THREE.Object3D()
puente.add(baseCarretera)
puente.add(pilar)
puente.add(pilar2)
puente.add(basePilar)
puente.add(basePilar2)
puente.add(grupoSoporte)
puente.add(grupoSoporte2)
puente.add(autos)

scene.add(puente)

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

const tierraGeometria = new THREE.PlaneGeometry(500, 19)
tierraGeometria.rotateX(Math.PI/4)
tierraGeometria.rotateY(Math.PI/2)
const tierraTextura = new THREE.TextureLoader().load('Minecraft_Dirt.png')
tierraTextura.wrapS = tierraTextura.wrapT = THREE.RepeatWrapping
tierraTextura.repeat.set(150, 5)
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
pastoTextura.repeat.set(150, 100)
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
// Modelos 3D
///////////////////////////////////////////////////////////////////////////////////////////////

// Modelo de bote sacado de: https://sketchfab.com/3d-models/minecraft-boat-e0d9d3e6cdd1430e83c94bf4998ed391#download
let boteModelo

const loader = new GLTFLoader()
loader.load('scene.gltf', function (gltf) {
  const model = gltf.scene
  boteModelo = gltf.scene
  model.scale.set(10, 10, 10)
  model.translateX(20)
  model.translateY(-10)
  model.translateZ(50)
  model.rotateY(Math.PI/2)
  scene.add(model)
}, undefined, function (error) {
  console.error(error)
})

let boteModelo2

const loader2 = new GLTFLoader()
loader2.load('scene.gltf', function (gltf) {
  const model2 = gltf.scene
  boteModelo2 = gltf.scene
  model2.scale.set(10, 10, 10)
  model2.translateX(-20)
  model2.translateY(-10)
  model2.translateZ(-50)
  model2.rotateY(-Math.PI/2)
  scene.add(model2)
}, undefined, function (error) {
  console.error(error)
})

///////////////////////////////////////////////////////////////////////////////////////////////
// Loop de frames
///////////////////////////////////////////////////////////////////////////////////////////////

function animate() {
	requestAnimationFrame( animate );

  let maximaDistanciaBote = 100
  // Para que se mueva solo:
  if (animacionAutos === true) {
    if (auto.position.x < largoBaseCarretera/2) {
      auto.position.x += 0.12
      auto2.position.x -= 0.12
      auto3.position.x += 0.1
      auto4.position.x -= 0.1
    } else {
      auto.position.x = -largoBaseCarretera / 2
      auto2.position.x = largoBaseCarretera / 2
      auto3.position.x = -largoBaseCarretera / 2
      auto4.position.x = largoBaseCarretera / 2
    }
    if (boteModelo.position.z >= -maximaDistanciaBote) {
      boteModelo.position.z -= 0.1
      boteModelo2.position.z += 0.1
    } else {
      boteModelo.position.z = maximaDistanciaBote
      boteModelo2.position.z = -maximaDistanciaBote
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
    let paso = 0.1
    let key = event.key;
    switch (key) {
      case 'ArrowLeft':
        phi += paso
        camera.position.x = radio*Math.cos(phi)
        camera.position.z = radio*Math.sin(phi)
        break
      case'ArrowUp':
        if ( rho < Math.PI - paso ) {
          rho += paso;
          camera.position.z = radio*Math.cos(rho)
          camera.position.y = radio*Math.sin(rho)
        }
        break
      case 'ArrowRight':
        phi -= paso
        camera.position.x = radio*Math.cos(phi)
        camera.position.z = radio*Math.sin(phi)
        break
      case 'ArrowDown':
        if ( rho > 0 + paso ) {
          rho -= paso;
          camera.position.z = radio*Math.cos(rho)
          camera.position.y = radio*Math.sin(rho)
        }
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
        auto3.position.x = -largoBaseCarretera/2
        auto4.position.x = largoBaseCarretera/2
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
    if (delta === -1 && radio > 0) {
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

function crearCarretera() {
  const carreteraGeometria = new THREE.BoxGeometry( largoBaseCarretera, anchoBaseCarretera, profundoBaseCarretera/2.5);
  const carreteraMaterial = new THREE.MeshPhongMaterial( { color: 0x000000 } ); 
  const carreteraMesh = new THREE.Mesh( carreteraGeometria, carreteraMaterial );

  carreteraMesh.translateY(0.1)
  carreteraMesh.translateZ(profundoBaseCarretera/4)

  const franjaGeometeria = new THREE.BoxGeometry( largoBaseCarretera, 0.1, profundoBaseCarretera/40);
  const franjaMaterial = new THREE.MeshLambertMaterial( { color: 0xffffff } )
  const franjaMesh = new THREE.Mesh(franjaGeometeria, franjaMaterial)

  carreteraMesh.add(franjaMesh)

  franjaMesh.translateY(0.5)

  const carreteraMesh2 = carreteraMesh.clone()

  carreteraMesh2.translateZ(-2*profundoBaseCarretera/4)

  const carreteras = new THREE.Group()

  carreteras.add(carreteraMesh)
  carreteras.add(carreteraMesh2)

  return carreteras
}

function crearCables() {
  const cables = new THREE.Group()
  const material = new THREE.LineBasicMaterial( { color: 0x444444 } );

  let points = [];
  let t = anchoPilar/3 // distancia del primer cable a la base (cateto altura)
  let dc = 10 // longitud del cable (hipotenusa)
  let yc = t // y del i-esimo cable, inicialmente t
  let deltaY = (2*(anchoPilar - t) + 19*t)/((anchoPilar - t) + 19*t) // distancia entre dos cables consecutivos (catetos altura)
  let xc = Math.sqrt(dc*dc - yc*yc) // x del cable (cateto base)

  for (let i = 1; i <= 19; i++) {
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
