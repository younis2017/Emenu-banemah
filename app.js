/* =========================================
CONFIG
========================================= */
let currentModalItemId = null; //for handle itemid in itemremark
let selectedOptions = []; // for multple selection itemremark
let cart = [];
let currentModalItem = null;

const API_BASE = "https://www.waynas.tech/api/php/";
const TANET = "banemah";

const urlParams = new URLSearchParams(window.location.search);
const bruuid = urlParams.get("bruuid") || "1";

let currentLanguage = "ar";

/* =========================================
FETCH HELPER
========================================= */

async function fetchJSON(url){

const res = await fetch(url);

if(!res.ok){
throw new Error("API Error");
}

return await res.json();
}

/* =========================================
LOADER CONTROL
========================================= */
function showLoader(){
const loader = document.getElementById("loader");
if(loader){
loader.classList.remove("hidden");
}
}

function hideLoader(){
const loader = document.getElementById("loader");
if(loader){
loader.classList.add("hidden");
}
}
/* =========================================
RENDER MENU ITEMS
========================================= */

function renderItems(items){

const container = document.getElementById("groups");

if(!container) return;

container.innerHTML = "";

const fragment = document.createDocumentFragment();

items.forEach(item=>{

const card = document.createElement("div");
card.className = "menu-card";
card.onclick=()=>openItemModal(item);
card.style.cursor="pointer";
card.innerHTML = `
<img src="${item.itemImagePath || ''}" />

<div class="menu-card-body">

<div class="menu-title">
${currentLanguage === "ar"
? item.itemName1
: item.itemName2}
</div>

<div class="menu-desc">
${currentLanguage === "ar"
? (item.itemDescAr || "")
: (item.itemDescEn || "")}
</div>

                
     <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;font-size:12px;color:#666;margin-top:6px;gap:10px;">

<!-- Price -->
<div style="display:flex;align-items:center;gap:4px;">
<img
src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Saudi_Riyal_Symbol.png/250px-Saudi_Riyal_Symbol.png"
style="width:14px;height:14px;"
>
<span>${item.itemPrice}</span>
</div>

<!-- Calories -->
<div style="display:flex;align-items:center;gap:4px;">
<span>🔥 ${item.itemCal || 0}</span>
</div>

<!-- Walking Time -->
<div style="display:flex;align-items:center;gap:4px;">
<img
src="https://www.waynas.tech/image/walkingg.gif"
style="width:24px;height:24px;object-fit:contain;"
>
<span>${item.itemWalk ? item.itemWalk : 0} Min</span>
</div>

<!-- Allergy Icons -->
<div style="display:flex;align-items:center;gap:3px;flex-wrap:wrap;">
${renderAllergyIcons(item)}
</div>

</div>
</div>
`;

fragment.appendChild(card);

});

container.appendChild(fragment);
}

/* =========================================
LOAD ITEMS BY GROUP
========================================= */

async function loadItems(groupId){

try{

showLoader();

const items = await fetchJSON(
`${API_BASE}itemslinkedfetch.php?cotalnet=${TANET}&bruuid=${bruuid}&groupid=${groupId}`
);

renderItems(items);

}catch(err){

console.error("Load Items Error:",err);

}finally{

hideLoader();

}

}

/* =========================================
LOAD ALL ITEMS (CATEGORY SECTIONED)
========================================= */

