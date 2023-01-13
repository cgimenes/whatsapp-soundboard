window.onload = function () {
    let button = document.getElementById('send')
    button.onclick = send


    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, {function: 'get-id'}, (response) => {
            document.getElementById('response').textContent = response
        })
    })

    function send() {
        chrome.tabs.query({active: true, currentWindow: true}, tabs => {
            chrome.tabs.sendMessage(tabs[0].id, {function: 'send'})
        })
    }
}