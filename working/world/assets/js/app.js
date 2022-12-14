// We import the CSS which is extracted to its own file by esbuild.
// Remove this line if you add a your own CSS build pipeline (e.g postcss).
import "../css/app.css"

// If you want to use Phoenix channels, run `mix help phx.gen.channel`
// to get started and then uncomment the line below.
// import "./socket.js"

// You can include dependencies in two ways.
//
// The simplest option is to put them in assets/vendor and
// import them using relative paths:
//
//     import "../vendor/some-package.js"
//
// Alternatively, you can `npm install some-package --prefix assets` and import
// them using a path starting with the package name:
//
//     import "some-package"
//

// Include phoenix_html to handle method=PUT/DELETE in forms and buttons.
import "phoenix_html"
// Establish Phoenix Socket and LiveView configuration.
import {Socket} from "phoenix"
import {LiveSocket} from "phoenix_live_view"
import topbar from "../vendor/topbar"

let csrfToken = document.querySelector("meta[name='csrf-token']").getAttribute("content")
let liveSocket = new LiveSocket("/live", Socket, {params: {_csrf_token: csrfToken}})

// Show progress bar on live navigation and form submits
topbar.config({barColors: {0: "#29d"}, shadowColor: "rgba(0, 0, 0, .3)"})
window.addEventListener("phx:page-loading-start", info => topbar.show())
window.addEventListener("phx:page-loading-stop", info => topbar.hide())

// connect if there are any LiveViews on the page
liveSocket.connect()

// expose liveSocket on window for web console debug logs and latency simulation:
// >> liveSocket.enableDebug()
// >> liveSocket.enableLatencySim(1000)  // enabled for duration of browser session
// >> liveSocket.disableLatencySim()
window.liveSocket = liveSocket

const socket = new Socket("/socket", {})

socket.connect()

const channel = socket.channel("ping")

channel.join()
.receive("ok", resp => { console.log("Joined ping", resp) })
.receive("error", resp => { console.log("Unable to join ping", resp) })

console.log("send ping")
channel.push("ping")
.receive("ok", resp => console.log("receive", resp.ping))

window.anal = channel

console.log("send pong")
channel.push("pong")
.receive("ok", resp => console.log("won't happen"))
.receive("error", resp => console.error("won't happen yet"))
.receive("timeout", resp => console.error("pong message timeout", resp))

channel.push("param_ping", { error: true })
.receive("error", resp => console.error("param_ping error:", resp))

channel.push("param_ping", { error: false, arr: [1, 2] })
.receive("ok", resp => console.log("param_ping ok:", resp))

channel.push("invalid")
.receive("ok", resp => console.log("won't happen"))
.receive("error", resp => console.error("won't happen"))
.receive("timeout", resp => console.error("invalid event timeout"))