async function loadAllItems(){

try{

showLoader();

const container = document.getElementById("groups");

if(!container) return;

container.innerHTML = "";

/* Load Groups */

const groups = await fetchJSON(
`${API_BASE}groupslinkedfetch.php?cotalnet=${TANET}&bruuid=${bruuid}`
);

/* Fragment rendering */

const fragment = document.createDocumentFragment();

for(const group of groups){

const items = await fetchJSON(
`${API_BASE}itemslinkedfetch.php?cotalnet=${TANET}&bruuid=${bruuid}&groupid=${group.groupID}`
);

/* Skip empty groups */

if(!items || items.length === 0) continue;

/* Category Header */

const header = document.createElement("h3");

header.innerText =
currentLanguage === "ar"
? group.groupName1
: group.groupName2;

header.style.background="#3ab9a4";
header.style.color="white";
header.style.textAlign="center";
header.style.padding="8px";

fragment.appendChild(header);

/* Items Cards */

items.forEach(item=>{

const card = document.createElement("div");

card.className="menu-card";
card.onclick=()=>openItemModal(item);
card.innerHTML=`
<img src="${item.itemImagePath || ''}" />

<div class="menu-card-body">

<div class="menu-title">
${currentLanguage==="ar"
? item.itemName1
: item.itemName2}
</div>

<div class="menu-desc">
${currentLanguage==="ar"
? (item.itemDescAr || "")
: (item.itemDescEn || "")}
</div>

<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;font-size:12px;color:#666;margin-top:6px;gap:10px;">

<!-- Price -->
<div style="display:flex;align-items:center;gap:4px;">
<img
src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Saudi_Riyal_Symbol.png/250px-Saudi_Riyal_Symbol.png"
style="width:14px;height:14px;"
>
<span>${item.itemPrice}</span>
</div>

<!-- Calories -->
<div style="display:flex;align-items:center;gap:4px;">
<span>🔥 ${item.itemCal || 0}</span>
</div>

<!-- Walking Time -->
<div style="display:flex;align-items:center;gap:4px;">
<img
src="https://www.waynas.tech/image/walkingg.gif"
style="width:24px;height:24px;object-fit:contain;"
>
<span>${item.itemWalk ? item.itemWalk : 0} Min</span>
</div>

<!-- Allergy Icons -->
<div style="display:flex;align-items:center;gap:3px;flex-wrap:wrap;">
${renderAllergyIcons(item)}
</div>

</div>
</div>
`;

fragment.appendChild(card);

});

}

container.appendChild(fragment);

}catch(err){

console.error("LoadAllItems Error:",err);

}finally{

hideLoader();

}

}

/* =========================================
LOAD GROUPS
========================================= */

async function loadGroups(){

try{

showLoader();

const groups = await fetchJSON(
`${API_BASE}groupslinkedfetch.php?cotalnet=${TANET}&bruuid=${bruuid}`
);

const container = document.getElementById("groups2");

if(!container) return;

container.innerHTML = "";

/* ALL TAB */

const allTab = document.createElement("div");

allTab.className = "category-item";

allTab.innerText = currentLanguage === "ar" ? "الكل" : "All";

allTab.onclick=async()=>{

document.querySelectorAll(".category-item")
.forEach(el=>el.classList.remove("active"));

allTab.classList.add("active");

await loadAllItems();

};

container.appendChild(allTab);

/* CATEGORY TABS */

groups.forEach(group=>{

const div = document.createElement("div");

div.className = "category-item";

div.innerText =
currentLanguage === "ar"
? group.groupName1
: group.groupName2;

div.onclick=async()=>{

document.querySelectorAll(".category-item")
.forEach(el=>el.classList.remove("active"));

div.classList.add("active");

await loadItems(group.groupID);

};

container.appendChild(div);

});

/* AUTO LOAD FIRST CATEGORY */

if(groups.length > 0){
await loadItems(groups[0].groupID);
}

}catch(err){

console.error(err);

}finally{

hideLoader();

}

}

/* =========================================
SEARCH MENU
========================================= */

function searchMenu(){

const value =
document.getElementById("searchInput")
.value.toLowerCase();

document.querySelectorAll(".menu-card")
.forEach(card=>{

const text = card.innerText.toLowerCase();

card.style.display =
text.includes(value) ? "block" : "none";

});

}

/* =========================================
LANGUAGE CONTROL
========================================= */

function toggleLanguage(){

currentLanguage =
currentLanguage === "ar" ? "en" : "ar";

document.documentElement.dir =
currentLanguage === "ar" ? "rtl" : "ltr";

const btn = document.getElementById("langToggle");

if(btn){
btn.innerText =
currentLanguage === "ar" ? "EN" : "AR";
}

loadGroups();

}

