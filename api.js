import { CONFIG } from "./config.js";

async function safeFetch(url) {

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Accept": "application/json"
        }
    });

    if (!response.ok) {
        throw new Error("Network error");
    }

    const text = await response.text();

    if (!text || text.includes("Verifying")) {
        throw new Error("Bot protection block detected");
    }

    return JSON.parse(text.trim());
}

export async function getGroups(bruuid) {

    return await safeFetch(
        `${CONFIG.API_BASE}groupslinkedfetch.php?cotalnet=${CONFIG.TANET}&bruuid=${bruuid}`
    );
}

export async function getItems(bruuid, groupid) {

    return await safeFetch(
        `${CONFIG.API_BASE}itemslinkedfetch.php?cotalnet=${CONFIG.TANET}&bruuid=${bruuid}&groupid=${groupid}`
    );
}

export async function getCompany() {

    return await safeFetch(
        `${CONFIG.API_BASE}company.php?cotalnet=${CONFIG.TANET}`
    );
}