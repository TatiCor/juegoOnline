const sectionSeleccionarAtaque = document.getElementById('seleccionar-ataque')
const sectionReiniciar = document.getElementById('reiniciar')
const botonMascotaJugador = document.getElementById('boton-mascotas')
const botonReiniciar = document.getElementById('boton-reiniciar')

const sectionSeleccionarMascota = document.getElementById('seleccionar-mascota')
const spanMascotaJugador = document.getElementById('mascota-jugador')
const spanMascotaEnemigo = document.getElementById('mascota-enemigo')

const spanVidasJugador = document.getElementById('vidas-jugador')
const spanVidasEnemigo = document.getElementById('vidas-enemigo')

const sectionMensajes = document.getElementById('resultado') // para tomar la section mensajes y poder poner el texto*
const ataqueDelJugador = document.getElementById('ataque-jugador')
const ataqueDelEnemigo = document.getElementById('ataque-enemigo')

const contenedorTarjetas = document.getElementById('contenedorTarjetas')
const contenedorAtaques = document.getElementById('contenedorAtaques')

const sectionVerMapa = document.getElementById('ver-mapa')
const mapa = document.getElementById('mapa')

let jugadorId = null
let enemigoId = null
let mokepones = [] // variable array 
let mokeponesEnemigos = []
let ataqueJugador = []  //---> var global, la podemos llamar en cualquier fx
let ataqueOponente = []
let opcionDeMokepones
let inputHipodoge 
let inputCapipepo 
let inputRatigueya
let inputLangostelvis
let inputTucapalma 
let inputPydos 
let mascotaJugador
let mascotaJugadorObjeto
let ataquesMokepon
let ataquesMokeponEnemigo 
let botonFuego //establecemos variables
let botonAgua 
let botonTierra 
let botones = []
let indexAtaqueJugador
let indexAtaqueOponente
let victoriasJugador = 0
let victoriasEnemigo = 0
let ataquesJugador= []
let vidasJugador = 3
let vidasEnemigo = 3
let lienzo = mapa.getContext("2d");
let intervalo
let colisionDetectada
let mapaBackground = new Image()
mapaBackground.src = './assets/mokemap.png'
let alturaQueBuscamos
let anchoDelMapa = window.innerWidth - 20
const anchoMaximoDelMapa = 350

if(anchoDelMapa > anchoMaximoDelMapa) {
    anchoDelMapa = anchoMaximoDelMapa - 20
}

alturaQueBuscamos = anchoDelMapa * 600 / 800  //para hacer responsive al mapa y que se adapte bien a las pantallas.

mapa.width = anchoDelMapa
mapa.height = alturaQueBuscamos

console.log("Anchura: " + mapa.width);
console.log("Altura: " + mapa.height);
console.log("Relación de aspecto: " + (mapa.width / mapa.height));

// La propiedad window.innerWidth en JavaScript te permite saber el ancho de la ventana del navegador en píxeles. Es útil para ajustar la apariencia de una página web en función del tamaño de la ventana del navegador.



//--------- clases y objetos------------------------------
class Mokepon {
    constructor(nombre, foto, vida, fotoMapa, id = null ) {
        this.id = id
        this.nombre = nombre
        this.foto = foto //this se usa para llamar esas caracteristicas 
        this.vida = vida
        this.ataques = [] //---------esto es un ARRAY DENTRO DE UN OBJETO---------
        this.ancho = 40
        this.alto = 40
        this.x = aleatorio(0, mapa.width - this.ancho)  // tambien puedo poner this.x= aleatorio(0,320) this.y= aleatorio(0,240) para que siempre cambie la posición de manera aleatoria. Negativo: a veces se superponen
        this.y = aleatorio(0, mapa.height - this.alto) //establecemos los valores de canvas
        this.mapaFoto = new Image()
        this.mapaFoto.src = fotoMapa
        this.velocidadX = 0
        this.velocidadY = 0
    } // ----------- creamos una clase y le ponemos un constructor donde definimos las caracteristicas de nuestros personajes)

