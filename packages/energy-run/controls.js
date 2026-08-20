import nipplejs from "https://cdn.jsdelivr.net/npm/nipplejs@0.10.2/+esm";

export class Controls {

    constructor() {

        this.forward = false;
        this.backward = false;

        this.left = false;
        this.right = false;

        this.jump = false;

        this.joystickX = 0;
        this.joystickY = 0;

        this.keys = new Set();

        this.setupKeyboard();

        this.setupJoystick();

        this.setupJump();
    }

    setupKeyboard() {

        window.addEventListener("keydown", (event) => {

            this.keys.add(event.code);

            if (
                event.code === "Space" ||
                event.code === "ArrowUp"
            ) {
                this.jump = true;
            }

        });

        window.addEventListener("keyup", (event) => {

            this.keys.delete(event.code);

        });
    }

    setupJoystick() {

        const zone = document.getElementById("joystick");

        if (!zone) return;

        const joystick = nipplejs.create({
            zone,
            mode: "static",
            position: {
                left: "50%",
                top: "50%"
            },
            color: "cyan",
            size: 110
        });

        joystick.on("move", (_, data) => {

            if (!data.vector) return;

            this.joystickX = data.vector.x;
            this.joystickY = data.vector.y;

        });

        joystick.on("end", () => {

            this.joystickX = 0;
            this.joystickY = 0;

        });
    }

    setupJump() {

        const button =
            document.getElementById("jumpButton");

        if (!button) return;

        button.addEventListener("pointerdown", () => {

            this.jump = true;

        });
    }

    update() {

        this.forward =
            this.keys.has("KeyW") ||
            this.keys.has("ArrowUp") ||
            this.joystickY > 0.25;

        this.backward =
            this.keys.has("KeyS") ||
            this.keys.has("ArrowDown") ||
            this.joystickY < -0.25;

        this.left =
            this.keys.has("KeyA") ||
            this.keys.has("ArrowLeft") ||
            this.joystickX < -0.25;

        this.right =
            this.keys.has("KeyD") ||
            this.keys.has("ArrowRight") ||
            this.joystickX > 0.25;
    }

    consumeJump() {

        if (!this.jump) return false;

        this.jump = false;

        return true;
    }
}
