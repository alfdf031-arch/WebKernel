import * as CANNON from "https://cdn.jsdelivr.net/npm/cannon-es@0.20.0/+esm";

export function createPhysics() {

    const world = new CANNON.World();

    world.gravity.set(0, -18, 0);

    world.broadphase = new CANNON.SAPBroadphase(world);

    world.allowSleep = true;

    const groundMaterial = new CANNON.Material("ground");

    const playerMaterial = new CANNON.Material("player");

    const contact = new CANNON.ContactMaterial(
        playerMaterial,
        groundMaterial,
        {
            friction: 0.4,
            restitution: 0
        }
    );

    world.addContactMaterial(contact);

    const groundBody = new CANNON.Body({
        mass: 0,
        material: groundMaterial,
        shape: new CANNON.Box(
            new CANNON.Vec3(30, 0.5, 30)
        )
    });

    groundBody.position.set(0, -0.5, 0);

    world.addBody(groundBody);

    return {
        world,
        groundBody,
        playerMaterial
    };
}

export function createPlayerBody(playerMaterial) {

    const shape = new CANNON.Sphere(0.6);

    const body = new CANNON.Body({
        mass: 5,
        material: playerMaterial,
        shape
    });

    body.position.set(0, 2, 5);

    body.linearDamping = 0.1;

    body.angularDamping = 1;

    return body;
}