    pintarMokepon() {
        lienzo.drawImage(
            this.mapaFoto,
            this.x,
            this.y,
            this.ancho,
            this.alto
        )
    }
}
// --------- luego creamos una variable --------------------

let Hipodoge = new Mokepon('Hipodoge', './assets/hipodoge.webp', 5, './assets/hipodoge.png')
let Capipepo = new Mokepon('Capipepo', './assets/capipepo.webp', 5, './assets/capipepo.png')
let Ratigueya = new Mokepon('Ratigueya', './assets/rati.webp', 5, './assets/ratigueya.png')

const HIPODOGE_ATAQUES = [
    { nombre: '💧', id: 'boton-agua' },
    { nombre: '💧', id: 'boton-agua' },
    { nombre: '💧', id: 'boton-agua' },
    { nombre: '🔥', id: 'boton-fuego' },
    { nombre: '🌱', id: 'boton-tierra' },
]

Hipodoge.ataques.push(...HIPODOGE_ATAQUES)

const CAPIPEPO_ATAQUES = [
    { nombre: '🌱', id: 'boton-tierra' },
    { nombre: '🌱', id: 'boton-tierra' },
    { nombre: '🌱', id: 'boton-tierra' },
    { nombre: '💧', id: 'boton-agua' },
    { nombre: '🔥', id: 'boton-fuego' },
]

Capipepo.ataques.push(...CAPIPEPO_ATAQUES)

const RATIGUEYA_ATAQUES = [
    { nombre: '🔥', id: 'boton-fuego' },
    { nombre: '🔥', id: 'boton-fuego' },
    { nombre: '🔥', id: 'boton-fuego' }, 
    { nombre: '💧', id: 'boton-agua' },
    { nombre: '🌱', id: 'boton-tierra' },
]

Ratigueya.ataques.push(...RATIGUEYA_ATAQUES)

mokepones.push(Hipodoge,Capipepo,Ratigueya)


function iniciarJuego() {
    //----------------ocultamos la section "seleccionar-ataque"---------------    

    sectionSeleccionarAtaque.style.display = 'none' //para ocultar la section de ataques

    sectionVerMapa.style.display = 'none'

    mokepones.forEach((Mokepon) => {
        opcionDeMokepones = `
        <input type="radio" name="mascotas" id=${Mokepon.nombre} />
            <label class="tarjeta-mokepon" for=${Mokepon.nombre} > 
                <p>${Mokepon.nombre}</p>
                <img src=${Mokepon.foto} alt=${Mokepon.nombre} class="hipo-image">
                    
            </label>
        `

        contenedorTarjetas.innerHTML += opcionDeMokepones

        inputHipodoge = document.getElementById('Hipodoge') 
        inputCapipepo = document.getElementById('Capipepo')
        inputRatigueya = document.getElementById('Ratigueya')
        inputLangostelvis = document.getElementById('Langostelvis')
        inputTucapalma = document.getElementById('Tucapalma')
        inputPydos = document.getElementById('Pydos') 
        
        // para seleccionar mascotas sin que nos muestre error, antes esto estaba ligado al html y sus inputs. Produjo error porque ya no tenemos mas todos los inputs en el html. Para solucionar declaramos let con cada mokepong (global) y la llamamos en la fx para poder "elegir nuestro personaje"
    })
    
    //-----------ocultamos el boton reiniciar-------   
    
 
    sectionReiniciar.style.display = 'none'    
    //--------------Seleccion de mascotas----------------------------   
     
    botonMascotaJugador.addEventListener('click' , seleccionarMascotaJugador)    

    unirseAlJuego().then(() => {
        // Esta función se ejecutará cuando se haya completado la petición de unirse al juego
        botonMascotaJugador.addEventListener('click', seleccionarMascotaJugador);
    });
 
}

