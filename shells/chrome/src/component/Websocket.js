var EventEmitter = require('./EventEmitter');
export default class WebsocketClient extends EventEmitter {
    constructor(url) {
        super();
        this.connect(url);
    }

    connect(url) {
        var This = this;
        This.isSocketReady = false;
        This._sended = [];
        This._received = [];
        if (This.ws) {
            This.ws.onopen = null;
            This.ws.onmessage = null;
            This.ws.onclose = null;
            if (This.ws.readyState == WebSocket.OPEN) {
                This.ws.close();
            }

        }
        var ws = new WebSocket(url);
        This.ws = ws;
        ws.onopen = function () {
            This.isSocketReady = true;
            This.emit('socketOpened');
        };
        ws.onmessage = function (e) {
            var message = JSON.parse(e.data);
            if (message.method) {
                This._received.push(message);
                This.emit(message.method, message);
            }
            else {
                This.emit('data', message);
            }
        };
        ws.onclose = function () {
            This.isSocketReady = false;
            /* setTimeout(function(){
             This.connect(url);
             },800);*/
        };

    }

    close() {
        this.ws.close();
    }

    send(data) {
        if (this.isSocketReady) {
            this._sended.push(data);
            this.ws.send(JSON.stringify(data));
        }
        else {
            this.once('socketOpened', function () {
                this._sended.push(data);
                this.ws.send(JSON.stringify(data))
            }.bind(this));
        }
    }
}
