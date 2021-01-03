// chrome.tabs.onActivated.addListener(tab => {
//     chrome.tabs.get(tab.tabId, current_tab_info => {
//         if (/^https:\/\/web\.whatsapp\.com/.test(current_tab_info.url!)) {
//             chrome.tabs.insertCSS(null!, { file: './src/css/styles.css' })
//             chrome.tabs.executeScript(null!, { file: './build/foreground.js' }, () => console.log("injected"))
//         }
//     })
// })
