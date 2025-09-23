  
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;



        
        let mycoins = 0, jumpedCows = 0, highestSteps = 0, gameCoin = 0;
        let gameRunning = false;
        let animationFrameId;
        const grounds = 20;
        let cowSpawnChance = 0.3;
        let isGameOver = false;
        loadCoins();

      var menuSound = new Audio('effects/menu.mp3');
        menuSound.volume = 0.2;
        menuSound.loop = true;
        try{ menuSound.play(); } catch(e) { consosle.log(e); }

        var btnClickSound = new Audio('effects/btn.mp3');
        btnClickSound.volume = 0.1;
        btnClickSound.loop = false;

        var bgSound = new Audio('effects/bg1.mp3');
        bgSound.volume = 0.1;
        bgSound.loop = true;
        
        

        var purchaseSound = new Audio('effects/purchase.mp3');
        purchaseSound.volume = 0.1;
        purchaseSound.loop = false;


        var jumpSound = new Audio('effects/jump.mp3'); 
        jumpSound.volume = 0.1;
        jumpSound.loop = false; 
        var coinSound = new Audio('effects/coin.mp3'); 
        coinSound.volume = 0.1;
        coinSound.loop = false; 
        var gameOverSound = new Audio('effects/over.mp3');
        gameOverSound.volume = 0.1;
        gameOverSound.loop = false;
 var loadedImages = [];
        function loadRes(){
        var mychar = localStorage.getItem('mychar') ? localStorage.getItem('mychar') : 'img/character.png';
        var images = [
                       'img/ground.png', mychar, 
                       'img/cloud1.png','img/cloud2.png',
                       'img/cloud3.png','img/tree.png',
                       'img/tree1.png', 'img/mground.png',
                       'img/coin.gif', 'img/cow.png',
                       'img/shield.png'
                     ];
       
        let loaded = 0;
        const totalImages = images.length;
        images.forEach((src, idx)=> {
            const img = new Image();
            img.src = src;
            img.onload = () => {
                loaded++;
                loadedImages[idx] = img;
                if (loaded === totalImages) {
                    init();
                }
            };
        });

    }
    loadRes();
        
        let coinsSetting = {
            width: 30,
            height: 30, 
        };

      

        let coins = [];

      
        
        


        function initCoins() {
            coins.length = 0;
            for (let i = 0; i < 2; i++) {
                const coin = {
                    x: Math.random() * 100,
                    y: canvas.height - 100,
                    width: coinsSetting.width,
                    height: coinsSetting.height,
                    image: coinsSetting.image
                };
                coins.push(coin);
            }
        }
      
        

        const player = {
            x: 50,
            y: canvas.height - 100,
            width: 40,
            height: 40,
            speedY: 20,
            jumpForce: -15,
            gravity: 0.5,
            onGround: false
        };

        


        const clouds = [];
        const cloudSettings = { 
            width: 100,
            height: 60,
            speed: 1,
        };
       
        

        function initClouds() {
            clouds.length = 0;
            for (let i = 0; i < 10; i++) {
                const cloud = {
                    x: Math.random()  * canvas.width,
                    y: 100 + Math.random() * canvas.height /2,
                    width: cloudSettings.width + Math.random() * 50,
                    height: cloudSettings.height,
                    speed: cloudSettings.speed + Math.random() * 0.5,
                    image: loadedImages[2 + Math.floor(Math.random() * 3)] // Randomly select a cloud image
                };
                clouds.push(cloud);
            }
        }
       
        



        function updateClouds() {
            clouds.forEach(cloud => {
                cloud.x -= cloud.speed;
                if (cloud.x + cloud.width < 0) {
                    cloud.x = canvas.width + Math.random() * 100;
                    cloud.y = Math.random() * 100;
                }
            });
        }

      
        function drawClouds() {
            clouds.forEach(cloud => {
                ctx.save();
                ctx.globalAlpha = 0.7; 
                
                ctx.drawImage(cloud.image, cloud.x, cloud.y, cloud.width, cloud.height);
                ctx.restore();
            });
        }
        



        const platforms = [];
        const platformSettings = {
            width: 120,
            height: 60,
            gap: 0,
            speed: 5,
        
        };

          let protectionCount = 1;

        let protectionSetting = {
            width: 30,
            height: 30, 
            x: canvas.width + 500,
            y: canvas.height - platformSettings.height - 30 - Math.random() * 200,
        };

       
        
          const treeSettings = {       
                width: 170,
                height: 230,
                x: canvas.width,
                y: canvas.height - 230 - platformSettings.height + 5
            };

        let cows = [];
        const cowsSettings = {
            width: 100,
            height: 60,
             x: canvas.width - 200,
            y: canvas.height - 100 - this.height,
            gap: 400 + Math.random() * 200,
            image: loadedImages[9]
            
        };

       
     

           

         document.getElementById('shieldCount').textContent = `${protectionCount}`;
             
        function initPlatforms() {
            platforms.length = 0;
            
            // Starting  (ground)
          /*  platforms.push({
                x: 0,
                y: canvas.height - platformSettings.height,
                width: canvas.width,
                height: platformSettings.height,
                passed: true
            });*/
          
            // Add initial ground
            let lastX = canvas.width;
            for (let i = 0; i < grounds; i++) {
                const platform = {
                    /*
                    x: lastX - Math.random() * 20,
                    y: canvas.height - 100 - (Math.random() * 130),*/
                    x: i * platformSettings.width,
                    y: canvas.height - platformSettings.height ,
                    width: platformSettings.width + Math.random() * 20,
                    height: platformSettings.height,
                     passed: false
                };

               

                 if(Math.random() < 0.5) {
                 const coin = {
                    x: platform.x + platform.width / 2 - coinsSetting.width / 2,
                    y: platform.y - coinsSetting.height - 10,
                    width: coinsSetting.width,
                    height: coinsSetting.height,
                    image: loadedImages[8]
                };
                coins.push(coin);

            }

               
                platforms.push(platform);
                
                lastX += platformSettings.gap + Math.random() * 100;
            }
            //add 5 initial cows
            for(let i=0; i<5; i++) {
                const cow = {
                    x: canvas.width + ((i+1) * (cowsSettings.gap + Math.random() * 200)),
                    y: canvas.height - platformSettings.height - cowsSettings.height, // Position on the ground
                    width: cowsSettings.width,
                    height: cowsSettings.height,
                    image: loadedImages[9]
                };
                cows.push(cow);
            }

        }

        

       
    function drawPlayer() {
         
            ctx.save();
                ctx.globalAlpha = 0.35; 
                ctx.fillStyle = "#222";
                ctx.beginPath();
                ctx.ellipse(
                    player.x + player.width / 2,           
                    player.y + player.height - 5,         
                    player.width * 0.4,                    
                    player.height * 0.18,                 
                    0, 0, Math.PI * 2
                );
     ctx.fill();
     ctx.restore();
              ctx.drawImage(loadedImages[5], treeSettings.x + 5, treeSettings.y , treeSettings.width, treeSettings.height); // Draw ground
 
            ctx.drawImage(loadedImages[1], player.x, player.y , player.width, player.height);
          //draw protectoin
          ctx.drawImage(loadedImages[10], protectionSetting.x, protectionSetting.y , protectionSetting.width, protectionSetting.height);

       
        }

 
        function drawPlatforms() {
            platforms.forEach((platform, idx) => {
                ctx.fillStyle = platform.color;
                if(idx === 0) {
                    ctx.drawImage(loadedImages[7], platform.x, platform.y, platform.width, platform.height); // Draw ground
                } else {
                ctx.drawImage(loadedImages[0], platform.x, platform.y, platform.width, platform.height);
         }
         });
        }

        function drawCoins() {
            coins.forEach(coin => {
                ctx.drawImage(coin.image, coin.x, coin.y, coin.width, coin.height);
            });
        }

        function drawCows(){
            cows.forEach(cow => {
                ctx.drawImage(cow.image, cow.x, cow.y, cow.width, cow.height);
            });

        }

       
