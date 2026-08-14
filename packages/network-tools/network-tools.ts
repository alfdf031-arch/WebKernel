/**
 * Wail Package: network-tools
 * WebKernel API v1
 */

type KernelNetwork = {
    getOnlineStatus?: () => boolean;
    fetch?: (
        url: string,
        options?: RequestInit
    ) => Promise<Response>;
};

type KernelAPI = {
    network?: KernelNetwork;
};

declare const kernel: KernelAPI;

function isOnline(): boolean {
    if (kernel?.network?.getOnlineStatus) {
        return kernel.network.getOnlineStatus();
    }

    return navigator.onLine;
}

async function netinfo(): Promise<string> {
    const online = isOnline();

    return [
        "Network Information",
        "-------------------",
        `Status : ${online ? "online" : "offline"}`,
        `Browser: ${navigator.userAgent}`
    ].join("\n");
}

async function ping(url: string = "https://example.com"): Promise<string> {
    const start = performance.now();

    try {
        const request = kernel?.network?.fetch
            ? kernel.network.fetch(url, {
                method: "HEAD",
                cache: "no-store"
            })
            : fetch(url, {
                method: "HEAD",
                cache: "no-store"
            });

        const response = await request;
        const elapsed = Math.round(performance.now() - start);

        return [
            `PING ${url}`,
            `Status : ${response.status}`,
            `Time   : ${elapsed} ms`
        ].join("\n");
    } catch (error) {
        return `PING ${url}\nError  : Network request failed`;
    }
}

/**
 * Wail/WebKernel package interface
 */
export const packageAPI = {
    name: "network-tools",
    version: "1.0.0",

    commands: {
        netinfo,
        ping
    }
};

export default packageAPI;
