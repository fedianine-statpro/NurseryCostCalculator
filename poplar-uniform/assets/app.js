const ZEFFY_CHECKOUT_URL = "https://www.zeffy.com/";
const MINIMUM_ONLINE_ORDER = 5.00;

const products = [
  {id:"cardigan", name:"Green cardigan", kicker:"School logo", category:"everyday", colour:"#176a49", shape:"cardigan", prices:{B:5.00,C:2.00}, desc:"Green school cardigan with the Poplar logo.", sizes:["3-4","4-5","5-6","7-8","9-10","11-12"], grades:["B","C"]},
  {id:"sweatshirt", name:"Green sweatshirt", kicker:"Everyday uniform", category:"everyday", colour:"#176a49", shape:"top", prices:{B:4.50,C:1.50}, desc:"Green school sweatshirt.", sizes:["3-4","4-5","5-6","7-8","9-10","11-12"], grades:["B","C"]},
  {id:"polo", name:"Yellow polo shirt", kicker:"Everyday uniform", category:"everyday", colour:"#efd047", shape:"top", prices:{B:1.50,C:1.00}, desc:"Plain yellow polo shirt.", sizes:["3-4","4-5","5-6","7-8","9-10","11-12"], grades:["B","C"]},
  {id:"trousers", name:"Grey trousers", kicker:"Everyday uniform", category:"everyday", colour:"#5d6564", shape:"trousers", prices:{B:2.50,C:1.00}, desc:"Grey school trousers in wearable condition.", sizes:["3-4","4-5","5-6","6-7","7-8","9-10","11-12"], grades:["B","C"]},
  {id:"skirt", name:"Grey skirt", kicker:"Everyday uniform", category:"everyday", colour:"#626866", shape:"skirt", prices:{B:2.00,C:1.00}, desc:"Grey school skirt.", sizes:["3-4","4-5","5-6","6-7","7-8","9-10"], grades:["B","C"]},
  {id:"pinafore", name:"Grey pinafore", kicker:"Everyday uniform", category:"everyday", colour:"#626866", shape:"dress", prices:{B:3.50,C:1.50}, desc:"Grey school pinafore dress.", sizes:["3-4","4-5","5-6","6-7","7-8","9-10"], grades:["B","C"]},
  {id:"pe-tshirt", name:"PE yellow T-shirt", kicker:"PE kit", category:"pe", colour:"#efd047", shape:"top", prices:{B:1.50,C:1.00}, desc:"Plain yellow T-shirt for PE.", sizes:["3-4","4-5","5-6","7-8","9-10","11-12"], grades:["B","C"]},
  {id:"pe-shorts", name:"Black PE shorts", kicker:"PE kit", category:"pe", colour:"#202523", shape:"shorts", prices:{B:1.50,C:1.00}, desc:"Plain black shorts for PE.", sizes:["3-4","4-5","5-6","7-8","9-10","11-12"], grades:["B","C"]},
  {id:"pe-bottoms", name:"Black PE bottoms", kicker:"Cold-weather PE", category:"pe", colour:"#202523", shape:"trousers", prices:{B:2.00,C:1.00}, desc:"Plain black full-length PE bottoms, such as joggers or leggings.", sizes:["3-4","4-5","5-6","7-8","9-10","11-12"], grades:["B","C"]},
  {id:"summer-dress-green", name:"Green checked summer dress", kicker:"Summer uniform", category:"summer", colour:"#77a98a", shape:"dress", pattern:"gingham-green", prices:{B:3.50,C:1.50}, desc:"Green checked summer school dress.", sizes:["3-4","4-5","5-6","6-7","7-8","9-10"], grades:["B","C"]},
  {id:"summer-dress-yellow", name:"Yellow checked summer dress", kicker:"Summer uniform", category:"summer", colour:"#efd047", shape:"dress", pattern:"gingham-yellow", prices:{B:3.50,C:1.50}, desc:"Yellow checked summer school dress.", sizes:["3-4","4-5","5-6","6-7","7-8","9-10"], grades:["B","C"]},
  {id:"shorts", name:"Grey trouser shorts", kicker:"Summer uniform", category:"summer", colour:"#606766", shape:"shorts", prices:{B:2.50,C:1.00}, desc:"Grey school trouser shorts.", sizes:["3-4","4-5","5-6","6-7","7-8","9-10"], grades:["B","C"]},
  {id:"bookbag", name:"Book bag", kicker:"School bag", category:"accessories", colour:"#176a49", shape:"bag", prices:{B:2.00,C:1.00}, desc:"Green school book bag.", sizes:["One size"], grades:["B","C"]},
  {id:"expandable-bag", name:"Expandable book bag", kicker:"School bag", category:"accessories", colour:"#176a49", shape:"bag", prices:{B:2.50,C:1.00}, desc:"Expandable green school book bag.", sizes:["One size"], grades:["B","C"]}
];

let basket = JSON.parse(localStorage.getItem("poplarUniformBasketV5") || "[]");
const grid = document.getElementById("productGrid");
const template = document.getElementById("productTemplate");
const basketDrawer = document.getElementById("basketDrawer");
const basketCount = document.getElementById("basketCount");
const basketItems = document.getElementById("basketItems");
const basketSubtotal = document.getElementById("basketSubtotal");
const basketTotal = document.getElementById("basketTotal");
const checkoutButton = document.getElementById("checkoutButton");
const basketThreshold = document.getElementById("basketThreshold");
const backdrop = document.getElementById("drawerBackdrop");

