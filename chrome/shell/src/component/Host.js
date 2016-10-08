/**
 * Created by godsong on 16/9/19.
 */
import Websocket from "./Websocket.js"
class PortManager {
    constructor(port) {
        this.port = port;
    }

    connect() {

    }
}

var portManager = new PortManager();
class Host {
    constructor() {
        chrome.runtime.onConnect.addListener(function (port) {
            let [tabId,proxy]=port.name.split('@');
            let ws = new Websocket(proxy);
            ws.on('*', function (data) {
                console.log(data);
                port.postMessage(data);
            });
            port.onMessage.addListener(function (message) {
                ws.send(message);
            });
            port.onDisconnect.addListener(function () {
                ws.close();
            })
        });

    }

}
export default Host;