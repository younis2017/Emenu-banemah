export function renderGroups(groups, lang, onClick) {

    const container = document.getElementById("groups2");

    if (!container || !groups) return;

    container.innerHTML = "";

    groups.forEach(group => {

        const div = document.createElement("div");

        div.className = "category-item";

        div.innerText =
            lang === "ar" ? group.groupName1 : group.groupName2;

        div.onclick = () => onClick(group.groupID);

        container.appendChild(div);
    });
}

export function renderItems(items, lang) {

    const container = document.getElementById("groups");

    if (!container || !items) return;

    container.innerHTML = "";

    const fragment = document.createDocumentFragment();

    items.forEach(item => {

        const card = document.createElement("div");

        card.className =
            "bg-white rounded-xl shadow-md overflow-hidden transition hover:shadow-lg";

        card.innerHTML = `
            <img src="${item.itemImagePath}"
                 class="w-full h-40 object-cover"/>

            <div class="p-4 space-y-2">
                <h3 class="font-bold text-lg">
                    ${lang === "ar" ? item.itemName1 : item.itemName2}
                </h3>

                <p class="text-sm text-gray-600">
                    ${lang === "ar" ? item.itemDescAr : item.itemDescEn}
                </p>

                <div class="flex justify-between text-sm font-semibold">
                    <span>💰 ${item.itemPrice}</span>
                    <span>🔥 ${item.itemCal}</span>
                </div>
            </div>
        `;

        fragment.appendChild(card);
    });

    container.appendChild(fragment);
}
