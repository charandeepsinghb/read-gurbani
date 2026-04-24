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

async function init() {

  // Get pathname
  const pathn = location.pathname;
  if (!pathn || pathn == "/") return;

  // Load bani
  const bani = await loadBani(pathn)

  // Render bani
  renderBani(bani);
}

await init();