function unirseAlJuego() {
    return new Promise((resolve, reject) => {
        fetch("http://192.168.1.35:8080/unirse")
            .then(function(res) {
                if (res.ok) {
                    res.text()
                        .then(function(respuesta) {
                            console.log(respuesta);
                            jugadorId = respuesta;
                            resolve(); // Resolvemos la Promesa para indicar que se ha completado la petición
                        });
                } else {
                    reject(); // Rechazamos la Promesa en caso de error
                }
            })
            .catch(function(error) {
                console.error(error);
                reject(); // Rechazamos la Promesa en caso de error
            });
    });
}
//---------------------seleccion de mascotas-------------------

function seleccionarMascotaJugador() {    
    
   
    // sectionSeleccionarAtaque.style.display = 'flex' // para mostrar la section seleccion ataque que habiamos ocultado.  
    

    if (inputHipodoge.checked) {
        spanMascotaJugador.innerHTML = inputHipodoge.id
        mascotaJugador = inputHipodoge.id
    } else if (inputCapipepo.checked) {
        spanMascotaJugador.innerHTML = inputCapipepo.id  //ahora
        mascotaJugador = inputCapipepo.id
    } else if (inputRatigueya.checked) {
        spanMascotaJugador.innerHTML = inputRatigueya.id
        mascotaJugador = inputRatigueya.id
    } else {
        alert('Debes seleccionar una mascota')
        return
    }
    sectionSeleccionarMascota.style.display = 'none' // ocultamos la section seleccionar mascota una vez seleccionada.    

    seleccionarMokepon(mascotaJugador) //llama fx para mandar datos al backend
    
    
    sectionVerMapa.style.display = 'flex'
    iniciarMapa()
    extraerAtaques(mascotaJugador) // creamos fx para extraer ataques, le establecemos el valor (de la let creada "mascotaJugador")
        
}

// fx para hacer peticion tipo POST
function seleccionarMokepon(mascotaJugador) {
    fetch(`http://192.168.1.35:8080/juegomokepon/${jugadorId}`, { 
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            mokepon: mascotaJugador
        })
    })
}

function extraerAtaques(mascotaJugador) {

    let ataques

    for (let i = 0; i < mokepones.length; i++) {

        if (mascotaJugador === mokepones[i].nombre) {

            ataques = mokepones[i].ataques

            console.log("Su ataque es ", ataques)
        }

    }
   
   mostrarAtaques(ataques)
}

function mostrarAtaques(ataques) {
    

    ataques.forEach((ataque) => {
        
        ataquesMokepon = `<button id=${ataque.id} class="boton-ataque BAtaque">${ataque.nombre}</button>`
        console.log(`Extrayendo los ataques ${ataque.nombre}`)
        //renderizamos ataques (con esto se muestra en el html)
        contenedorAtaques.innerHTML += ataquesMokepon

    })

    //seleccionamos los botones por ID para luego asignar el evento.

    botonFuego = document.getElementById('boton-fuego')
    botonAgua = document.getElementById('boton-agua')
    botonTierra = document.getElementById('boton-tierra')
    // aca iba botonReiniciar. Lo hice const y lo llevé para arriba 
    botones = document.querySelectorAll('.BAtaque')

    


    //-----------------botones de ataques-------------------------------------------
   //los sustituimos con la fx secuenciaAtaque.
    //---------------boton reiniciar ------------------------------------    
    botonReiniciar.addEventListener('click', reiniciarJuego)

}

// fx para agregar el evento click 

function secuenciaAtaque() {

    botones.forEach((boton) => {        

        boton.addEventListener('click', manejarAtaque, { once: true });
        
        function manejarAtaque(e) {

            if (e.target.textContent === '💧') {

                ataqueJugador.push('Agua')
                boton.style.background = '#112f58' // para cambiar el color cuando se seleccione el boton
                boton.disabled = true //---------------disabled de botones ataque-----------------------
                
            } else if (e.target.textContent === '🔥') {
                ataqueJugador.push('Fuego')
                boton.style.background = '#112f58'
                boton.disabled = true
            } else {
                ataqueJugador.push('Tierra')
                boton.style.background = '#112f58'
                boton.disabled = true
            }
            if (ataqueJugador.length === 5){
                enviarAtaques()
            }
            
        }
    })    
}