function checkCollision() {
    player.onGround = false;

    // Check collision with platforms
    platforms.forEach(platform => {
        if (
            player.x < platform.x + platform.width &&
            player.x + player.width > platform.x &&
            player.y + player.height >= platform.y &&
            player.y + player.height <= platform.y + platform.height / 2 &&
            player.speedY >= 0
        ) {
            // Land on platform
            player.y = platform.y - player.height;
            player.speedY = 0;
            player.onGround = true;
        }
    });

    // Check protection collection
    if (
        player.x < protectionSetting.x + protectionSetting.width &&
        player.x + player.width > protectionSetting.x &&
        player.y < protectionSetting.y + protectionSetting.height &&
        player.y + player.height > protectionSetting.y
    ) {
        protectionSetting.x = canvas.width * 3 + Math.random() * 1000; // Move protection off-screen
        protectionCount += 1;

        // Play protection collection sound
        purchaseSound.currentTime = 0;
        purchaseSound.play();
        document.getElementById('shieldCount').textContent = `${protectionCount}`;
    }

    // Check collision with cows
    cows.forEach(cow => {
        if (
            player.x < cow.x + cow.width &&
            player.x + player.width > cow.x &&
            player.y < cow.y + cow.height &&
            player.y + player.height > cow.y
        ) {
            // Collision detected
            if (protectionCount > 0) {
                protectionCount -= 1;
                document.getElementById('shieldCount').textContent = `${protectionCount}`;

                // Move the cow off-screen to avoid multiple collisions
                cow.x = -cow.width;
            } else if (!isGameOver) {
                isGameOver = true; // Prevent multiple game-over calls
                gameOver();
            }
        }
    });

    // Collect coins and remove them after collection
    coins = coins.filter(coin => {
        const collected =
            player.x < coin.x + coin.width &&
            player.x + player.width > coin.x &&
            player.y < coin.y + coin.height &&
            player.y + player.height > coin.y;
        if (collected) {
            mycoins += 1;
            gameCoin += 1;
            document.getElementById('scoreDisplay').textContent = `${mycoins}`;
            coinSound.currentTime = 0;
            coinSound.play();
        }
        return !collected; // Keep only coins NOT collected
    });
}

       
        function update() {
            //fill brown soil
            ctx.fillStyle = "#89400cff";

            ctx.fillRect(0, canvas.height - platformSettings.height + 20, canvas.width, platformSettings.height);
            
             //move protection
            protectionSetting.x -= platformSettings.speed; 

          //increase platform speed over time
            if(jumpedCows % 100 == 0) {
                platformSettings.speed += 0.01  ;
                if(cowSpawnChance < 0.7) {
                    cowSpawnChance += 0.05;
                }
            }


             
                treeSettings.x -= platformSettings.speed * 0.5; // Move tree slower for parallax effect
           
            platforms.forEach((platform, index) => {


                platform.x -= platformSettings.speed;
            
                
                    
                if(treeSettings. x + treeSettings.width < 0) {
                    treeSettings.x = canvas.width + Math.random() * 400;
                        }
                    
                if (platform.x + platform.width < 0 && index !== 0) {
                    platforms.splice(index, 1);
//Add og new ground
                    const lastPlatform = platforms[platforms.length - 1];

                    const newPlatform = {
                    x: lastPlatform.x + platformSettings.width,
                    y: canvas.height - platformSettings.height ,
                           width: platformSettings.width,
                        height: platformSettings.height,
                       passed: false
                    };

                    if(Math.random() < 0.7) {
                    const coin = {
                    x: newPlatform.x + newPlatform.width / 2 - coinsSetting.width / 2,
                    y: newPlatform.y - coinsSetting.height - 10,
                    width: coinsSetting.width,
                    height: coinsSetting.height,
                    image: loadedImages[8]
                };
                coins.push(coin);
            }

                    platforms.push(newPlatform);
                }
                
                // Check if player passed platform
                if (!platform.passed && player.x > platform.x + platform.width) {
                    platform.passed = true;
                   
                    document.getElementById('myscore').textContent = `${jumpedCows}`;
                    document.getElementById('scoreDisplay').textContent = `${mycoins}`;
                }
            });

            //Add cow when last cow is far enough
            if (cows.length === 0 || (cows[cows.length - 1].x < canvas.width - cowsSettings.gap)) {
                const cow = {
                    x: canvas.width + Math.random() * 300,
                    y: canvas.height - platformSettings.height - cowsSettings.height, // Position on the ground
                    width: cowsSettings.width,
                    height: cowsSettings.height,
                    image: loadedImages[9]
                };
                cows.push(cow);

            }

            
            // Apply gravity
            if (!player.onGround) {
                player.speedY += player.gravity;
                player.y += player.speedY;
            }
            
            // Check if player falls off bottom
            if (player.y > canvas.height) {
                gameOver();
            }
            
            coins.forEach(coin => {
                coin.x -= platformSettings.speed;
              
        });
            coins = coins.filter(coin => coin.x + coin.width >= 0);

  
           //remove when off screen
              cows.forEach(cow => {
                cow.x -= platformSettings.speed;

                if(cow.x + cow.width < 0) {
                    cows.splice(cows.indexOf(cow), 1);
                    jumpedCows++;
                }

                
        });
            cows = cows.filter(cow => cow.x + cow.width >= 0);


          

            checkCollision();
        }

       
        function gameOver() {
              

            gameOverSound.currentTime = 0; 
            gameOverSound.play();
            protectionCount = 1;
            bgSound.pause();
            platformSettings.speed = 5;
            cowSpawnChance = 0.3;

            gameRunning = false;
            cancelAnimationFrame(animationFrameId);

           cows = [];
           
            var tmpC = gameCoin + jumpedCows;
            var rrr = `${mycoins} + ${tmpC}`;
              gameCoin += jumpedCows;
             mycoins += gameCoin; 

           document.getElementById('finalScore').textContent = tmpC > 0 ? rrr : `${mycoins}`;
            document.getElementById('gameOverOverlay').style.display = 'flex';
           // document.getElementById('gameContainer').style.display = 'none';
            document.getElementById('menu').style.display = 'none';


             localStorage.setItem('mycoins', mycoins);
            if(jumpedCows > highestSteps) {
                highestSteps = jumpedCows;   
                localStorage.setItem('highestSteps', highestSteps);

                document.getElementById('mess').textContent = `New Record!`;
            }
           
            document.getElementById('myscore').textContent = `${jumpedCows}`; 
 jumpedCows = 0;
        }

        


        function gameLoop() {
            if (!gameRunning) return;
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            update();
            updateClouds();
           
            drawClouds();
             drawPlatforms();
            drawCoins();
            drawPlayer();
            drawCows();
            animationFrameId = requestAnimationFrame(gameLoop);
        }

       
        




        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW' || e.code === 'Enter') {
                handleJump();
            }
        });
        document.addEventListener('click', handleJump());
        
        

        function handleJump() {
            
                if(menuSound.paused == true && !gameRunning && document.getElementById('menu').style.display !== 'none') {
                    menuSound.currentTime = 0;  
                    menuSound.play();
                }
                if(!gameRunning) return;
                if (!gameRunning) {
                    // Start new game
                    document.getElementById('gameOverOverlay').style.display = 'none';
                    document.getElementById('menu').style.display = 'none';
                    document.getElementById('gameContainer').style.display = 'flex';

                    gameRunning = true;
                    loadCoins();
                    document.getElementById('scoreDisplay').textContent = `${mycoins}`;
                    
                     initClouds();
                     initPlatforms();
                   
                    player.x = 50;
                    player.y = canvas.height - 100;
                    player.speedY = 0;
                    player.onGround = false;
                    gameCoin = 0;
                    jumpedCows = 0;
                    gameLoop();
                } else if (player.onGround) {
                    jumpSound.currentTime = 0; 
                    jumpSound.play();
                    player.speedY = player.jumpForce;
                    player.onGround = false;
                
            }
        }

   function init() {
    loadCoins();
      
        initClouds();
        drawClouds();
          initPlatforms();
        drawCoins();
        drawPlayer();
        drawPlatforms();
        drawCows();
   }


   function loadCoins(){
        highestSteps = localStorage.getItem('highestSteps') ? parseInt(localStorage.getItem('highestSteps')) : 0;
        localStorage.getItem('mycoins') ? mycoins = parseInt(localStorage.getItem('mycoins')) : mycoins = 0;
        document.getElementById('scoreDisplay').textContent = `${mycoins}`;
        document.getElementById('myscore').textContent = `${jumpedCows}`;
        updateMenuCoinCount(mycoins);
   }

 
 document.getElementById('restartBtn').onclick = restart;
 
 
 function restart() {
    document.getElementById('gameOverOverlay').style.display = 'none';
    document.getElementById('menu').style.display = 'none';
    document.getElementById('settingsOverlay').style.display = 'none';
   
    document.getElementById('gameContainer').style.display = 'flex';
   
    mycoins = localStorage.getItem('mycoins') ? parseInt(localStorage.getItem('mycoins')) : 0;
    document.getElementById('scoreDisplay').textContent = `${mycoins}`;
    updateMenuCoinCount(mycoins);
    initPlatforms();
    initClouds();
    player.x = 50;
    player.y = canvas.height - 100;
    player.speedY = 0;
    player.onGround = false;
    gameRunning = true;
    gameCoin = 0;
    jumpedCows = 0;
    isGameOver = false;
    
    cows = [];
    protectionCount = 1;
    document.getElementById('shieldCount').textContent = `${protectionCount}`;
   
    gameLoop();
    bgSound.currentTime = 0;

    if(menuSound.played) {
        menuSound.pause();
    }
    btnClickSound.currentTime = 0;
    btnClickSound.play();
    bgSound.play();
};


