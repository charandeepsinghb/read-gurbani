// ==== Banis ====

const BANIS = [
  {
    name: "Japji Sahib",
    path: "japji-sahib",
    baniFile: "japji-sahib.json"
  }
];

function renderBanisList(baniDiv) {
  const frag = document.createDocumentFragment();

  for (let i = 0; i < BANIS.length; i++) {
    const { name, path } = BANIS[i];
    
    const baniName = document.createElement("div");
    const baniLink = document.createElement("a");
    baniLink.href = path;
    baniLink.innerText = name;
    
    baniName.appendChild(baniLink);

    frag.appendChild(baniName);
  }

  baniDiv.replaceChildren(frag);
}

function getCurrentBaniProperties() {
  // Get pathname
  const pathn = location.pathname;
  const path = pathn.substring(pathn.lastIndexOf("/")+1);

  if (!path) return;

  return BANIS.find(x => x.path == path);
}

// ==== Load and Render Bani ====

// Bani div
const baniDiv = document.getElementById("bani");
let bani;

async function loadBani() {
  let banifile = "";
  
  const { baniFile } = getCurrentBaniProperties() || {};

  if (!baniFile) return;
  
  const bani = await fetch("./" + baniFile);

  return bani.json();
}

function renderAllBani() {

  // Para
  let para = document.createElement("div");

  for (let i = 0; i < bani.length; i++) {

    // Pauri
    const pauri = bani[i];
    const pauriSpan = document.createElement("span");
    pauriSpan.innerText = pauri.unicode;

    para.appendChild(pauriSpan);

    if (i < bani.length-1 && pauri.paragraph < bani[i+1].paragraph) {
      baniDiv.appendChild(para);
      para = document.createElement("div");
    } else if (i == bani.length-1) {
      baniDiv.appendChild(para);
    }
  }
}


let start = 0;
let lastPauriIndex;

function renderBani(start) {

  let para = document.createElement("div");
  para.className = "para";

  for (let i = start; i < bani.length; i++) {

    baniDiv.appendChild(para);

    const pauriSpan = document.createElement("span");

    pauriSpan.id = "pauri-" + i;
    pauriSpan.innerText = bani[i].unicode;

    para.appendChild(pauriSpan);

    if (i != bani.length-1) {
      if (bani[i+1].paragraph != bani[i].paragraph) {
        para = document.createElement("div");
        para.className = "para";
      }
    }

    // Limit
    if (baniDiv.offsetHeight > window.innerHeight) {
      lastPauriIndex = i;
      para = document.createElement("div");
      para.className = "para";
      break;
    }
  }
}

function renderBaniReverse(currentStart) {
  if (currentStart <= 0) {
    return;
  }
  lastPauriIndex = currentStart;

  let para = document.createElement("div");
  para.className = "para";

  for (let i = currentStart; i >= 0; i--) {
    baniDiv.prepend(para);
    
    const pauriSpan = document.createElement("span");

    pauriSpan.id = "pauri-" + i;
    pauriSpan.innerText = bani[i].unicode;

    para.prepend(pauriSpan);

    if (i != 0) {
      if (bani[i-1].paragraph != bani[i].paragraph) {
        para = document.createElement("div");
        para.className = "para";
      }
    }

    // Limit
    if (baniDiv.offsetHeight > window.innerHeight) {
      start = i;
      para = document.createElement("div");
      para.className = "para";
      break;
    }
  }
}

// ==== Settings ====

function renderSettings() {
  // TODO
}


// ==== Overlay ====

function setOverlay() {
  // TODO
}


// ==== Next prev ====


function next() {
  baniDiv.replaceChildren();
  
  start = lastPauriIndex + 1;
  
  renderBani(start);
  console.log(start, lastPauriIndex);
}
function prev() {
  if (start-1 <= 0) {
    return;
  }
  baniDiv.replaceChildren();
  renderBaniReverse(start-1);
  console.log(start, lastPauriIndex);
}

window.addEventListener("keyup", (e) => {
  if (e.key == "ArrowRight") {
    next();
  }
  if (e.key == "ArrowLeft") {
    prev();
  }
});

// ==== Touch ===
window.addEventListener("pointerup", (e) => {
  if (document.documentElement.scrollWidth / 2 < e.pageX) {
    next();
  }
  if (document.documentElement.scrollWidth / 2 > e.pageX) {
    prev();
  }
});


// ==== Initialization ====

async function init() {

  // Load bani
  bani = await loadBani();
  if (!bani) {
    renderBanisList(baniDiv);
    return;
  }

  // Render bani
  renderBani(start);
}

(async () => await init())()
