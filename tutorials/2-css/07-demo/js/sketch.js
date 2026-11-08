const STORAGE_KEY = "minecraft-enchantment-checklist-v1";

const gear = [
    {
        title: "Helmet",
        category: "armor",
        required: ["Mending", "Protection IV", "Unbreaking III", "Respiration III"],
        optional: ["Aqua Affinity", "Thorns III"]
    },
    {
        title: "Chest Plate",
        category: "armor",
        required: ["Mending", "Protection IV", "Unbreaking III"],
        optional: ["Thorns III"]
    },
    {
        title: "Leggings",
        category: "armor",
        required: ["Mending", "Protection IV", "Unbreaking III"],
        optional: ["Thorns III", "Swift Sneak III"]
    },
    {
        title: "Boots",
        category: "armor",
        required: ["Mending", "Protection IV", "Feather Falling IV", "Unbreaking III"],
        choices: [{
            label: "Pick One",
            routes: [
                { id: "depth-strider", items: ["Depth Strider III"] },
                { id: "frost-walker", items: ["Frost Walker II"] }
            ]
        }],
        optional: ["Soul Speed III", "Thorns III"]
    },
    {
        title: "Pickaxe",
        category: "weapon",
        required: ["Unbreaking III", "Mending", "Efficiency V"],
        choices: [{
            label: "Pick One",
            routes: [
                { id: "fortune", items: ["Fortune III"] },
                { id: "silk-touch", items: ["Silk Touch"] }
            ]
        }]
    },
    {
        title: "Sword",
        category: "weapon",
        required: [
            "Unbreaking III",
            "Mending",
            "Sweeping Edge III",
            "Sharpness V",
            "Looting III",
            "Fire Aspect II",
            "Knockback II"
        ]
    },
    {
        title: "Trident",
        category: "weapon",
        required: ["Mending", "Unbreaking III"],
        choices: [{
            label: "Pick One",
            routes: [
                { id: "loyalty-channeling", items: ["Loyalty III", "Channeling"] },
                { id: "riptide", items: ["Riptide III"] }
            ]
        }]
    }
];

const armorPieces = gear.filter((item) => item.category === "armor");
const checklist = document.querySelector("#checklist");
const progressLabel = document.querySelector("#progress-label");
const progressPercent = document.querySelector("#progress-percent");
const progressBar = document.querySelector("#progress-bar");
const progressFill = document.querySelector("#progress-fill");
const saveNotice = document.querySelector("#save-notice");
const checkedItems = loadProgress();

