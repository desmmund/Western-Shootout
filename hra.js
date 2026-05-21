const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
let player = {x: 50, y: 150, width: 20, height: 40, speed: 5};
let enemy = { x: 730, y: 150, width: 20, height: 40, speed: 3};
let playerimg = new Image();
playerimg.src = "Playerosekane1.png";
let enemyimg = new Image();
enemyimg.src = "Enemyosekane1.png";
let bullets = [];
let enemybullets = [];
let enbulletspeed = 10;
let keys={};
let backgroundImg = new Image();
backgroundImg.src = "Gamepicture.jpg";
let playerhp = 3;
let enemyhp = 10;
let heart = new Image();
heart.src = "test.png";
let gameover = false;
let winner = "";
let minulastrela = 0;
let cooldown = 1000;
let music = new Audio("mainmusic.mp3"); music.loop = true;
let shootsound = new Audio("Shoot.mp3");
let rage = new Audio("Enrage.mp3");
let rageplayed= false
let playerhurt = new Audio("playerhurt.mp3")
let enemyhurt = new Audio("enemyhurt.mp3")
let enemyhurtfinal = new Audio("enemyhurtfinal.MP3")
function drawRect(x, y, w, h) {
    ctx.fillStyle = "black";
    ctx.fillRect(x, y, w, h);
}

function gameLoop() {
    ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
    if (!gameover){
        ctx.imageSmoothingEnabled = false;
        //drawRect(player.x, player.y, player.width, player.height);
        //drawRect(enemy.x, enemy.y, enemy.width, enemy.height);
        ctx.drawImage(playerimg, player.x, player.y, 40, 40);
        ctx.drawImage(enemyimg, enemy.x, enemy.y, 40, 40);
        mobility();
        moveEnemy();

        spawnbullets();
        bulletmovement();
        for (let i = bullets.length - 1; i >= 0; i--) {

            if (checkcollision(bullets[i], enemy)) {
                enemyhp--;
                bullets.splice(i, 1);
                if (enemyhp!=  3 && enemyhp != 0){
                    enemyhurt.play();

                }
            }
            if (enemyhp < 1){enemyhurtfinal.play()}
            if (enemyhp <4 ){
                if (!rageplayed){rage.play()}
                enbulletspeed = 17;
                rageplayed = true;
            }
            if (enemyhp <= 0) {
                gameover = true;
                winner = "VYHRÁLI JSTE";
            }
        }
        drawHP(20,5,playerhp)
        spawnenemybullets();
        enemybulletsmovement();
        for (let i = enemybullets.length - 1; i >= 0; i--) {

            if (checkcollision(enemybullets[i], player)) {
                playerhp--;
                enemybullets.splice(i, 1);
                playerhurt.play();
            }
            if (playerhp <= 0){
                gameover = true;
                winner = "PROHRÁLI JSTE"
            }
        }
        drawHP(500,5,enemyhp)

}


    else{
        drawendscreen();
        if (gameover && keys["r"]) {
            location.reload();
        }

    }
    requestAnimationFrame(gameLoop);
}

gameLoop();
document.addEventListener("keydown", () => {
    music.play();
}, { once: true });
document.addEventListener("keydown",(movement) =>{
    keys[movement.key]=true;
    });
document.addEventListener("keyup",(movement) =>{
    keys[movement.key]=false;
    });

function mobility(){
    if (keys["ArrowUp"]){
        player.y -= player.speed
    }
    if (keys["ArrowDown"]){
        player.y += player.speed
    }
    if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
    }

    if (player.y < 0) {
        player.y = 0;
    }
}
function moveEnemy() {

    let diff = player.y - enemy.y;

    let followStrength = 0.015; // slabé sledování

    let randomMove = (Math.random() - 0.5) * 8; // silnější chaos

    enemy.y += diff * followStrength + randomMove;

    // hranice
    if (enemy.y < 0) enemy.y = 0;
    if (enemy.y + enemy.height > canvas.height) {
        enemy.y = canvas.height - enemy.height;
    }
}




function shoot() {
    bullets.push({x: player.x + player. width, y: player.y + player.height /2, width: 10, height: 10, speed: 7});
    shootsound.currentTime = 0;
    shootsound.play();
}
function fire(press){
    let moment = Date.now();

    if (press.key === "e" && moment - minulastrela > cooldown ){
        shoot()
        minulastrela = moment;
    }
}
function globalbulletmovement(bullets) {
    bullets.x += bullets.speed;
}
function bulletmovement (){

    bullets.forEach(globalbulletmovement)
}
document.addEventListener("keydown", fire);
function drawbullet(bullets) {
    drawRect(bullets.x, bullets.y, bullets.width, bullets.height)
}
function spawnbullets(){
    bullets.forEach(drawbullet);
}

function enemyshoot() {
    enemybullets.push({x: enemy.x, y: enemy.y + enemy.height /2 , width: 10, height: 10, speed: enbulletspeed});

}
function enemyfire(){
    let tr = Math.random()
    if (tr >0.2){
        enemyshoot();
    }
}
setInterval(enemyfire,500)
function drawnemeybullets(enemybullets){
    drawRect(enemybullets.x,enemybullets.y, enemybullets.width, enemybullets.height)
}

function globalenemybulletmovement(enemybullets){
    enemybullets.x -= enemybullets.speed;
}
function enemybulletsmovement() {
    enemybullets.forEach(globalenemybulletmovement)
}
function spawnenemybullets(){
    enemybullets.forEach(drawnemeybullets)
}

function checkcollision(a,b){
    return  a.x + a.width >= b.x &&
            a.x <= b.x +b.width &&
            a.y <= b.y +b.height &&
            a.y +a.height >= b.y

}
function drawHP(x, y, hp) {
    for (let i = 0; i < hp; i++) {
        ctx.drawImage(heart, x + i * 30, y, 20, 20);
    }
}
function drawendscreen() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.font = "60px Arial";
    ctx.textAlign = "center";

    ctx.fillText(winner, canvas.width / 2, canvas.height / 2);
    ctx.font = "30px Arial";
    ctx.fillText("zmáčkněte r na restart hry", canvas.width / 2, canvas.height / 2 + 50);
}
