/**
 * Created by godsong on 16/10/7.
 */
import EventEmitter from "./EventEmitter";
class Port extends EventEmitter {
    constructor(proxy) {
        super();
        this.id = chrome.devtools.inspectedWindow.tabId;
        this.proxy = proxy;
        this._port = chrome.runtime.connect({
            name: '' + chrome.devtools.inspectedWindow.tabId + '@' + this.proxy
        });
        this._port.onMessage.addListener(message=>this.emit('data', message));
    }

    send(msg) {
        this._port.postMessage(msg);
    }
}

export default Port;