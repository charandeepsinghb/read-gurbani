async function loadBani(baniname) {
  let banifile = "";
  switch (baniname) {
    case '/japji-sahib':
      banifile = "./japji-sahib-bani.js"
      break;
  
    default:
      return;
  }
  const module = await import(banifile);
  return module.BANI;
}

function renderBani(bani) {
  for (let i = 0; i < bani.length; i++) {
    const pauri = bani[i];
    const pauriSpan = document.createElement("span");
    pauriSpan.innerText = pauri;

    // Bani div
    const baniDiv = document.getElementById("bani");
    baniDiv.appendChild(pauriSpan);
  }
}

function getBaniNameFromPath(pathn) {
  if (!pathn || pathn == "/") return;
  
  pathn = pathn.substring(pathn.lastIndexOf("/"));
  return pathn;
}

async function init() {

  // Get pathname
  const pathn = location.pathname;

  // Load bani
  const bani = await loadBani(getBaniNameFromPath(pathn));
  if (!bani) return;

  // Render bani
  renderBani(bani);
}

await init();
