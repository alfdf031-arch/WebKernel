import * as THREE from "three";

import {
    createPhysics,
    createPlayerBody
} from "./physics.js";

import { Controls } from "./controls.js";

const canvas =
    document.getElementById("gameCanvas");

const scoreElement =
    document.getElementById("score");

const timeElement =
    document.getElementById("time");

const levelElement =
    document.getElementById("level");

const messageElement =
    document.getElementById("message");

const startButton =
    document.getElementById("startButton");


/* =========================
   Renderer
========================= */

const renderer =
    new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        powerPreference: "high-performance"
    });

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
);

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

renderer.shadowMap.enabled = true;


/* =========================
   Scene
========================= */

const scene =
    new THREE.Scene();

scene.background =
    new THREE.Color(0x030712);

scene.fog =
    new THREE.Fog(
        0x030712,
        20,
        100
    );


/* =========================
   Camera
========================= */

const camera =
    new THREE.PerspectiveCamera(
        70,
        window.innerWidth /
        window.innerHeight,
        0.1,
        200
    );

camera.position.set(
    0,
    5,
    10
);


/* =========================
   Lighting
========================= */

const ambient =
    new THREE.HemisphereLight(
        0x88ccff,
        0x111122,
        2
    );

scene.add(ambient);

const directional =
    new THREE.DirectionalLight(
        0xffffff,
        3
    );

directional.position.set(
    10,
    20,
    10
);

directional.castShadow = true;

scene.add(directional);


/* =========================
   Physics
========================= */

const physics =
    createPhysics();

const playerBody =
    createPlayerBody(
        physics.playerMaterial
    );

physics.world.addBody(playerBody);


/* =========================
   Player
========================= */

const playerGeometry =
    new THREE.SphereGeometry(
        0.6,
        24,
        24
    );

const playerMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x00eaff,
        emissive: 0x006677,
        roughness: 0.25,
        metalness: 0.5
    });

const playerMesh =
    new THREE.Mesh(
        playerGeometry,
        playerMaterial
    );

playerMesh.castShadow = true;

scene.add(playerMesh);


/* =========================
   Ground
========================= */

const groundGeometry =
    new THREE.BoxGeometry(
        60,
        1,
        60
    );

const groundMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x101827,
        roughness: 0.8,
        metalness: 0.1
    });

const groundMesh =
    new THREE.Mesh(
        groundGeometry,
        groundMaterial
    );

groundMesh.receiveShadow = true;

groundMesh.position.y = -0.5;

scene.add(groundMesh);


/* =========================
   Grid
========================= */

const grid =
    new THREE.GridHelper(
        60,
        60,
        0x00aaff,
        0x123040
    );

grid.position.y = 0.01;

scene.add(grid);


/* =========================
   Energy Objects
========================= */

const energyObjects = [];

function createEnergy() {

    const geometry =
        new THREE.IcosahedronGeometry(
            0.35,
            1
        );

    const material =
        new THREE.MeshStandardMaterial({
            color: 0x00ffff,
            emissive: 0x00ffff,
            emissiveIntensity: 3,
            metalness: 0.3,
            roughness: 0.2
        });

    for (let i = 0; i < 15; i++) {

        const energy =
            new THREE.Mesh(
                geometry,
                material.clone()
            );

        energy.position.set(
            THREE.MathUtils.randFloat(
                -20,
                20
            ),
            THREE.MathUtils.randFloat(
                0.8,
                2.5
            ),
            THREE.MathUtils.randFloat(
                -20,
                20
            )
        );

        energy.userData.collected = false;

        scene.add(energy);

        energyObjects.push(energy);
    }
}

createEnergy();


/* =========================
   Obstacles
========================= */

function createObstacles() {

    const material =
        new THREE.MeshStandardMaterial({
            color: 0x7c3aed,
            emissive: 0x25005a,
            emissiveIntensity: 1
        });

    for (let i = 0; i < 18; i++) {

        const size =
            THREE.MathUtils.randFloat(
                1,
                3
            );

        const geometry =
            new THREE.BoxGeometry(
                size,
                size,
                size
            );

        const obstacle =
            new THREE.Mesh(
                geometry,
                material
            );

        obstacle.position.set(
            THREE.MathUtils.randFloat(
                -22,
                22
            ),
            size / 2,
            THREE.MathUtils.randFloat(
                -22,
                22
            )
        );

        obstacle.rotation.y =
            Math.random() * Math.PI;

        obstacle.castShadow = true;

        obstacle.receiveShadow = true;

        scene.add(obstacle);
    }
}