/* =========================================
Sidebar CONTROL
========================================= */
function toggleSidebar(){

const sidebar=document.getElementById("sidebar");
const overlay=document.getElementById("sidebarOverlay");

if(!sidebar || !overlay) return;

sidebar.classList.toggle("hidden");
overlay.classList.toggle("hidden");
}
window.toggleSidebar=toggleSidebar;
/* =========================================
Allergy CONTROL
========================================= */
function renderAllergyIcons(item){

let icons = [];

if(item.itwheat==1){
icons.push("https://www.waynas.tech/allegers/wheat.png");
}

if(item.itegg==1){
icons.push("https://www.waynas.tech/allegers/egg.png");
}

if(item.itmilk==1){
icons.push("https://www.waynas.tech/allegers/milk.png");
}

if(item.itsesame==1){
icons.push("https://www.waynas.tech/allegers/sesame.png");
}

if(item.itfish==1){
icons.push("https://www.waynas.tech/allegers/fish.png");
}

if(item.itnuts==1){
icons.push("https://www.waynas.tech/allegers/nuts.png");
}

return icons.map(icon=>`
<img src="${icon}" style="width:22px;height:22px;margin-right:3px;">
`).join("");

}
/* =========================================
OpenModal CONTROL
========================================= */
async function openItemModal(item){
selectedOptions=[];
updateOptionSummary();
currentModalItem = item;
selectedOptions = [];
try{

const modalBody=document.getElementById("modalBody");

/* Show loading inside modal */
modalBody.innerHTML="<p style='text-align:center'>Loading...</p>";

/* ===============================
FETCH OPTIONS
================================ */

let optionsHTML="";

try{

const options = await fetchJSON(
`${API_BASE}itemsOptions.php?cotalnet=${TANET}&itemid=${item.itemID}`
);

if(options && options.length>0){
currentModalItemId = item.itemID;

optionsHTML+=`
<hr>
<p style="font-weight:bold;margin-top:10px;">
${currentLanguage==="ar" ? "الخيارات" : "Options"}
</p>

<div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:8px;">
`;

options.forEach(opt=>{

optionsHTML+=`
<button
class="option-btn"
data-id="${opt.optdetailsID}"
onclick="selectOption(
'${opt.optdetailsID}',
'${opt.optdetailsPrice}',
'${currentLanguage==="ar"
? opt.optdetailsName
: opt.optdetailsName2}'
)">

${currentLanguage==="ar"
? opt.optdetailsName
: opt.optdetailsName2}

(${opt.optdetailsPrice})

</button>
`;

});

optionsHTML+=`</div>`;

}

}catch(err){
console.error(err);
}

/* ===============================
REMARKS
================================ */

const remark =
currentLanguage==="ar"
? (item.remarkAr || "")
: (item.remarkEn || "");

/* ===============================
MODAL RENDER
================================ */

modalBody.innerHTML=`
<img src="${item.itemImagePath}"
style="width:100%;border-radius:12px;margin-bottom:15px;">

<h2>
${currentLanguage==="ar"
? item.itemName1
: item.itemName2}
</h2>
<div class="menu-desc">
${currentLanguage === "ar"
? (item.itemDescAr || "")
: (item.itemDescEn || "")}
</div>


<div style="display:flex;justify-content:space-between;flex-wrap:wrap;font-size:12px;color:#666;margin-top:10px;gap:10px;">

<div style="display:flex;align-items:center;gap:4px;">
<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Saudi_Riyal_Symbol.png/250px-Saudi_Riyal_Symbol.png"
style="width:14px;height:14px;">
<span>${item.itemPrice}</span>
</div>

<div>🔥 ${item.itemCal || 0}</div>

<div style="display:flex;align-items:center;gap:4px;">
<img src="https://www.waynas.tech/image/walkingg.gif"
style="width:24px;height:24px;">
<span>${item.itemWalk || 0} Min</span>
</div>

</div>

${optionsHTML}

`;

document.getElementById("itemModal")
.classList.remove("hidden");

}catch(err){
console.error("Modal Load Error",err);
}

}

function selectOption(id, price, name){

if(!currentModalItemId) return;

/* Toggle option selection */
const index = selectedOptions.findIndex(
opt => opt.optionID === id
);

if(index !== -1){
selectedOptions.splice(index,1);
}
else{
selectedOptions.push({
itemID: currentModalItemId,
optionID:id,
price:parseFloat(price),
name:name
});
}

/* Refresh summary */
updateOptionSummary();

//highlightSelectedOptions();

}

window.selectOption = selectOption;

