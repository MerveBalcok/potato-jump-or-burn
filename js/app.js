const  co = document.querySelector('#canvas');
const ctx = co.getContext('2d');


let animate = false;    // für den Button
let tCode = null;       // die Tastatur für später Tastaturabfrage
let soundSwitch = true; // um den Sound ein- und auszuschalten
let counter = 0;        // für den Punktestand

function playAudio1(src){
    if (soundSwitch) {
        const audio = new Audio(src);
        audio.volume = 0.3;
        audio.play();
    }
}

// potato, fire, stones, die drei gehören zum Muster 
const potato = {
    x   : 10,
    y   : 350, 
    w   : 45,   // potato width
    h   : 80,   // potato height
    col : '#ea9e22', 
    spX : 10,   // speed
    spY : 15,   // jump speed  
    gravity : 0.4,
    vy  : 0,
    jumping : false,
    lifes: 3,   
    
    // Tastaturbefehle 
    move: function () {
        if (tCode === 'ArrowLeft' && this.x > 0) { 
            this.x -= this.spX};
        if (tCode === 'ArrowRight' && this.x < co.width - this.w) {
            this.x += this.spX};
        
        // Damit die Kartoffel springt - Space nicht ausschreiben, sonst funkioniert es nicht 
        if (tCode === ' ' && !this.jumping) { 
            this.jumping = true;
            this.vy = -this.spY};
    
        // Gravtiation 
        if (this.jumping) {
            this.vy += this.gravity;
            this.y += this.vy; // nach oben
    
            if (this.y >= 350) {
                this.y = 350;
                this.jumping = false;
                this.vy = 0;
                counter++; 
                // Counter erhöhen, wenn die Kartoffel ein Hindernis überspringt
            }
        }
        this.draw();
    },
    
    draw : function (){
        // halbtransparentes, um den Schweif zu erzeugen
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)'; 
        ctx.fillRect(0, 0, co.width, co.height); 

        // die Potato zeichnen
        ctx.fillStyle = this.col;
        ctx.beginPath();
        ctx.ellipse(this.x + this.w / 2, this.y + this.h / 2, this.w / 2, this.h / 2, 0, 0, 2 * Math.PI);        
        ctx.fill();
      
    },
    // Kartoffel flackert bei Kollision rot 
    flash: function() { 
        const originalColor = this.col;
        this.col = 'red';
        this.draw();
        setTimeout(() => {
            this.col = originalColor;
            this.draw();
        }, 300);
    }
}; 

const fire = {
    x : 800,
    y : 350, 
    w : 80, 
    h : 80, 
    spX  : 3,
    col : '#9d010f',
    dx   : 1, // nach rechts
    dy   : 1, // nach links 
    move : function (){ 
        (this.x -= this.spX);
    if (this.x < -this.w) {this.x = co.width};
        this.draw();
    },
    // fire zeichnen
    draw : function (){
        ctx.fillStyle =  this.col;
        ctx.fillRect(this.x,this.y,this.w,this.h);  
    },
};  

const stones = [{   // Beide Stone zusammenpacken
    x : 1200,
    y : 350, 
    w : 80, 
    h : 80, 
    spX: 3,
    col : '#5e5c5c',
    dx   : 1, // nach rechts
    dy   : 1, // nach links
    lifeTracker: true, 
    // Bewegung auf der X Achse aufs Ziel zu 
    move : function (){ 
        this.x -= this.spX;
    if (this.x < -this.w) {
        this.x = co.width;
        this.lifeTracker = true;
    };
    
    // Kollision
    if (checkCollision(potato,this)&& this.lifeTracker){
        this.lifeTracker = false;
        playAudio1('sound/mp3/death.mp3');
        if(potato.lifes > 0){
            potato.lifes -- // zieht ein Leben ab 
            drawLifes();
            potato.flash(); // Fürs aufflackern bei Kollision
        
            // Wenn Leben auf 0 ist stopt Animation    
            if (potato.lifes === 0) {
                setTimeout(() => { 
                    alert("Game Over");
                    cancelAnimationFrame(animate);
                    animate = false;

                // New Game Button aktivieren und Farbe zurücksetzen
                const newGameButton = document.querySelector('#new-game');
                newGameButton.disabled = false;
                newGameButton.style.backgroundColor = "";

                // Start-Stop-Button deaktivieren
                const startStopButton = document.querySelector('#start-stop');
                startStopButton.disabled = true;
                startStopButton.style.backgroundColor = "";
                }, 2000);
            }
        }
    }
    this.draw();
},
    // stone zeichnen
    draw : function (){
        ctx.fillStyle =  this.col;
        ctx.fillRect(this.x,this.y,this.w,this.h);
        this.disabled = true;    
        },
},
{
    x : 1500,
    y : 350, 
    w : 80, 
    h : 80, 
    spX  : 3, 
    col : '#5e5c5c',
    dx   : 1, // nach rechts
    dy   : 1, // nach links
    lifeTracker: true, 
    move : function (){ 
        this.x -= this.spX;
    if (this.x < -this.w) {
        this.x = co.width;
        this.lifeTracker = true;
    };
    
    // Kollision
    if (checkCollision(potato,this)&& this.lifeTracker){
        this.lifeTracker = false;
        playAudio1('sound/mp3/death.mp3');
        if(potato.lifes > 0){
            potato.lifes -- // zieht ein Leben ab 
            drawLifes();
            potato.flash(); // Fürs aufflackern bei Kollision
        
            // Wenn Leben auf 0 ist stopt Animation    
            if (potato.lifes === 0) {
                setTimeout(() => {
                    alert("Game Over");
                    cancelAnimationFrame(animate);
                    animate = false;

             // New Game Button aktivieren und Farbe zurücksetzen
             const newGameButton = document.querySelector('#new-game');
             newGameButton.disabled = false;
             newGameButton.style.backgroundColor = "";

             // Start-Stop-Button deaktivieren
             const startStopButton = document.querySelector('#start-stop');
             startStopButton.disabled = true;
             startStopButton.style.backgroundColor = "";
                }, 2000);
            }
        }
    }
    this.draw();
},
        // stone zeichnen
        draw : function (){
            ctx.fillStyle =  this.col;
            ctx.fillRect(this.x,this.y,this.w,this.h);
            this.disabled = true; 
        },
    }
];

