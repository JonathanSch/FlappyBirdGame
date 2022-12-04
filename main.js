//Get canvas and context
const cvs = document.getElementById('canvas')
const ctx = cvs.getContext('2d')
const jugar = document.getElementById('jugar');

const data = {
    "email":localStorage.getItem('user')
}


const getRecord = async() =>{

    await fetch('https://shtaiger-jump.herokuapp.com/api/getRecord',{method:'POST',body:JSON.stringify(data),headers:{
        "Content-Type":"application/json",
        "auth-token" : localStorage.getItem('token'),
    }}).then(res=>res.json()).then(res=>{   
        if(res.record || res.record === 0){
            recordUsuario = res.record
    cvs.style.display = 'block';
    jugar.style.display = 'none';
    console.log(res.record)
        }
       }).catch(err=>console.log(err))
}

if(!localStorage.getItem('token')){
    jugar.innerText = 'Inicia sesión para jugar'
    cvs.style.display = 'none';
}
else if(localStorage.getItem('token')){
        jugar.innerText = 'Cargando'
    cvs.style.display = 'none';
    getRecord();
}

let gameScore = 0;
const score = document.getElementById('score');

const record = document.getElementById('record');

cvs.addEventListener('click', () => {
    if (estado === 0) {
        estado++
    }
    else if (estado === 1) {
        bird.flap();
    }
    else{
        bird.dY = 10;
        gameScore= 0;
        bird.speed = 0;
        estado = 0;
    }
})

//Variables needed


let frames = 0;
let estado = 0;




//Create images

const birdImage = new Image();
birdImage.src = 'assets/fotoShtaiger.png'

const gameOverImage = new Image();
gameOverImage.src = 'assets/gameOver.png'

const bird = {
    dX: 10,
    dY: 10,
    w: 50,
    h: 50,
    gravity: 0.5,
    speed: 0,
    salto: 10,
    draw: function () {
        ctx.drawImage(birdImage, this.dX, this.dY, this.w, this.h)
    },
    update: function () {
        if (estado === 1) {
            this.speed += this.gravity;
            this.dY += this.speed;

            if (this.dY >= cvs.height) {
                estado = 2;
                this.dY = 10;
                this.speed = 0;
            }
            else if (this.dY < -30) {
                estado = 2;
                this.dY = 10;
                this.speed = 0;
            }
        }
    },
    flap: function () {
        this.speed = -this.salto;
    }
}

const gameOver = {
    dX: (cvs.height) / 2 /2,
    dY: (cvs.width) / 2,
    w: 200,
    h: 300,
    draw: function () {
        if (estado === 2) {
            ctx.fillStyle = 'black'
            ctx.fillText('Game Over', this.dX, this.dY, this.w, this.h)
        }
    }
}

const textDraw = () => {
    if (estado === 0) {
        ctx.font = "30px Arial";
        ctx.fillStyle = 'black'
        ctx.fillText("Haz click para empezar", 50, cvs.height / 2);
        ctx.fillText(" y para saltar", 40, cvs.height / 2 + 30);
        ctx.fillStyle = 'blue'
    }
}

let apertura = 170;

const pilar = {
    pilares: [],
    draw: function () {
        if (this.pilares.length >= 1) {
            for (let i = 0; i < this.pilares.length; i++) {
                ctx.fillStyle = 'black';
                ctx.fillRect(this.pilares[i].dX, this.pilares[i].dY, this.pilares[i].width, this.pilares[i].posicion)
                //Otro pilar
                ctx.fillStyle = 'black';
                ctx.fillRect(this.pilares[i].dX, this.pilares[i].height, this.pilares[i].width, -(cvs.height - (this.pilares[i].posicion) - apertura));
                ctx.fillStyle = 'blue';
            }
        }
    },
    update: function () {
        if (frames % 75 === 0) {
            this.pilares.push({
                dX: cvs.width,
                dY: 0,
                height: cvs.height,
                width: 30,
                posicion: Math.round(Math.random() * (cvs.height - 150)),
            })
            if (this.pilares.length > 3) {
                this.pilares.shift();
            }
        }

        for (let i = 0; i < this.pilares.length; i++) {
            let obj1 = {
                x: bird.dX,
                y: bird.dY,
                width: bird.w,
                height: bird.h,
            }
            let obj2 = {
                x: pilar.pilares.length > 1 ? pilar.pilares[i].dX : -400,
                y: pilar.pilares.length > 1 ? pilar.pilares[i].dY : -400,
                width: 30,
                height: pilar.pilares[i].posicion,
            }
            let obj3 = {
                x: pilar.pilares.length > 1 ? pilar.pilares[i].dX : -400,
                y: cvs.height,
                width: 30,
                height: -(cvs.height - (pilar.pilares[i].posicion) - apertura),
            }
            let obj4 = {
                x: pilar.pilares.length > 1 ? pilar.pilares[i].dX : -400,
                y: pilar.pilares.length > 1 ? pilar.pilares[i].dY : -400,
                width: .001,
                height: cvs.height,
            }
            let obj5 = {
                x: bird.dX,
                y: bird.dY,
                width: 0.01,
                height: bird.h,
            }
            if (rectIntersect(obj1, obj2)) {
                bird.speed = 0;
                estado = 2;

            }

            else if (rectIntersect2(obj1, obj3)) {
                bird.speed = 0;
                estado = 2;

            }
            else if(rectIntersect(obj5,obj4)){
                gameScore++
                if(recordUsuario < gameScore){
                    recordUsuario = gameScore
                    fetch('https://shtaiger-jump.herokuapp.com/api/newRecord',{method:'PATCH',body:JSON.stringify({
                    email:localStorage.getItem('user'),
                    record:gameScore,

                }),headers:{
                    "Content-Type":"application/json",
                    "auth-token" : localStorage.getItem('token'),
                }}).then(res=>res.json()).then(res=>console.log(res)).catch(err=>console.log(err))
                }
                
            }

        }

        if (this.pilares.length >= 1) {
            for (let i = 0; i < this.pilares.length; i++) {
                this.pilares[i].dX -= 3;
            }
        }
        if (estado === 2 || estado === 0) {
            this.pilares = [];
        }
    }
}



//Draw and update functions

const draw = () => {
    ctx.fillStyle = 'blue';
    ctx.fillRect(0, 0, 400, 500)

    bird.draw();
    gameOver.draw();
    textDraw();
    pilar.draw();
}

const update = () => {
    bird.update();
    pilar.update();
}

//Deteccion de colisiones

function rectIntersect(first, second) {
    return !(first.x > second.x + second.width || first.x + first.width < second.x || first.y > second.y + second.height - 10 || first.y + first.height < second.y);
}
function rectIntersect2(first, second) {
    return !(first.x > second.x + second.width || first.x + first.width < second.x || first.y < second.y + second.height - 40 || first.y + first.height > second.y);
}

let recordUsuario = 0;








const loop = () => {
    
    draw();
    update();
    frames++
    score.innerHTML = "Tu puntuacion es " + gameScore;
    record.innerHTML ="Tu record es " + recordUsuario
    requestAnimationFrame(loop)
}

loop()