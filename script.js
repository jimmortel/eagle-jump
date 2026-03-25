const eagle = document.getElementById('eagle');
const container = document.getElementById('game-container');
const scoreSpan = document.getElementById('current-score');
const tysmSpan = document.getElementById('tysm-balance');
const menuScreen = document.getElementById('menu-screen');

// --- 💰 ÉCONOMIE & SKINS ---
let balance = parseInt(localStorage.getItem('tysm_balance')) || 0;
let bestScore = parseInt(localStorage.getItem('tysm_best')) || 0;
tysmSpan.innerText = balance;

let currentSkin = '1000009508.png';

window.selectSkin = function(img, price, element) {
    if (balance >= price) {
        currentSkin = img;
        eagle.src = img;
        document.querySelectorAll('.shop-item').forEach(el => el.classList.remove('selected'));
        element.classList.add('selected');
    } else {
        alert("Il te manque " + (price - balance) + " $TYSM ! Envole-toi pour en gagner.");
    }
};

// --- 🎮 LOGIQUE DE JEU ---
let gravity = 0.4;
let velocity = 0;
let isPlaying = false;
let score = 0;
let eagleY = window.innerHeight - 200;
let eagleX = window.innerWidth / 2 - 30;
let platforms = [];

window.startGame = function() {
    menuScreen.style.display = 'none';
    isPlaying = true;
    score = 0;
    velocity = -12; // Petit saut de départ
};

// Contrôles
window.addEventListener('mousemove', (e) => { if(isPlaying) eagleX = e.clientX - 30; });
window.addEventListener('touchmove', (e) => { 
    if(isPlaying) {
        eagleX = e.touches[0].clientX - 30;
        e.preventDefault();
    }
}, {passive: false});

function createPlatform(y) {
    const plat = document.createElement('div');
    plat.className = 'platform';
    let x = Math.random() * (window.innerWidth - 150);
    plat.style.left = x + 'px';
    plat.style.top = y + 'px';
    container.appendChild(plat);
    return { element: plat, x: x, y: y };
}

// Initialisation des plateformes
for (let i = 0; i < 8; i++) {
    platforms.push(createPlatform(window.innerHeight - i * 130 - 150));
}

function update() {
    if (isPlaying) {
        velocity += gravity;
        eagleY += velocity;
        eagle.style.left = eagleX + 'px';
        eagle.style.top = eagleY + 'px';

        // Scroll vertical
        if (eagleY < window.innerHeight / 2) {
            let scrollAmount = window.innerHeight / 2 - eagleY;
            eagleY = window.innerHeight / 2;
            platforms.forEach(p => {
                p.y += scrollAmount;
                p.element.style.top = p.y + 'px';
                if (p.y > window.innerHeight) {
                    p.y = 0;
                    p.x = Math.random() * (window.innerWidth - 150);
                    p.element.style.left = p.x + 'px';
                    score++;
                    scoreSpan.innerText = score;
                    // On gagne 10 $TYSM par plateforme passée
                    balance += 10;
                    tysmSpan.innerText = balance;
                    localStorage.setItem('tysm_balance', balance);
                }
            });
        }

        // Collisions
        platforms.forEach(p => {
            if (eagleX + 50 > p.x && eagleX < p.x + 130 &&
                eagleY + 60 > p.y && eagleY + 60 < p.y + 20 && velocity > 0) {
                velocity = -12;
            }
        });

        // Game Over
        if (eagleY > window.innerHeight) {
            isPlaying = false;
            menuScreen.style.display = 'flex';
            if (score > bestScore) {
                bestScore = score;
                localStorage.setItem('tysm_best', bestScore);
            }
            alert("GAME OVER ! Score : " + score + "m");
            location.reload(); 
        }
    }
    requestAnimationFrame(update);
}

update();