function removeOption(optionID){

selectedOptions = selectedOptions.filter(
opt => opt.optionID !== optionID
);

/* Refresh modal UI */
const fakeEventUpdate = document.getElementById("optionRemark");

if(fakeEventUpdate){
fakeEventUpdate.innerHTML=""; 
}

/* Re-render selection summary */
const remarkBox = document.getElementById("optionRemark");

if(remarkBox){

if(selectedOptions.length === 0){
remarkBox.innerHTML="No option selected";
return;
}

let html="";
let totalExtraPrice = 0;

selectedOptions.forEach(opt=>{
html+=`
<div style="display:flex;justify-content:space-between;align-items:center;padding:4px 0;border-bottom:1px solid #eee">

<span>✅ ${opt.name} — 💰 ${opt.price}</span>

<button onclick="removeOption('${opt.optionID}')"
style="border:none;background:red;color:white;border-radius:6px;padding:2px 8px;cursor:pointer;">
✖
</button>

</div>
`;

totalExtraPrice += opt.price;
});

html+=`<hr>
<strong>Total Extra Price: ${totalExtraPrice}</strong>
`;

remarkBox.innerHTML = html;
}

/* Remove highlight */
document.querySelectorAll(".option-btn").forEach(btn=>{
btn.classList.remove("selected-option");
});

selectedOptions.forEach(opt=>{
const btn=document.querySelector(
`.option-btn[data-id="${opt.optionID}"]`
);

if(btn){
btn.classList.add("selected-option");
}
});

}

window.removeOption = removeOption;

function updateOptionSummary(){

const remarkBox = document.getElementById("optionRemark");

if(!remarkBox) return;

if(selectedOptions.length === 0){
remarkBox.innerHTML="No option selected";
return;
}

let html="";
let total=0;

selectedOptions.forEach(opt=>{
html+=`
<div style="display:flex;justify-content:space-between;align-items:center;padding:4px 0;border-bottom:1px solid #eee">

<span>✅ ${opt.name} — 💰 ${opt.price}</span>

<button onclick="removeOption('${opt.optionID}')"
style="border:none;background:red;color:white;border-radius:6px;padding:2px 8px;cursor:pointer;">
✖
</button>

</div>
`;

total+=opt.price;
});

html+=`<hr>
<strong>Total Extra Price: ${total}</strong>`;

remarkBox.innerHTML=html;

}

function addToCartFromModal(){

if(!currentModalItem){
alert("No item selected");
return;
}

/* Create cart item */

const cartItem = {
itemID: currentModalItem.itemID,
name:
currentLanguage==="ar"
? currentModalItem.itemName1
: currentModalItem.itemName2,

price: currentModalItem.itemPrice,
qty:1,
options:[...selectedOptions]
};

/* Add cart */

cart.push(cartItem);

//alert("✅ Added to cart");
showToast("✅ Added to cart");
    openCartModal();
    closeCartModal();
/* Save storage */
localStorage.setItem(
"restaurantCart",
JSON.stringify(cart)
);

}

function showToast(message, type="success") {

  const toast = document.getElementById("toast");

  toast.innerText = message;

  toast.classList.remove("error");

  if(type === "error"){
      toast.classList.add("error");
  }

  toast.classList.add("show");

  setTimeout(() => {
      toast.classList.remove("show");
  }, 2500);
}

function renderCart(){

const body = document.getElementById("cartBody");

body.innerHTML = "";

let html = "";

let total = 0;

cart.forEach((item,index)=>{

let optionHtml = "";

let optionTotal = 0;

/* Render options */

if(item.options && item.options.length > 0){

optionHtml += `<div style="font-size:12px;color:#666;margin-top:5px;">Options:</div>`;

item.options.forEach(opt=>{

optionTotal += Number(opt.price);

optionHtml += `
<div style="font-size:12px;color:#555;">
➕ ${opt.name} (💰 ${opt.price})
</div>
`;
});
}

/* Calculate item total */

let itemTotal =
(Number(item.price) + optionTotal) * Number(item.qty);

total += itemTotal;

html += `
<div style="border-bottom:1px solid #eee;padding:12px;margin-bottom:10px;">

<p style="font-weight:bold">${item.name}</p>

<p style="font-size:13px">
💰 Base Price: ${item.price}
</p>

<p style="font-size:13px">
Qty: ${item.qty}
</p>

${optionHtml}

<p style="font-weight:bold;color:#3ab9a4;">
Item Total: ${itemTotal.toFixed(2)}
</p>

<div style="margin-top:6px;display:flex;gap:10px;">

<button onclick="changeQty(${index},-1)"
style="border:none;background:#eee;padding:5px 10px;">
➖
</button>

<button onclick="changeQty(${index},1)"
style="border:none;background:#eee;padding:5px 10px;">
➕
</button>

<button onclick="removeCartItem(${index})"
style="color:red;border:none;background:none;">
Delete
</button>

</div>

</div>
`;

});

html += `
<div style="padding:15px;font-weight:bold;text-align:center;">
Total Order = 💰 ${total.toFixed(2)}
</div>
`;

body.innerHTML = html;

document.getElementById("cartCount").innerText = cart.length;

}
function changeQty(index,delta){

cart[index].qty += delta;

if(cart[index].qty < 1)
cart[index].qty = 1;

localStorage.setItem(
"restaurantCart",
JSON.stringify(cart)
);

renderCart();
}
function removeCartItem(index){

cart.splice(index,1);

localStorage.setItem(
"restaurantCart",
JSON.stringify(cart)
);

renderCart();

}
function closeItemModal(){
document.getElementById("itemModal").classList.add("hidden");
document.getElementById("generalModal").classList.add("hidden");
document.getElementById("cartModal").classList.add("hidden");
}
function outsideModalClose(event){
const modalContent=document.querySelector(".modal-content");

if(event.target.id==="itemModal" || event.target.id==="generalModal" || event.target.id==="cartModal"){
closeItemModal();
}
}
function openCartModal(){
    renderCart();

    document.getElementById("cartModal")
    .classList.remove("hidden");
}
function closeCartModal(event){

const modal = document.getElementById("cartModal");

/* If click outside modal content OR call directly */
if(!event || event.target.id === "cartModal"){
    modal.classList.add("hidden");
}

}
window.outsideModalClose=outsideModalClose;
window.closeItemModal=closeItemModal;

