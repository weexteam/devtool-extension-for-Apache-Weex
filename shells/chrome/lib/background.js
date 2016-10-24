/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmory imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmory exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		Object.defineProperty(exports, name, {
/******/ 			configurable: false,
/******/ 			enumerable: true,
/******/ 			get: getter
/******/ 		});
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

"use strict";
'use strict';

/**
 * Created by godsong on 16/6/29.
 */
function EventContext(host) {
    this.host = host;
    this._propagable = true;
    this._preventDefault = false;
}
EventContext.prototype = {
    constructor: EventContext,
    stopPropagation: function stopPropagation() {
        this._propagable = false;
    },
    preventDefault: function preventDefault() {
        this._preventDefault = true;
    }

};
function _mergeConfig(defaultConfig, userConfig) {
    var config = {};
    for (var k in defaultConfig) {
        if (defaultConfig.hasOwnProperty(k)) {
            config[k] = userConfig && userConfig[k] !== undefined ? userConfig[k] : defaultConfig[k];
        }
    }
    return config;
}
function EventEmitter(config) {
    this._handlers = {};
    this.config = _mergeConfig({
        cache: false
    }, config);
    this._emitCaches = [];
}
EventEmitter.prototype = {
    constructor: EventEmitter,
    off: function off(method, handler) {
        if (handler) {
            for (var i = 0; i < this._handlers[method].length; i++) {
                if (this._handlers[method][i] === handler) {
                    spliceOne(this._handlers[method], i);
                    break;
                }
            }
        } else if (method) {
            this._handlers[method] = [];
        } else {
            this._handlers = {};
        }
    },
    once: function once(method, handler) {
        var self = this;
        var fired = false;

        function g() {
            self.off(method, g);
            if (!fired) {
                fired = true;
                _fastApply(handler, this, Array.prototype.slice.call(arguments));
            }
        }

        this.on(method, g);
    },
    on: function on(method, handler, index) {
        if (this._handlers[method]) {
            if (isFinite(index)) {
                this._handlers.splice(index, 0, handler);
            } else {
                this._handlers[method].push(handler);
            }
        } else {
            this._handlers[method] = [handler];
        }
        if (this._emitCaches[method] && this._emitCaches[method].length > 0) {
            var self = this;
            setTimeout(function () {
                var emitValue = void 0;
                while (emitValue = self._emitCaches[method].shift()) {
                    self._emit(method, emitValue, new EventContext(self));
                }
            });
        }
    },
    _emit: function _emit(method, args, context) {
        var handlers = this._handlers[method];
        if (handlers && handlers.length > 0) {
            var copiedHandlers = handlers.concat();
            copiedHandlers.forEach(function (handler) {
                _fastApply(handler, context, args);
            });
            return true;
        } else {
            return false;
        }
    },
    _emitNamespace: function _emitNamespace(ns, mode, args, context) {
        if (ns.length > 1) {
            if (!this._emit(ns.join('.') + '.' + mode, args, context)) {
                return this._emitNamespace(ns.slice(0, -1), mode, args, context);
            } else {
                return true;
            }
        } else {
            return this._emit(mode, args, context);
        }
    },
    emit: function emit(method) {
        var context = new EventContext(this);
        var args = Array.prototype.slice.call(arguments, 1);
        var ns = method.split('.');
        var notEmpty = false;
        if (!this._emit(method, args, context)) {
            notEmpty = this._emitNamespace(ns, '*', args, context);
        }
        notEmpty = this._emitNamespace(ns, '+', args, context);
        if (!notEmpty && this.config.cache) {
            (this._emitCaches[method] || (this._emitCaches[method] = [])).push(args);
        }
        return context;
    }
};

function _fastApply(func, that, args) {
    args = args || [];
    switch (args.length) {
        case 0:
            return func.call(that);
        case 1:
            return func.call(that, args[0]);
        case 2:
            return func.call(that, args[0], args[1]);
        case 3:
            return func.call(that, args[0], args[1], args[2]);
        case 4:
            return func.call(that, args[0], args[1], args[2], args[3]);
        default:
            return func.apply(that, args);
    }
}
// About 1.5x faster than the two-arg version of Array#splice().
function spliceOne(list, index) {
    for (var i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1) {
        list[i] = list[k];
    }list.pop();
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EventEmitter;
}

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _Websocket = __webpack_require__(5);

var _Websocket2 = _interopRequireDefault(_Websocket);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } /**
                                                                                                                                                           * Created by godsong on 16/9/19.
                                                                                                                                                           */


var Host = function Host() {
    _classCallCheck(this, Host);

    chrome.runtime.onConnect.addListener(function (port) {
        var _port$name$split = port.name.split('@');

        var _port$name$split2 = _slicedToArray(_port$name$split, 2);

        var tabId = _port$name$split2[0];
        var proxy = _port$name$split2[1];

        var ws = new _Websocket2.default(proxy);
        ws.on('*', function (data) {
            console.log(data);
            port.postMessage(data);
        });
        port.onMessage.addListener(function (message) {
            ws.send(message);
        });
        port.onDisconnect.addListener(function () {
            ws.close();
        });
    });
};

exports.default = Host;

/***/ },
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EventEmitter = __webpack_require__(0);

var WebsocketClient = function (_EventEmitter) {
    _inherits(WebsocketClient, _EventEmitter);

    function WebsocketClient(url) {
        _classCallCheck(this, WebsocketClient);

        var _this = _possibleConstructorReturn(this, (WebsocketClient.__proto__ || Object.getPrototypeOf(WebsocketClient)).call(this));

        _this.connect(url);
        return _this;
    }

    _createClass(WebsocketClient, [{
        key: 'connect',
        value: function connect(url) {
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
                } else {
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
    }, {
        key: 'close',
        value: function close() {
            this.ws.close();
        }
    }, {
        key: 'send',
        value: function send(data) {
            if (this.isSocketReady) {
                this._sended.push(data);
                this.ws.send(JSON.stringify(data));
            } else {
                this.once('socketOpened', function () {
                    this._sended.push(data);
                    this.ws.send(JSON.stringify(data));
                }.bind(this));
            }
        }
    }]);

    return WebsocketClient;
}(EventEmitter);

exports.default = WebsocketClient;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";

var _Host = __webpack_require__(1);

var _Host2 = _interopRequireDefault(_Host);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

new _Host2.default(); /**
                       * Created by godsong on 16/9/22.
                       */

/***/ }
/******/ ]);