function showMenu() {
     btnClickSound.currentTime = 0;
    btnClickSound.play();

    menuSound.currentTime = 0;
    bgSound.pause();
    menuSound.play();
      document.getElementById('gameOverOverlay').style.display = 'none';

    document.getElementById('gameContainer').style.display = 'none';
    document.getElementById('menu').style.display = 'flex';
    document.getElementById('scoreDisplay').textContent = `${mycoins}`;
    updateMenuCoinCount(mycoins);
}
   


let paused = false;
let pauseFrameId = null;

document.getElementById('settingsBtn').onclick = function() {
    document.getElementById('settingsOverlay').style.display = 'flex';
    pauseGame();
};

document.getElementById('closeSettingsBtn').onclick = function() {
    document.getElementById('settingsOverlay').style.display = 'none';
  resumeGame();
};



function pauseGame() {
    paused = true;
    cancelAnimationFrame(animationFrameId);
}
function resumeGame() {
    paused = false;
    animationFrameId = requestAnimationFrame(gameLoop);
}

function updateMenuCoinCount(count) {
  document.getElementById('menuCoinCount').textContent = count;
  document.getElementById('shopCoinCount').textContent = count;
}




document.getElementById('shopBtn').onclick = function() {
  document.getElementById('shopOverlay').style.display = 'flex';
 
};
document.getElementById('closeShopBtn').onclick = function() {
  document.getElementById('shopOverlay').style.display = 'none';
};




