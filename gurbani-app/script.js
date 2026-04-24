async function loadFeature() {
  const module = await import('./japji-sahib-bani.js');
  console.log(module.JAPJI_SAHIB)
}

(async () => {
  await loadFeature("japji-sahib-bani.js")
})()