function makeItemId(gearTitle, label) {
    return `${gearTitle}-${label}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function loadProgress() {
    try {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        if (!saved) return new Set();

        const parsed = JSON.parse(saved);
        if (!Array.isArray(parsed) || parsed.some((item) => typeof item !== "string")) {
            throw new Error("Saved checklist data has an unexpected format.");
        }
        return new Set(parsed);
    } catch (error) {
        showSaveNotice(`Progress could not be loaded: ${error.message}`);
        return new Set();
    }
}

function showSaveNotice(message) {
    saveNotice.textContent = message;
    saveNotice.hidden = false;
}

function saveProgress() {
    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...checkedItems]));
        saveNotice.hidden = true;
    } catch (error) {
        showSaveNotice(`Progress could not be saved: ${error.message}`);
    }
}

function makeCheckRow(title, label, options = {}) {
    const itemId = makeItemId(title, label);
    const row = document.createElement("label");
    row.className = "check-row";
    row.dataset.itemId = itemId;
    if (options.routeId) row.dataset.routeId = options.routeId;

    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = checkedItems.has(itemId);
    input.setAttribute("aria-label", label);

    const text = document.createElement("span");
    text.className = "check-label";
    text.textContent = label;

    row.append(input, text);
    updateRow(row);
    input.addEventListener("change", () => {
        if (input.checked) {
            checkedItems.add(itemId);
        } else {
            checkedItems.delete(itemId);
        }
        saveProgress();
        updateAll();
    });
    return row;
}

function updateRow(row) {
    const input = row.querySelector("input");
    row.classList.toggle("is-checked", input.checked);
}

function addListItem(list, row) {
    const item = document.createElement("li");
    item.append(row);
    list.append(item);
}

function renderGearCard(item) {
    const card = document.createElement("section");
    card.className = "gear-card";
    card.dataset.gearTitle = item.title;
    card.setAttribute("aria-label", `${item.title} enchantments`);

    const heading = document.createElement("div");
    heading.className = "gear-heading";
    const title = document.createElement("h2");
    title.textContent = item.title;
    const status = document.createElement("span");
    status.className = "completion-status";
    status.dataset.status = "";
    heading.append(title, status);

    const content = document.createElement("div");
    content.className = "gear-content";
    const list = document.createElement("ul");
    list.className = "checklist-items";

    for (const label of item.required) {
        addListItem(list, makeCheckRow(item.title, label));
    }

    for (const choice of item.choices ?? []) {
        const groupTitle = document.createElement("li");
        groupTitle.className = "group-title";
        groupTitle.textContent = choice.label;
        list.append(groupTitle);
        for (const route of choice.routes) {
            for (const label of route.items) {
                addListItem(list, makeCheckRow(item.title, label, { routeId: route.id }));
            }
        }
    }

    content.append(list);

    if (item.optional?.length) {
        const optional = document.createElement("div");
        optional.className = "optional-section";
        const optionalTitle = document.createElement("h3");
        optionalTitle.className = "optional-title";
        optionalTitle.textContent = "Optional enchantments";
        const note = document.createElement("p");
        note.className = "optional-note";
        const optionalList = document.createElement("ul");
        optionalList.className = "checklist-items";
        for (const label of item.optional) {
            addListItem(optionalList, makeCheckRow(item.title, label, { optional: true }));
        }
        optional.append(optionalTitle, note, optionalList);
        content.append(optional);
    }

    card.append(heading, content);
    return card;
}

function isGearComplete(item) {
    const requiredDone = item.required.every((label) => checkedItems.has(makeItemId(item.title, label)));
    const choicesDone = (item.choices ?? []).every((choice) =>
        choice.routes.some((route) =>
            route.items.every((label) => checkedItems.has(makeItemId(item.title, label)))
        )
    );
    return requiredDone && choicesDone;
}

function updateCard(card, item) {
    let complete = true;
    const choiceGroups = new Map();
    for (const choice of item.choices ?? []) {
        choiceGroups.set(choice.routes.map((route) => route.id), choice.routes);
    }

    for (const row of card.querySelectorAll(".check-row")) {
        const input = row.querySelector("input");
        updateRow(row);
        const routeId = row.dataset.routeId;
        if (!routeId) continue;

        const matchingChoice = [...choiceGroups.values()].find((routes) =>
            routes.some((route) => route.id === routeId)
        );
        const activeRoute = matchingChoice?.find((route) =>
            route.items.some((label) => checkedItems.has(makeItemId(item.title, label)))
        );
        const isUnavailable = Boolean(activeRoute && activeRoute.id !== routeId);
        input.disabled = isUnavailable;
        row.classList.toggle("is-unavailable", isUnavailable);
    }

    for (const label of item.required) {
        if (!checkedItems.has(makeItemId(item.title, label))) complete = false;
    }
    for (const choice of item.choices ?? []) {
        const choiceComplete = choice.routes.some((route) =>
            route.items.every((label) => checkedItems.has(makeItemId(item.title, label)))
        );
        if (!choiceComplete) complete = false;
    }

    card.classList.toggle("is-complete", complete);
    card.querySelector("[data-status]").textContent = complete ? "Complete" : "In progress";
}

function updateAll() {
    let completedArmor = 0;
    for (const item of gear) {
        const card = checklist.querySelector(`[data-gear-title="${item.title}"]`);
        updateCard(card, item);
        if (item.category === "armor" && isGearComplete(item)) completedArmor += 1;
    }

    const percent = Math.round((completedArmor / armorPieces.length) * 100);
    progressLabel.textContent = `${completedArmor} of ${armorPieces.length} armor pieces complete`;
    progressPercent.textContent = `${percent}%`;
    progressBar.setAttribute("aria-valuenow", String(completedArmor));
    progressFill.style.width = `${percent}%`;
}

for (const item of gear) {
    checklist.append(renderGearCard(item));
}
updateAll();