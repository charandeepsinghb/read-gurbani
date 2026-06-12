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

// function renderAllBani() {

//   // Para
//   let para = document.createElement("div");

//   for (let i = 0; i < bani.length; i++) {

//     // Pauri
//     const pauri = bani[i];
//     const pauriSpan = document.createElement("span");
//     pauriSpan.innerText = pauri.unicode;

//     para.appendChild(pauriSpan);

//     if (i < bani.length-1 && pauri.paragraph < bani[i+1].paragraph) {
//       baniDiv.appendChild(para);
//       para = document.createElement("div");
//     } else if (i == bani.length-1) {
//       baniDiv.appendChild(para);
//     }
//   }
// }

let pages = [];
let currentPage = 0;

function renderPage(pageIndex) {

  const page = pages[pageIndex];

  baniDiv.replaceChildren();

  let para;

  for (let i = page.start; i <= page.end; i++) {

    if (!para) {
      para = document.createElement("div");
      para.className = "para";
      baniDiv.appendChild(para);
    }

    const span = document.createElement("span");
    span.id = "pauri-" + i;
    span.innerText = bani[i].unicode;

    para.appendChild(span);

    if (
      i !== page.end &&
      bani[i + 1].paragraph !== bani[i].paragraph
    ) {
      para = null;
    }
  }
}

function calculatePage(start) {

  baniDiv.replaceChildren();

  let para = document.createElement("div");
  para.className = "para";

  let end = start - 1;

  for (let i = start; i < bani.length; i++) {

    if (!para.parentNode) {
      baniDiv.appendChild(para);
    }

    const span = document.createElement("span");

    span.innerText = bani[i].unicode;

    para.appendChild(span);


    if (baniDiv.offsetHeight > window.innerHeight) {

      span.remove();

      if (para.children.length === 0) {
        para.remove();
      }

      break;
    }


    end = i;


    if (
      i < bani.length - 1 &&
      bani[i + 1].paragraph !== bani[i].paragraph
    ) {
      para = document.createElement("div");
      para.className = "para";
    }
  }


  pages[currentPage] = {
    start,
    end
  };

  renderPage(pages.length - 1);
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

  const page = pages[currentPage];

  if (page.end >= bani.length - 1) {
    return;
  }


  currentPage++;


  if (pages[currentPage]) {
    renderPage(currentPage);
    return;
  }


  calculatePage(page.end + 1);
}
function prev() {

  if (currentPage === 0) {
    return;
  }


  currentPage--;

  renderPage(currentPage);
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
  calculatePage(0);
}

(async () => await init())()
