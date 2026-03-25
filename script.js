const eagle = document.getElementById('eagle');
const container = document.getElementById('game-container');
const scoreSpan = document.getElementById('current-score');

let gravity = 0.4;
let velocity = 0;
let isPlaying = false;
let score = 0;
let platforms = [];

// Position de départ
let eagleY = 200;
let eagleX = 50;

function jump() {
    if (!isPlaying) isPlaying = true;
    velocity = -8;
}

window.addEventListener('mousedown', jump);
window.addEventListener('touchstart', jump);

function createPlatform(x) {
    const plat = document.createElement('div');
    plat.className = 'platform';
    let y = Math.random() * (window.innerHeight - 150) + 50;
    plat.style.left = x + 'px';
    plat.style.top = y + 'px';
    container.appendChild(plat);
    return { element: plat, x: x, y: y };
}

// Initialisation des premières ailes
platforms.push(createPlatform(window.innerWidth));
platforms.push(createPlatform(window.innerWidth + 400));

function update() {
    if (!isPlaying) {
        requestAnimationFrame(update);
        return;
    }

    velocity += gravity;
    eagleY += velocity;
    
    // Animation inclinaison de l'aigle
    let rotation = velocity * 2;
    eagle.style.transform = `rotate(${rotation}deg)`;
    eagle.style.top = eagleY + 'px';
    eagle.style.left = eagleX + 'px';

    platforms.forEach((p) => {
        p.x -= 4; // Vitesse de défilement
        p.element.style.left = p.x + 'px';

        // Collision rebond sur les ailes d'aigle
        if (eagleX + 50 > p.x && eagleX < p.x + 180 &&
            eagleY + 50 > p.y && eagleY + 50 < p.y + 30 && velocity > 0) {
            velocity = -10;
            score += 10;
            scoreSpan.innerText = score;
        }

        // Recyclage des plateformes quand elles sortent de l'écran
        if (p.x < -200) {
            p.x = window.innerWidth;
            p.y = Math.random() * (window.innerHeight - 150) + 50;
            p.element.style.top = p.y + 'px';
        }
    });

    // Game Over si on touche les bords
    if (eagleY > window.innerHeight || eagleY < -100) {
        isPlaying = false;
        alert("Game Over ! Score: " + score);
        location.reload(); 
    }

    requestAnimationFrame(update);
}

update();