function enviarAtaques(){
    fetch(`http://192.168.1.35:8080/juegomokepon/${jugadorId}/ataques`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            ataques: ataqueJugador
        })
    })

    intervalo = setInterval(obtenerAtaques, 50)
}

function obtenerAtaques() {
    fetch(`http://192.168.1.35:8080/juegomokepon/${enemigoId}/ataques`)
        .then(function (res) {
            if (res.ok){
                res.json()
                .then(function ({ataques}) {
                    if (ataques.length === 5) {
                        ataqueOponente = ataques
                        combate()
                    }
                })
            }
        })
}




//----------seleccion mascota enemigo----------------------------

function seleccionarMascotaEnemigo(enemigo) {

    spanMascotaEnemigo.innerHTML = enemigo.nombre
    ataquesMokeponEnemigo = enemigo.ataques
    secuenciaAtaque() 
      
}



//ataque oponente
function ataqueAleatorioEnemigo() {

    console.log('ataque del enemigo', ataquesMokeponEnemigo);

    let ataqueAleatorio = aleatorio(0, ataquesMokeponEnemigo.length -1)

    if (ataqueAleatorio == 0 || ataqueAleatorio == 1) {
        ataqueOponente.push('Fuego')

    } else if (ataqueAleatorio == 2 || ataqueAleatorio == 3) {
        ataqueOponente.push('Agua')
        
    } else {
        ataqueOponente.push('Tierra')
    }
    console.log('Holi te muestra el ataqueOponente',ataqueOponente)
    iniciarPelea()
    
}

function iniciarPelea() {
    if(ataqueJugador.length === 5) {
        
    }
}

//la idea es esperar a que el navegador espere a los 5 ataques. Tenemos dos array dentro de los ataque (Jugador y Oponente). Generamos una condicional

function indexAmbosOponente(jugador, enemigo) {
    indexAtaqueJugador = ataqueJugador[jugador]
    indexAtaqueOponente = ataqueOponente[enemigo]
}

function combate() {
    clearInterval(intervalo)

    //hacer un for para recorrer los array (de los ataques Jugador/Oponente) y dentro del bucle se ponen las condicionales

    for (let index = 0; index < ataqueJugador.length; index++) {

        if(ataqueJugador[index] === ataqueOponente[index]) {
            indexAmbosOponente(index, index)
            crearMensaje("EMPATE")
            spanVidasJugador.innerHTML = victoriasJugador

        } else if(ataqueJugador[index] === 'Fuego' && ataqueOponente == 'Tierra') {
            indexAmbosOponente(index, index)
            crearMensaje("GANASTE")
            victoriasJugador++
            spanVidasJugador.innerHTML = victoriasJugador

        } else if(ataqueJugador[index] === 'Agua' && ataqueOponente[index] == 'Fuego') {
            indexAmbosOponente(index, index)
            crearMensaje("GANASTE")
            victoriasJugador++
            spanVidasJugador.innerHTML = victoriasJugador

        } else if(ataqueJugador[index] === 'Tierra' && ataqueOponente[index] === 'Agua') {
            indexAmbosOponente(index, index)
            crearMensaje("GANASTE")
            victoriasJugador++
            spanVidasJugador.innerHTML = victoriasJugador } else {
            indexAmbosOponente(index, index)
            crearMensaje("PERDISTE")
            victoriasEnemigo++
            spanVidasEnemigo.innerHTML = victoriasEnemigo

            }

        revisarVidas()
        }
    }

