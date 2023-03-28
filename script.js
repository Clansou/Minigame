// Constants
const GAME_DURATION = 30; // seconds
const OBJECT_FALL_SPEED = 1; // pixels per frame
const OBJECT_SPAWN_DELAY = 800; // milliseconds
const OBJECT_SPAWN_PROBABILITY = 0.7; // probability of a new object spawning on each frame
const OBJECT_POINTS = 10; // points awarded for catching a collectible object
const OBJECT_PENALTY_POINTS = 20; // points deducted for catching a dangerous object
const OBJECT_SIZE = 50;
const GAME_HEIGHT = 800; // Change the value as needed
const BUCKET_HEIGHT = 50;
const BUCKET_TOP = GAME_HEIGHT - BUCKET_HEIGHT;


// Game variables
let score = 0;
let objects = [];
let lastSpawnTime = 0;
let gameStartTime = null;
let gameTimer = null;

// DOM elements
const scoreEl = document.getElementById('score');
const bucketEl = document.getElementById('bucket');
const spawn = document.getElementById("spawn-container")
const objectsContainerEl = document.getElementById('objects-container');

// Event listeners
bucketEl.addEventListener('mousedown', startMoveBucket);
bucketEl.addEventListener('touchstart', startMoveBucket, { passive: false });
document.addEventListener('mouseup', stopMoveBucket);
document.addEventListener('touchend', stopMoveBucket);

// Functions
function startMoveBucket(e) {
  e.preventDefault();
  bucketEl.classList.add('moving');
  document.addEventListener('mousemove', moveBucket);
  document.addEventListener('touchmove', moveBucket, { passive: false });
}

function stopMoveBucket() {
  bucketEl.classList.remove('moving');
  document.removeEventListener('mousemove', moveBucket);
  document.removeEventListener('touchmove', moveBucket);
}

function moveBucket(e) {
  e.preventDefault();
  const containerRect = objectsContainerEl.getBoundingClientRect();
  const x = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
  const relX = x - containerRect.left;
  bucketEl.style.left = `${Math.max(Math.min(relX - bucketEl.offsetWidth / 2, containerRect.width - bucketEl.offsetWidth), 0)}px`;
}

function spawnObject() {
  const object = document.createElement('div');
  object.classList.add('object');
  if (Math.random() < OBJECT_SPAWN_PROBABILITY) {
    object.classList.add('collectible');
  } else {
    object.classList.add('dangerous');
  }
  object.style.top = '-50px';
  console.log(spawn.offsetWidth)

  object.style.left = `${Math.floor(Math.random() * (spawn.offsetWidth - object.offsetWidth))}px`;
  objectsContainerEl.appendChild(object);
  objects.push(object);
  lastSpawnTime = Date.now();
}

function updateScore(points) {
  score += points;
  scoreEl.textContent = score;
}

function removeObject(object) {
  object.remove();
  objects.splice(objects.indexOf(object), 1);
}

function handleObjectFall() {
    // Loop through all objects and update their position
    bucketcollide = bucketEl.getBoundingClientRect();
    objects.forEach((obj) => {
      actualheight = parseFloat(obj.style.top)
      obj.style.top= actualheight + OBJECT_FALL_SPEED + "px";
      
      
      objcollide = obj.getBoundingClientRect();
      // Check for collision with bucket
      if (bucketcollide.bottom >= objcollide.bottom && bucketcollide.top <= objcollide.top) {
        if(bucketcollide.left<=objcollide.left && bucketcollide.right>=objcollide.right){
          console.log("cool")
          // Deduct score and remove object
          console.log(scoreEl)
          if(obj.classList.contains("collectible")){
            score += OBJECT_POINTS;
          }
          else{
            score -= OBJECT_PENALTY_POINTS
          }
          
          scoreEl.textContent = score;
          objectsContainerEl.removeChild(obj);
        }
      }
  
      // Remove object if it goes below the screen
      if (objcollide.bottom > GAME_HEIGHT) {
        objectsContainerEl.removeChild(obj);
      }
    });
  }

function handleGameEnd() {
  clearInterval(gameTimer);
  alert(`Game over! Your score is ${score}.`);
  startGame();
}

function updateTimer() {
  const elapsedSeconds = Math.floor((Date.now() - gameStartTime) / 1000);
  const remainingSeconds = GAME_DURATION - elapsedSeconds;
  if (remainingSeconds <= 0) {
    handleGameEnd();
  } else {
    document.getElementById('timer').textContent = remainingSeconds;
  }
}

function startGame() {
    // Reset game variables
    score = 0;
    objects = [];
    lastSpawnTime = 0;
    gameStartTime = null;
    
    // Clear objects container
    while (objectsContainerEl.firstChild) {
    objectsContainerEl.removeChild(objectsContainerEl.firstChild);
    }
    
    // Set up initial score and timer display
    scoreEl.textContent = score;
    document.getElementById('timer').textContent = GAME_DURATION;
    
    // Start game loop
    gameTimer = setInterval(() => {
    if (!gameStartTime) {
    gameStartTime = Date.now();
    }
    if (Date.now() - lastSpawnTime > OBJECT_SPAWN_DELAY) {
    spawnObject();
    }
    handleObjectFall();
    updateTimer();
    }, 1); // frames per second
    }
    
    // Start the game
startGame();
