export function renderGroups(groups, lang, onClick) {
    const container = document.getElementById("groups2");

    if (!container) return;

    container.innerHTML = "";

    groups.forEach(group => {

        const div = document.createElement("div");

        div.className = "category-item";
        div.textContent =
            lang === "ar" ? group.groupName1 : group.groupName2;

        div.onclick = () => onClick(group.groupID);

        container.appendChild(div);
    });
}

export function renderItems(items, lang) {

    const container = document.getElementById("groups");

    if (!container) return;

    container.innerHTML = "";

    items.forEach(item => {

        const card = document.createElement("div");

        card.className = "menu-item bg-white rounded-xl shadow-md overflow-hidden";

        card.innerHTML = `
            <img src="${item.itemImagePath}" class="w-full h-40 object-cover"/>

            <div class="p-4 space-y-2">
                <h3 class="font-bold text-lg">
                    ${lang === "ar" ? item.itemName1 : item.itemName2}
                </h3>

                <p class="text-sm text-gray-600">
                    ${lang === "ar" ? item.itemDescAr : item.itemDescEn}
                </p>

                <div class="flex justify-between text-sm">
                    <span>
                        💰 ${item.itemPrice}
                    </span>

                    <span>
                        🔥 ${item.itemCal}
                    </span>
                </div>
            </div>
        `;

        container.appendChild(card);
    });
}