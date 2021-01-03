(async () => {
  const src = chrome.extension.getURL('src/js/foreground.js');
  const contentScript = await import(src);
  contentScript.main();
})();