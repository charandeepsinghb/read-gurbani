// === Banis ===

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

// === Load and Render Bani ===

async function loadBani() {
  let banifile = "";
  
  const { baniFile } = getCurrentBaniProperties() || {};

  if (!baniFile) return;
  
  const bani = await fetch("./" + baniFile);

  return bani.json();
}

function renderBani(bani, baniDiv) {

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

// === Settings ===

function renderSettings() {
  // TODO
}


// === Initialization ===

async function init() {
  // Bani div
  const baniDiv = document.getElementById("bani");

  // Load bani
  const bani = await loadBani();
  if (!bani) {
    renderBanisList(baniDiv);
    return;
  }

  // Render bani
  renderBani(bani, baniDiv);
}

(async () => await init())()