function priceFor(product, grade) { return product.prices[grade]; }

function gradeName(g){ return g === "B" ? "Good school condition" : "Spare / messy play"; }
function gradeShort(g){ return g === "B" ? "Good" : "Spare"; }
function formatMoney(value){ return `£${value.toFixed(2)}`; }



function setVisualGrade(card, grade) {
  card.dataset.grade = grade;
  const visualLabel = card.querySelector(".visual-condition");
  if (visualLabel) visualLabel.textContent = gradeShort(grade);
}

function renderProducts(filter="all") {
  grid.innerHTML = "";
  products.filter(p => filter === "all" || p.category === filter).forEach(product => {
    const node = template.content.cloneNode(true);
    const card = node.querySelector(".product-card");
    card.dataset.shape = product.shape;
    card.dataset.category = product.category;
    if (product.pattern) card.dataset.pattern = product.pattern;
    card.querySelector(".product-visual").style.setProperty("--garment", product.colour);
    card.querySelector(".product-badge").textContent = product.id === "cardigan" ? "School logo" : "Pre-loved";
    card.querySelector(".product-kicker").textContent = product.kicker;
    card.querySelector(".product-name").textContent = product.name;
    card.querySelector(".product-desc").textContent = product.desc;

    const size = card.querySelector(".size-select");
    product.sizes.forEach(s => size.add(new Option(s,s)));
    const grade = card.querySelector(".grade-select");
    product.grades.forEach(g => {
      grade.add(new Option(`${gradeShort(g)} · ${formatMoney(priceFor(product,g))}`,g,false,g==="B"));
    });

    const priceEl = card.querySelector(".product-price");
    const updateSelection = () => {
      const g = grade.value;
      const price = priceFor(product, g);
      priceEl.textContent = formatMoney(price);
      setVisualGrade(card, g);
    };
    grade.addEventListener("change", updateSelection);
    updateSelection();

    card.querySelector(".button-add").addEventListener("click", () => {
      basket.push({
        id: crypto.randomUUID(),
        productId: product.id,
        name: product.name,
        size: size.value,
        grade: grade.value,
        price: priceFor(product, grade.value)
      });
      saveBasket();
      openBasket();
    });
    grid.appendChild(node);
  });
}

function saveBasket(){ localStorage.setItem("poplarUniformBasketV5",JSON.stringify(basket)); renderBasket(); }

function renderBasket(){
  basketCount.textContent = basket.length;
  if(!basket.length){
    basketItems.innerHTML = '<p class="basket-empty">Your basket is empty.<br>Add a few uniform items to get started.</p>';
  } else {
    basketItems.innerHTML = basket.map(item => `<div class="basket-line"><div><strong>${item.name}</strong><small>Size ${item.size} · ${gradeShort(item.grade)} condition</small><button class="remove-item" data-id="${item.id}">Remove</button></div><strong>${formatMoney(item.price)}</strong></div>`).join("");
    basketItems.querySelectorAll(".remove-item").forEach(btn => btn.addEventListener("click",()=>{basket=basket.filter(x=>x.id!==btn.dataset.id);saveBasket();}));
  }

  const subtotal = basket.reduce((s,x)=>s+x.price,0);
  const total = subtotal;
  const amountToMinimum = Math.max(0, MINIMUM_ONLINE_ORDER - subtotal);

  basketSubtotal.textContent = formatMoney(subtotal);
  basketTotal.textContent = formatMoney(total);

  if (!basket.length) {
    basketThreshold.textContent = `Minimum online order ${formatMoney(MINIMUM_ONLINE_ORDER)}.`;
    basketThreshold.className = "basket-threshold";
  } else if (amountToMinimum > 0) {
    basketThreshold.textContent = `Add ${formatMoney(amountToMinimum)} more to reach the ${formatMoney(MINIMUM_ONLINE_ORDER)} online minimum.`;
    basketThreshold.className = "basket-threshold warning";
  } else {
    basketThreshold.textContent = `Online minimum reached. Your order can be submitted.`;
    basketThreshold.className = "basket-threshold success";
  }

  const canCheckout = basket.length > 0 && subtotal >= MINIMUM_ONLINE_ORDER;
  checkoutButton.classList.toggle("disabled", !canCheckout);
  checkoutButton.href = canCheckout ? ZEFFY_CHECKOUT_URL : "#";
}

function openBasket(){basketDrawer.classList.add("open");backdrop.classList.add("show");basketDrawer.setAttribute("aria-hidden","false");document.getElementById("basketButton").setAttribute("aria-expanded","true")}
function closeBasket(){basketDrawer.classList.remove("open");backdrop.classList.remove("show");basketDrawer.setAttribute("aria-hidden","true");document.getElementById("basketButton").setAttribute("aria-expanded","false")}

document.querySelectorAll(".filter").forEach(btn=>btn.addEventListener("click",()=>{document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));btn.classList.add("active");renderProducts(btn.dataset.filter)}));
document.getElementById("basketButton").addEventListener("click",openBasket);
document.getElementById("closeBasket").addEventListener("click",closeBasket);
backdrop.addEventListener("click",closeBasket);
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeBasket()});
document.getElementById("clearBasket").addEventListener("click",()=>{basket=[];saveBasket()});

renderProducts();
renderBasket();