function revisarVidas() {

    console.log("se revisan las vidas")
    if (victoriasJugador === victoriasEnemigo) {
        crearMensajeFinal("EMPATE...¡VUELVE A INTENTARLO!")
    } else if (victoriasJugador > victoriasEnemigo ) {
        crearMensajeFinal("¡FELICITACIONES GANASTE!🏆")
    } else {
        crearMensajeFinal("PERDISTE😔")
    }
}

// ----------- mensaje para jugadores sobre el ataque-------------------

function crearMensaje(resultado) {  //llamamos a la fx para que nos arroje el mensaje de la eleccion de los ataques dentro de la fx ataqueAleatorioEnemigo.

    let nuevoAtaqueDelJugador = document.createElement('p')
    let nuevoAtaqueDelEnemigo = document.createElement('p')

    sectionMensajes.innerHTML = resultado
    console.log(ataqueJugador,ataqueOponente)
    nuevoAtaqueDelJugador.innerHTML = indexAtaqueJugador
    nuevoAtaqueDelEnemigo.innerHTML = indexAtaqueOponente

    ataqueDelJugador.appendChild(nuevoAtaqueDelJugador)
    ataqueDelEnemigo.appendChild(nuevoAtaqueDelEnemigo)
    
  
    //let parrafo = document.createElement('p') //creamos una var y le asignamos crear un p en el html

    //parrafo.innerHTML = 'Tu mascota atacó con ' + ataqueJugador + '. La mascota del enemigo atacó con ' + ataqueOponente + ' -' + x //mensaje

    //sectionMensajes.appendChild(parrafo) //*ponemos el texto en la section parrafo.
    
    
}

//--------------- creamos mensaje final y establecemos el disabled para los botones de ataque-----------------------

function crearMensajeFinal(resultadoFinal) {
    sectionMensajes.innerHTML = resultadoFinal    


  
//----------------------------hacemos aparecer el boton reiniciar--------------
    sectionReiniciar.style.display = 'block'

}

//------------fx boton reiniciar juego-----------------------------
// todo lo programado dentro de las llaves se va a ejecutar cuando haga click en el boton.
function reiniciarJuego() {
    location.reload()
    } 
// (location)es un método ---- reload es una fx, la cual permite recargar url.


//-----aleatoriedad----
function aleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min) //con esto damos aleatoriedad a la elección del personaje.
}

function pintarCanvas() {
    mascotaJugadorObjeto.x = mascotaJugadorObjeto.x + mascotaJugadorObjeto.velocidadX
    mascotaJugadorObjeto.y = mascotaJugadorObjeto.y + mascotaJugadorObjeto.velocidadY
    lienzo.clearRect(0, 0, mapa.width, mapa.height)
    lienzo.drawImage(
        mapaBackground,
        0,
        0,
        mapa.width,
        mapa.height
    )
    mascotaJugadorObjeto.pintarMokepon()

    enviarPosicion(mascotaJugadorObjeto.x, mascotaJugadorObjeto.y)

    mokeponesEnemigos.forEach(function (mokepon){
        mokepon.pintarMokepon()
        revisarColision(mokepon)
        
    })
}


function enviarPosicion(x, y) {
    fetch(`http://192.168.1.35:8080/juegomokepon/${jugadorId}/posicion`, {
        method: "post",
        headers: {
            "Content-Type": "application/json" 
        },
        body: JSON.stringify({
            x,
            y
        })
    })
    .then(function (res){
        if (res.ok) {
            res.json()
                .then(function({enemigos}) {
                    console.log(enemigos)
                    mokeponesEnemigos = enemigos.map(function(enemigo) {
                        let mokeponEnemigo = null
                        const mokeponNombre = enemigo.mokepon.nombre || ""
                        if (mokeponNombre === "Hipodoge") {
                            mokeponEnemigo = new Mokepon('Hipodoge', './assets/hipodoge.webp', 5, './assets/hipodoge.png', enemigo.id)
                            } else if (mokeponNombre === "Capipepo") {
                                mokeponEnemigo = new Mokepon('Capipepo', './assets/capipepo.webp', 5, './assets/capipepo.png', enemigo.id)
                            } else if (mokeponNombre === "Ratigueya") { 
                                mokeponEnemigo = new Mokepon('Ratigueya', './assets/rati.webp', 5, './assets/ratigueya.png', enemigo.id)
                            }                            
                            mokeponEnemigo.x = enemigo.x
                            mokeponEnemigo.y = enemigo.y

                            return mokeponEnemigo
                    })
                                        
                })
        }
    })
}

  
function moverArriba() {
    mascotaJugadorObjeto.velocidadY = -5
    pintarCanvas()
}

