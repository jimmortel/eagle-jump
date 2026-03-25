const eagle = document.getElementById('eagle');
const container = document.getElementById('game-container');
const scoreSpan = document.getElementById('current-score');

// Variables de Physique
let gravity = 0.4;
let velocity = 0;
let isPlaying = false;
let score = 0;

// Variables de Position
let eagleY = window.innerHeight - 200; // Départ en bas
let eagleX = window.innerWidth / 2 - 30; // Centré

let platforms = [];
let platformCount = 8; // Nombre de plateformes à l'écran

// --- 🎮 CONTRÔLES (MODE VERTICAL) ---

// Suivre la souris ou le doigt pour aller à gauche/droite
window.addEventListener('mousemove', (e) => {
    if (!isPlaying) isPlaying = true;
    eagleX = e.clientX - 30; // Centre l'aigle sur le curseur
});

window.addEventListener('touchmove', (e) => {
    if (!isPlaying) isPlaying = true;
    eagleX = e.touches[0].clientX - 30;
});

// --- 🦅 GENERATION DES AILES-PLATEFORMES ---

function createPlatform(y) {
    const plat = document.createElement('div');
    plat.className = 'platform';
    
    // Position horizontale aléatoire sur toute la largeur
    let x = Math.random() * (window.innerWidth - 150);
    
    plat.style.left = x + 'px';
    plat.style.top = y + 'px';
    container.appendChild(plat);
    return { element: plat, x: x, y: y };
}

// Initialisation de la première volée d'ailes
for (let i = 0; i < platformCount; i++) {
    // Les plateformes montent de plus en plus haut
    platforms.push(createPlatform(window.innerHeight - i * 130 - 150));
}

// --- 🔄 BOUCLE DE JEU ---

function update() {
    if (!isPlaying) {
        requestAnimationFrame(update);
        return;
    }

    // Applique la gravité et fait bouger l'aigle (Axe Y)
    velocity += gravity;
    eagleY += velocity;
    
    // Applique le mouvement horizontal (Axe X)
    eagle.style.left = eagleX + 'px';
    eagle.style.top = eagleY + 'px';

    // 🎥 EFFET DE CAMÉRA (SCROLL)
    // Si l'aigle dépasse le milieu de l'écran, tout descend
    if (eagleY < window.innerHeight / 2) {
        let scrollAmount = window.innerHeight / 2 - eagleY;
        eagleY = window.innerHeight / 2; // L'aigle reste au milieu
        
        platforms.forEach(p => {
            p.y += scrollAmount; // Tout descend
            p.element.style.top = p.y + 'px';
            
            // Si une aile sort par le bas, on la remonte en haut
            if (p.y > window.innerHeight) {
                p.y = 0; // Remonte tout en haut
                p.x = Math.random() * (window.innerWidth - 150);
                p.element.style.left = p.x + 'px';
                p.element.style.top = p.y + 'px';
                
                // On augmente le score quand on remonte une plateforme
                score++;
                scoreSpan.innerText = score;
            }
        });
    }

    // 💥 GESTION DES REBONDS (COLLISION)
    platforms.forEach(p => {
        // L'aigle touche le dessus d'une aile dorée en tombant
        if (eagleX + 60 > p.x && eagleX < p.x + 180 &&
            eagleY + 60 > p.y && eagleY + 60 < p.y + 15 && velocity > 0) {
            velocity = -12; // Gros rebond !
        }
    });

    // 💀 GAME OVER (CHUTE)
    if (eagleY > window.innerHeight) {
        isPlaying = false;
        alert("CHUTE MORTELLE ! Score : " + score + "m");
        location.reload(); 
    }

    requestAnimationFrame(update);
}

// Lancement
update();
