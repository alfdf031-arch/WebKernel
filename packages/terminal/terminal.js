/**
 * Wail Package: terminal
 * WebKernel API v1
 */

(function () {
    "use strict";

    const terminalPackage = {
        name: "terminal",
        version: "1.0.0",

        commands: {

            hello(args = []) {
                const name = args.join(" ") || "WebKernel";
                return `Hello ${name}!`;
            },

            clear() {
                return {
                    type: "terminal",
                    action: "clear"
                };
            },

            sysinfo() {
                return [
                    "WebKernel System Information",
                    "----------------------------",
                    `Platform : ${navigator.platform}`,
                    `Language : ${navigator.language}`,
                    `Online   : ${navigator.onLine}`,
                    `Memory   : ${
                        navigator.deviceMemory
                            ? navigator.deviceMemory + " GB"
                            : "unknown"
                    }`
                ].join("\n");
            }
        }
    };

    /*
     * WebKernel package registration
     */
    if (
        typeof globalThis !== "undefined" &&
        globalThis.kernel &&
        globalThis.kernel.terminal &&
        typeof globalThis.kernel.terminal.registerCommand === "function"
    ) {
        for (const [name, command] of Object.entries(
            terminalPackage.commands
        )) {
            globalThis.kernel.terminal.registerCommand(
                name,
                command
            );
        }
    }

    globalThis.WailTerminalPackage = terminalPackage;

})();
