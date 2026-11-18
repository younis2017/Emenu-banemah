import { getGroups, getItems } from "./api.js";
import { renderGroups, renderItems } from "./renderer.js";
import { CONFIG } from "./config.js";

const urlParams = new URLSearchParams(window.location.search);
const bruuid = urlParams.get("bruuid") || "1";

let lang = "ar";

async function loadMenu() {

    try {

        const groups = await getGroups(bruuid);

        renderGroups(groups, lang, async groupId => {

            const items = await getItems(bruuid, groupId);

            renderItems(items, lang);
        });

        if (groups.length > 0) {

            const items = await getItems(bruuid, groups[0].groupID);

            renderItems(items, lang);
        }

    } catch (error) {
        console.error("Menu Load Error:", error);
    }
}

document.addEventListener("DOMContentLoaded", loadMenu);