/* =========================================
Load company
========================================= */

async function loadCompanyInfo(){

try{

const data = await fetchJSON(
`${API_BASE}company.php?cotalnet=${TANET}`
);

let html="";
 let image = "";
data.forEach(company=>{

html+=`
<div style="text-align:center">

<img id="companyimage" src="${company.coimageurl}"
style="width:120px;border-radius:12px;margin-bottom:10px;">

<p style="font-size:13px;color:#eee">${company.coname1}</p>
<p style="font-size:13px;color:#eee">
${company.coname2}</p>

</div>
`;

});

document.getElementById("companyInfo").innerHTML=html;

}catch(err){
console.error(err);
}

}

async function loadCoverHeader() {
 try{

const data = await fetchJSON(
`${API_BASE}company.php?cotalnet=${TANET}`
);

let html="";
data.forEach(company=>{

html+=`

                    <img 
                        src="${company.coverimage}" 
                        style="
                            width:100%;
                            height:220px;
                            object-fit:cover;
                            border-radius:0 0 0px 0px;
                        "
                    />
                `;

});

document.getElementById("coverheader").innerHTML=html;

}catch(err){
console.error(err);
}

}
/* =========================================
Load branch name
========================================= */

async function loadBranchName(){

try{

const data=await fetchJSON(
`${API_BASE}getBranchName.php?cotalnet=${TANET}&bruuid=${bruuid}`
);

let html="";

data.forEach(branch=>{
html+=`
<p style="color:#eee;font-size:14px;">
📍 ${branch.brname} | ${branch.brname2}
</p>
`;
});

document.getElementById("branchName").innerHTML=html;

}catch(err){
console.error(err);
}

}

/* =========================================
Load branchlist
========================================= */
async function openBranchesModal(){

try{

showLoader();

const data=await fetchJSON(
`${API_BASE}branches.php?cotalnet=${TANET}`
);

let html="<h3 style='text-align:center'> Our Branches | فروعنا</h3><hr>";

data.forEach(branch=>{
html+=`
<button class="sidebar-btn"
style="width:100%;margin:6px 0;"
onclick="window.open('${branch.brlocation}','_blank')">

📍 ${branch.brname} | ${branch.brname2}

</button>
`;
});

document.getElementById("allBody").innerHTML=html;

document.getElementById("generalModal")
.classList.remove("hidden");

}catch(err){
console.error(err);

}finally{
hideLoader();
}

}

window.openBranchesModal=openBranchesModal;

function toggleBranches(){

const container=document.getElementById("branches");

if(!container) return;

if(container.style.display==="none"){
container.style.display="block";
loadBranches();
}else{
container.style.display="none";
}

}

window.toggleBranches=toggleBranches;
/* =========================================
APP START
========================================= */

document.addEventListener("DOMContentLoaded",()=>{
loadGroups(); 
loadCoverHeader();
loadCompanyInfo();
loadBranchName();
loadBranches();
   
});

/* =========================================
GLOBAL EXPORT
========================================= */

window.toggleLanguage = toggleLanguage;
window.searchMenu = searchMenu;
document.addEventListener("keydown", function(e){
if(e.key === "Escape"){
closeCartModal();
}
});