function equip(character) {
    console.log(`Equipping character: ${character}`);
    
    const charImage = {
        default: 'img/character.png',
        c1: 'img/character1.png',
        c2: 'img/character2.png',
        c3: 'img/character3.png',   
        c4: 'img/character4.png',
        c5: 'img/character5.png',
        c6: 'img/character6.png'

    };


    if (character === 'default') {
        localStorage.setItem('mychar', charImage.default);
    } else if (mycoins >= 50 && character === 'c1') {
        mycoins -= 50;
        localStorage.setItem('mychar', charImage.c1);
    } else if (mycoins >= 100 && character === 'c2') {
        mycoins -= 100;
        localStorage.setItem('mychar', charImage.c2);
    } else if (mycoins >= 150 && character === 'c3') {
        mycoins -= 150;
        localStorage.setItem('mychar', charImage.c3);
    } else if (mycoins >= 200 && character === 'c4') {
        mycoins -= 200;
        localStorage.setItem('mychar', charImage.c4);
    }
    else if (mycoins >= 250 && character === 'c5') {
        mycoins -= 250;
        localStorage.setItem('mychar', charImage.c5);
    } else if (mycoins >= 300 && character === 'c6') {
        mycoins -= 300;
        localStorage.setItem('mychar', charImage.c6);
    } else {
        showBuyResult(false, "Not enough coins to equip this character!");
          return;
    }
    purchaseSound.currentTime = 0;
    purchaseSound.play();
    showBuyResult(true, `You have successfully equiped the ${character} character!`);
    localStorage.setItem('mycoins', mycoins);
    document.getElementById('scoreDisplay').textContent = `${mycoins}`;


updateMenuCoinCount(mycoins);
    document.getElementById('shopOverlay').style.display = 'none';
    updateMenuCoinCount(mycoins);
    loadCoins();
    loadRes();
}



function showBuyResult(success, message) {
    document.getElementById('buyResultPopup').style.display = 'flex';
    document.getElementById('buyResultTitle').textContent = success ? "Success!" : "Failed!";
    document.getElementById('buyResultTitle').style.color = success ? "#06ca6b" : "#e74c3c";
    document.getElementById('buyResultMsg').textContent = message;
}
document.getElementById('closeBuyResultBtn').onclick = function() {
    document.getElementById('buyResultPopup').style.display = 'none';
};

