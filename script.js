const BANIS = [
  {
    name: "Japji Sahib",
    path: "japji-sahib",
    baniFile: "japji-sahib-bani.js"
  }
];

function getCurrentBaniProperties() {
  // Get pathname
  const pathn = location.pathname;
  const path = pathn.substring(pathn.lastIndexOf("/")+1);

  if (!path) return;

  return BANIS.find(x => x.path == path);
}

async function loadBani() {
  let banifile = "";
  
  const { baniFile } = getCurrentBaniProperties() || {};

  if (!baniFile) return;
  
  const module = await import("./" + baniFile);
  return module.BANI;
}

function renderBani(bani, baniDiv) {
  for (let i = 0; i < bani.length; i++) {
    const pauri = bani[i];
    const pauriSpan = document.createElement("span");
    pauriSpan.innerText = pauri;

    baniDiv.appendChild(pauriSpan);
  }
}

function getBaniNameFromPath(pathn) {
  if (!pathn || pathn == "/") return;
  
  pathn = pathn.substring(pathn.lastIndexOf("/"));
  return pathn;
}

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

await init();