createObstacles();


/* =========================
   Controls
========================= */

const controls =
    new Controls();


/* =========================
   Game State
========================= */

let score = 0;

let level = 1;

let timeLeft = 60;

let running = false;

let lastTime = performance.now();


/* =========================
   Start
========================= */

startButton.addEventListener(
    "click",
    startGame
);

function startGame() {

    score = 0;

    level = 1;

    timeLeft = 60;

    running = true;

    scoreElement.textContent = score;

    timeElement.textContent =
        Math.ceil(timeLeft);

    levelElement.textContent = level;

    startButton.style.display =
        "none";

    messageElement.style.opacity =
        "0";

    playerBody.position.set(
        0,
        2,
        5
    );

    playerBody.velocity.set(
        0,
        0,
        0
    );

    for (const energy of energyObjects) {

        energy.userData.collected =
            false;

        energy.visible = true;
    }
}


/* =========================
   Collect Energy
========================= */

function checkEnergy() {

    const playerPosition =
        playerMesh.position;

    for (const energy of energyObjects) {

        if (
            energy.userData.collected
        ) {
            continue;
        }

        const distance =
            playerPosition.distanceTo(
                energy.position
            );

        if (distance < 1.4) {

            energy.userData.collected =
                true;

            energy.visible = false;

            score += 10;

            scoreElement.textContent =
                score;

            if (
                score >= level * 50
            ) {

                level++;

                levelElement.textContent =
                    level;

                timeLeft += 10;
            }
        }
    }
}


/* =========================
   Player Movement
========================= */

function updatePlayer() {

    controls.update();

    const speed =
        7 + level * 0.3;

    let x = 0;
    let z = 0;

    if (controls.forward) {
        z -= 1;
    }

    if (controls.backward) {
        z += 1;
    }

    if (controls.left) {
        x -= 1;
    }

    if (controls.right) {
        x += 1;
    }

    const length =
        Math.hypot(x, z);

    if (length > 0) {

        x /= length;
        z /= length;

        playerBody.velocity.x =
            x * speed;

        playerBody.velocity.z =
            z * speed;

    } else {

        playerBody.velocity.x *= 0.85;
        playerBody.velocity.z *= 0.85;
    }

    if (
        controls.consumeJump() &&
        Math.abs(playerBody.velocity.y) < 1
    ) {

        playerBody.velocity.y = 8;
    }
}


/* =========================
   Camera
========================= */

function updateCamera() {

    const target =
        new THREE.Vector3(
            playerMesh.position.x,
            playerMesh.position.y + 2,
            playerMesh.position.z + 8
        );

    camera.position.lerp(
        target,
        0.08
    );

    camera.lookAt(
        playerMesh.position
    );
}


/* =========================
   Animation
========================= */

function animateEnergy(time) {

    for (const energy of energyObjects) {

        if (!energy.visible) {
            continue;
        }

        energy.rotation.x += 0.02;

        energy.rotation.y += 0.03;

        energy.position.y +=
            Math.sin(
                time * 0.003 +
                energy.position.x
            ) * 0.002;
    }
}


/* =========================
   Game Loop
========================= */

function loop(now) {

    requestAnimationFrame(loop);

    const delta =
        Math.min(
            (now - lastTime) / 1000,
            0.05
        );

    lastTime = now;

    animateEnergy(now);

    if (running) {

        updatePlayer();

        physics.world.step(
            1 / 60,
            delta,
            3
        );

        playerMesh.position.copy(
            playerBody.position
        );

        checkEnergy();

        timeLeft -= delta;

        timeElement.textContent =
            Math.max(
                0,
                Math.ceil(timeLeft)
            );

        if (timeLeft <= 0) {

            gameOver();
        }
    }

    updateCamera();

    renderer.render(
        scene,
        camera
    );
}

requestAnimationFrame(loop);


/* =========================
   Game Over
========================= */

function gameOver() {

    running = false;

    startButton.textContent =
        `انتهت اللعبة — النتيجة ${score}`;

    startButton.style.display =
        "block";

    messageElement.textContent =
        "اضغط للعب مرة أخرى";

    messageElement.style.opacity =
        "1";
}


/* =========================
   Resize
========================= */

window.addEventListener(
    "resize",
    () => {

        camera.aspect =
            window.innerWidth /
            window.innerHeight;

        camera.updateProjectionMatrix();

        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );

        renderer.setPixelRatio(
            Math.min(
                window.devicePixelRatio,
                2
            )
        );
    }
);
