const eagle = document.getElementById('eagle');
const container = document.getElementById('game-container');
const scoreSpan = document.getElementById('current-score');
const tysmSpan = document.getElementById('tysm-balance');
const menuScreen = document.getElementById('menu-screen');

// --- 💰 ÉCONOMIE & SKINS ---
let balance = parseInt(localStorage.getItem('tysm_balance')) || 0;
let bestScore = parseInt(localStorage.getItem('tysm_best')) || 0;
tysmSpan.innerText = balance;

let currentSkin = '1000009508.png'; // Ton aigle royal de départ
// --- 💰 SYSTÈME DE PAIEMENT RÉEL (FARCASTER x SOLANA) ---
    // 2. Cas du Skin GOLD (Paiement 0.01 SOL avec tes réglages)
    if (img === '1000009505.png') {
        try {
            if (window.farcaster && window.farcaster.sdk) {
                
                const result = await window.farcaster.sdk.actions.sendTransaction({
                    chainId: "solana:mainnet", 
                    method: "solana_sendTransaction", 
                    params: {
                        to: "GU5dNvMQKoUiVJvZ5HUgrv3CxtrR5ujxfHK2HPT6Z6bV",
                        value: "10000000", // 0.01 SOL
                        // --- TES RÉGLAGES PERSONNALISÉS ---
                        slippage: 10,           // 10% de slippage
                        priorityFee: 0.001,     // 0.001 SOL frais de priorité
                        antiFrontRun: "auto"    // Protection auto
                    }
                });

                if (result) {
                    alert("🦅 TRANSACTION RÉUSSIE ! L'Aigle d'Or est à toi !");
                    currentSkin = img;
                    eagle.src = img;
                    document.querySelectorAll('.shop-item').forEach(el => el.classList.remove('selected'));
                    element.classList.add('selected');
                }
            } else {
                alert("Ouvre le jeu dans Warpcast pour acheter ce skin !");
            }
        } catch (err) {
            console.error(err);
            alert("Paiement annulé.");
        }
    }
    // 2. Cas du Skin GOLD (Paiement Réel 0.01 SOL)
    if (img === '1000009509.png') {
        try {
            // On vérifie si on est bien dans l'environnement Farcaster
            if (window.farcaster && window.farcaster.sdk) {
                
                // On lance la transaction via le wallet intégré de l'utilisateur
                // Montant : 0.01 SOL (soit ~2$) vers ton adresse
                const result = await window.farcaster.sdk.actions.sendTransaction({
                    chainId: "eip155:10", // Standard pour les transactions via le SDK
                    method: "eth_sendTransaction", 
                    params: {
                        to: "GU5dNvMQKoUiVJvZ5HUgrv3CxtrR5ujxfHK2HPT6Z6bV",
                        value: "10000000000000000" // Équivalent technique de 0.01 SOL
                    }
                });

                // Si la transaction est validée par le wallet
                if (result) {
                    alert("🦅 TRANSACTION RÉUSSIE ! L'Aigle d'Or est à toi !");
                    currentSkin = img;
                    eagle.src = img;
                    document.querySelectorAll('.shop-item').forEach(el => el.classList.remove('selected'));
                    element.classList.add('selected');
                }
            } else {
                alert("Ouvre le jeu dans Warpcast pour acheter ce skin avec ton Wallet !");
            }
        } catch (err) {
            console.error(err);
            alert("Paiement annulé. L'aigle reste au nid !");
        }
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
        saveFinalScore(score); // <--- AJOUTE CETTE LIGNE ICI
        location.reload();
        }
    }
    requestAnimationFrame(update);
}
// --- 🏆 LOGIQUE DU LEADERBOARD & IDENTITÉ ---

let playerName = "Aigle Anonyme";

// 1. Récupère le nom du joueur Farcaster au démarrage
async function loadFarcasterUser() {
    if (window.farcaster && window.farcaster.sdk) {
        try {
            const context = await window.farcaster.sdk.context;
            if (context && context.user) {
                playerName = context.user.displayName || context.user.username;
                // Met à jour l'affichage en haut de l'écran
                const display = document.getElementById('score-display');
                if(display) display.innerText = `ALTITUDE : 0m | PILOTE : ${playerName}`;
            }
        } catch (e) { console.error("Erreur SDK:", e); }
    }
}
loadFarcasterUser();

// 2. Affiche la fenêtre du classement
function showLeaderboard() {
    const modal = document.getElementById('leaderboard-modal');
    const list = document.getElementById('leaderboard-list');
    modal.style.display = 'block';
    
    const myRecord = localStorage.getItem('eagleHighScore') || 0;
    
    // Simulation du Top (en attendant une base de données réelle)
    list.innerHTML = `
        1. @dwr.eth - 1250m<br>
        2. @vbuterin - 980m<br>
        3. <span style="color:#FFD700">TOI (${playerName}) - ${myRecord}m</span><br>
        4. @aigle_fan - 420m
    `;
}

// 3. Sauvegarde le score (à appeler dans ta fonction gameOver)
function saveFinalScore(score) {
    const oldRecord = localStorage.getItem('eagleHighScore') || 0;
    if (score > oldRecord) {
        localStorage.setItem('eagleHighScore', score);
        // Optionnel : Envoi au SDK Farcaster si tu as le stockage activé
        if (window.farcaster?.sdk?.actions?.setStorage) {
            window.farcaster.sdk.actions.setStorage({ key: "high_score", value: score.toString() });
        }
    }
}
// 💜 INITIALISATION FARCASTER SDK
if (window.farcaster && window.farcaster.sdk) {
    window.farcaster.sdk.actions.ready(); 
}
update();