function checkCollision(potato, object){ // Viereck auf Ellipse 
    if(potato.x < object.x + object.w && 
        potato.x + potato.w > object.x &&
        potato.y < object.y + object.h &&
        potato.y + potato.h > object.y){
        return true;
    } else {
        return false;
    }       
};

// Kollision prüfen und Sound abspielen
function checkCollisionAndPlaySound(object) {
    if (checkCollision(potato, object)) {
        playAudio1('sound/mp3/death.mp3');
    }
}


// Fügt die schwarze Linie hinzu 
function drawBackgroundLine() {
    ctx.beginPath();
    ctx.moveTo(0,430);
    ctx.lineTo(900,430);
    ctx.lineWidth = 1.9;
    ctx.strokeStyle = "black";
    ctx.stroke();
}

let kollisionsStand = false;  

function drawCounter() { // Punktestand oben links
    ctx.fillStyle = "black";
    ctx.font = "26px Segoe UI";
    ctx.fillText("Counter: " + counter, 50, 50); // Position des Counters
}

function drawLifes() { // Lebenspunkte oben rechts
    ctx.fillStyle = "black";
    ctx.font = "26px Segoe UI";
    ctx.fillText("Life: " + potato.lifes, 750, 50);
}

// Animation starten
function render(){
animate = requestAnimationFrame(render);
if (!kollisionsStand) {

    potato.move();
    fire.move();
    stones.forEach((stone) => stone.move());

    // Kollision zwischen Potato und fire überprüfen
    if (checkCollision(potato, fire)) {
        kollisionsStand = true;  // Kollision festgestellt 
        playAudio1('sound/mp3/death.mp3');
        potato.col = 'black';    // Farbe der Kartoffel in schwarz ändern
        potato.move();

        // Einfrieren und Game over
        setTimeout(() => {
            alert("Game Over");
            cancelAnimationFrame(animate);
            animate = false;
            counter = 0; // Counter zurücksetzen

            // New Game Button aktivieren und Farbe zurücksetzen
            const newGameButton = document.querySelector('#new-game');
            newGameButton.disabled = false;
            newGameButton.style.backgroundColor = "";

            // Start-Stop-Button deaktivieren
            const startStopButton = document.querySelector('#start-stop');
            startStopButton.disabled = true;
            startStopButton.style.backgroundColor = "";
        },1000);  
        return;  
    } 
    drawBackgroundLine();
    drawLifes();
    drawCounter();
    
    }
} //render end


// Tastatur erfassen
function checkKeyDown(e){
    // Reagiert nur auf das was im Code steht, damit die Spacetaste nicht das Spiel stopt
    e.preventDefault();  
    tCode = e.key;
}
function checkKeyUp(e){
    tCode = null;
}

document.addEventListener('keydown',checkKeyDown);
document.addEventListener('keyup',checkKeyUp);



// Start-Stop Button
document.querySelector('#start-stop').addEventListener('click',function(){
    if(!animate){
        render();
        this.innerText = 'STOP';
    }else{
        cancelAnimationFrame(animate);
        animate = false;
        this.innerText = 'START';
    }
});

function newGame(){
    if (!animate) {
        // Game reset 
        ctx.clearRect(0, 0, co.width, co.height);

        potato.x = 10;
        potato.y = 350;         // Postition zurücksetzen
        potato.lifes = 3;       // Leben zurücksetzen
        potato.col = '#ea9e22'; // Farbe zurücksetzen
        potato.vy = 0;  
        potato.jumping = false;


        fire.x = 800;           // Postition zurücksetzen
        kollisionsStand = false;
        tCode = null;           // Tasten-Input zurücksetzen
        counter = 0;            // Punktestand zurücksetzen


        // Stones zurücksetzen
        stones.forEach((stone, index) => {
            stone.x = index === 0 ? 1200 : 1500;
            stone.lifeTracker = true;
        });

        // New Game Button ausgrauen und deaktivieren
        const newGameButton = document.querySelector('#new-game');
        newGameButton.disabled = true;
        newGameButton.style.backgroundColor = "";


        // Start-Stop-Button aktivieren
        const startStopButton = document.querySelector('#start-stop');
        startStopButton.disabled = false;
        startStopButton.style.backgroundColor = "";


        // Animation starten
        render();
    }
}

// New-Game Button
document.querySelector('#new-game').addEventListener('click', newGame);


// Audio-Button zum Ein- und Ausschalten
document.querySelector('#audio').addEventListener('click', () => {
    soundSwitch = !soundSwitch;
    if (soundSwitch) {
        document.querySelector('#audio').innerHTML = '&#128266;'; // Ton aktivieren
    } else {
        document.querySelector('#audio').innerHTML = '&#128263;'; // Ton deaktivieren
    }
});







