// ==== Banis ====

const BANIS = [
  {
    name: "Japji Sahib",
    path: "japji-sahib",
    baniFile: "japji-sahib.json"
  },
  {
    name: "Sukhmani Sahib",
    path: "sukhmani-sahib",
    baniFile: "sukhmani-sahib.json"
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
  const pathn = location.pathname;
  const path = pathn.substring(pathn.lastIndexOf("/") + 1);

  if (!path) return;

  return BANIS.find(x => x.path == path);
}

// ==== Load and Render Bani ====

const baniDiv = document.getElementById("bani");
let bani;

async function loadBani() {
  const { baniFile } = getCurrentBaniProperties() || {};

  if (!baniFile) return;

  const response = await fetch("./" + baniFile);

  return response.json();
}

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

// ==== Bookmark ====

function getBookmarkKey() {
  const props = getCurrentBaniProperties();
  return props ? `bookmark-${props.path}` : null;
}

function saveBookmark() {
  const key = getBookmarkKey();
  if (!key || !pages[currentPage]) return;
  localStorage.setItem(key, String(pages[currentPage].start));
}

function loadBookmark() {
  const key = getBookmarkKey();
  if (!key) return null;
  const val = localStorage.getItem(key);
  return val !== null ? parseInt(val, 10) : null;
}

function clearBookmark() {
  const key = getBookmarkKey();
  if (key) localStorage.removeItem(key);
}

function restart() {
  pages = [];
  currentPage = 0;
  clearBookmark();
  calculatePage(0);
  toggleSettings();
}

// ==== Tap Indicator Overlay ====

const ICONS = {
  bookmark: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>`,
  settings: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
  prev: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`,
  next: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`
};

const QUADRANTS = [
  { cls: "tl", action: "bookmark", icon: ICONS.bookmark },
  { cls: "tr", action: "settings", icon: ICONS.settings },
  { cls: "bl", action: "prev", icon: ICONS.prev },
  { cls: "br", action: "next", icon: ICONS.next }
];

function createTapIndicator() {
  const overlay = document.createElement("div");
  overlay.className = "tap-indicator";

  for (const q of QUADRANTS) {
    const div = document.createElement("div");
    div.className = `quadrant ${q.cls}`;
    div.dataset.action = q.action;
    div.innerHTML = q.icon;
    overlay.appendChild(div);
  }

  document.body.appendChild(overlay);
  return overlay;
}

let tapTimeout = null;

function showTapIcon(quadrantCls) {
  const overlay = document.querySelector(".tap-indicator");
  if (!overlay) return;

  clearTimeout(tapTimeout);

  for (const q of overlay.querySelectorAll(".quadrant")) {
    q.classList.remove("show");
  }

  const target = overlay.querySelector(`.quadrant.${quadrantCls}`);
  if (target) target.classList.add("show");

  overlay.classList.add("active");

  tapTimeout = setTimeout(() => {
    overlay.classList.remove("active");
    for (const q of overlay.querySelectorAll(".quadrant")) {
      q.classList.remove("show");
    }
  }, 1000);
}

// ==== Touch ===

window.addEventListener("click", (e) => {
  if (!bani) return;
  if (e.target.closest(".settings-overlay")) return;

  const x = e.clientX;
  const y = e.clientY;
  const halfW = window.innerWidth / 2;
  const halfH = window.innerHeight / 2;

  if (x < halfW && y < halfH) {
    saveBookmark();
    showTapIcon("tl");
  } else if (x >= halfW && y < halfH) {
    toggleSettings();
    showTapIcon("tr");
  } else if (x < halfW && y >= halfH) {
    prev();
    showTapIcon("bl");
  } else {
    next();
    showTapIcon("br");
  }
});

// ==== Settings Overlay ====

const FONT_SIZE_MIN = 12;
const FONT_SIZE_MAX = 48;
const FONT_SIZE_DEFAULT = 32;

const settingsOverlay = document.createElement("div");
settingsOverlay.className = "settings-overlay";

let showSettings = false;

function getFontSize() {
  const saved = localStorage.getItem("bani-font-size");
  if (saved !== null) {
    const num = parseInt(saved, 10);
    if (!isNaN(num) && num >= FONT_SIZE_MIN && num <= FONT_SIZE_MAX) {
      return num;
    }
  }
  return FONT_SIZE_DEFAULT;
}

function applyFontSize(size) {
  document.documentElement.style.setProperty("--bani-font-size", size + "px");
  localStorage.setItem("bani-font-size", String(size));

  const label = settingsOverlay.querySelector(".font-size-label");
  const slider = settingsOverlay.querySelector(".font-size-slider");
  if (label) label.textContent = size + "px";
  if (slider) slider.value = size;
}

function buildSettingsPanel() {
  const panel = document.createElement("div");
  panel.className = "settings-panel";

  const title = document.createElement("h2");
  title.textContent = "Settings";
  panel.appendChild(title);

  const label = document.createElement("label");
  label.htmlFor = "font-size-slider";
  label.textContent = "Font Size: ";

  const sizeLabel = document.createElement("span");
  sizeLabel.className = "font-size-label";
  sizeLabel.textContent = getFontSize() + "px";
  label.appendChild(sizeLabel);
  panel.appendChild(label);

  const slider = document.createElement("input");
  slider.type = "range";
  slider.id = "font-size-slider";
  slider.className = "font-size-slider";
  slider.min = FONT_SIZE_MIN;
  slider.max = FONT_SIZE_MAX;
  slider.step = 1;
  slider.value = getFontSize();
  slider.addEventListener("input", () => {
    applyFontSize(parseInt(slider.value, 10));
  });
  panel.appendChild(slider);

  if (bani) {
    const restartBtn = document.createElement("button");
    restartBtn.className = "restart-btn";
    restartBtn.textContent = "Restart from beginning";
    restartBtn.addEventListener("click", () => restart());
    panel.appendChild(restartBtn);
  }

  const closeBtn = document.createElement("button");
  closeBtn.className = "close-btn";
  closeBtn.textContent = "Close";
  closeBtn.addEventListener("click", () => toggleSettings());
  panel.appendChild(closeBtn);

  return panel;
}

function overlaySettings() {
  settingsOverlay.appendChild(buildSettingsPanel());
  settingsOverlay.addEventListener("click", (e) => {
    if (e.target === settingsOverlay) {
      toggleSettings();
    }
  });
  document.body.appendChild(settingsOverlay);
}

function toggleSettings() {
  showSettings = !showSettings;
  settingsOverlay.classList.toggle("open", showSettings);

  if (showSettings) {
    const size = getFontSize();
    const slider = settingsOverlay.querySelector(".font-size-slider");
    const label = settingsOverlay.querySelector(".font-size-label");
    if (slider) slider.value = size;
    if (label) label.textContent = size + "px";
  }
}

// ==== Initialization ====

async function init() {
  bani = await loadBani();
  if (!bani) {
    renderBanisList(baniDiv);
    return;
  }

  applyFontSize(getFontSize());

  const bookmark = loadBookmark();

  if (bookmark !== null) {
    pages = [];
    currentPage = 0;
    calculatePage(0);

    while (true) {
      const page = pages[currentPage];
      if (bookmark >= page.start && bookmark <= page.end) break;
      if (page.end >= bani.length - 1) break;
      next();
    }
  } else {
    calculatePage(0);
  }

  overlaySettings();
  createTapIndicator();
}

(async () => await init())()