function moverAbajo() {
    mascotaJugadorObjeto.velocidadY = 5
    pintarCanvas()
}

function moverDerecha() {
    mascotaJugadorObjeto.velocidadX = 5
    pintarCanvas()
}

function moverIzquierda() {
    mascotaJugadorObjeto.velocidadX = -5
    pintarCanvas()
}

function detenerMovimiento() {
    mascotaJugadorObjeto.velocidadX = 0
    mascotaJugadorObjeto.velocidadY = 0
}
// ---------- movimiento del personaje con teclas-------
// Es como una estructura condicional. Dentro del caso establecemos las funciones 
function sePresionaUnaTecla(event) {
    console.log('Apretaste la tecla ', event.key);
    if (colisionDetectada) {
        return;
      }
    switch (event.key) {
        case 'ArrowUp':
            moverArriba()            
            break
        case 'ArrowDown':
            moverAbajo()
            break
        case 'ArrowLeft':
            moverIzquierda()
            break
        case 'ArrowRight':
            moverDerecha()
            break 

        default: // En este caso no lo usamos ---por defecto hará esto, actua como un else
            break;
    }
}

//----Movimientos del personaje con teclado - addEventListener.----

function iniciarMapa() {
    
    mascotaJugadorObjeto = obtenerObjetoMascota(mascotaJugador)
    console.log(mascotaJugadorObjeto, mascotaJugador);
    intervalo = setInterval(pintarCanvas, 50)

    window-addEventListener('keydown', sePresionaUnaTecla)

    window.addEventListener('keyup', detenerMovimiento)
    
}

function obtenerObjetoMascota() {
    for (let i = 0; i < mokepones.length; i++) {

        if (mascotaJugador === mokepones[i].nombre) {

            return mokepones [i]
        }
    }
}

//------------ COLISION ENTRE PERSONAJES------------

function revisarColision(enemigo) {
    const arribaEnemigo = enemigo.y
    const abajoEnemigo = enemigo.y + enemigo.alto
    const derechaEnemigo = enemigo.x + enemigo.ancho
    const izquierdaEnemigo = enemigo.x 

    const arribaMascota = 
        mascotaJugadorObjeto.y
    const abajoMascota = 
        mascotaJugadorObjeto.y + mascotaJugadorObjeto.alto
    const derechaMascota = 
        mascotaJugadorObjeto.x + mascotaJugadorObjeto.ancho
    const izquierdaMascota = 
        mascotaJugadorObjeto.x 
    
    
    if(
        abajoMascota < arribaEnemigo ||
        arribaMascota > abajoEnemigo ||
        derechaMascota < izquierdaEnemigo ||
        izquierdaMascota > derechaEnemigo
    ) {
        return
    }

    detenerMovimiento()
    clearInterval(intervalo)

    console.log('se detecto una colision');

    enemigoId = enemigo.id
    sectionSeleccionarAtaque.style.display = 'flex'
    sectionVerMapa.style.display = 'none'
    seleccionarMascotaEnemigo(enemigo)
    colisionDetectada = true;


}

//-------para que una vez cargado el codigo inicie el juego------------
window.addEventListener('load', iniciarJuego ) //no es una funcion, llama a una fx cuando la persona realiza el evento determinado 