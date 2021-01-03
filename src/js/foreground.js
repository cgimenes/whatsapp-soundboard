export function main() {
  console.log(
    "Is chrome.runtime available here?",
    typeof chrome.runtime.sendMessage == "function",
  );
}

// import { WAConnection, MessageType, MessageOptions, Mimetype } from '@adiwajshing/baileys'

// async function connectToWhatsApp() {
//   const conn = new WAConnection()
//   conn.loadAuthInfo({
//     WABrowserId: window.localStorage.getItem('WABrowserId'),
//     WASecretBundle: window.localStorage.getItem('WASecretBundle'),
//     WAToken1: window.localStorage.getItem('WAToken1'),
//     WAToken2: window.localStorage.getItem('WAToken2')
//   })
//   await conn.connect()

//   // const personId = '+19999999999@s.whatsapp.net'
//   // const groupId = '123456789-123345@g.us'
//   // const broadcastId = '[timestamp of creation]@broadcast'
//   // const buffer = fs.readFileSync("Media/audio.mp3")
//   // const options: MessageOptions = { mimetype: Mimetype.mp4Audio }
//   // conn.sendMessage(personId, buffer, MessageType.audio, options)
// }

// connectToWhatsApp()
//   .catch (err => console.log("unexpected error: " + err))