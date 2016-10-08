/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _Host = __webpack_require__(1);
	
	var _Host2 = _interopRequireDefault(_Host);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	new _Host2.default(); /**
	                       * Created by godsong on 16/9/22.
	                       */

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by godsong on 16/9/19.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */
	
	
	var _Websocket = __webpack_require__(2);
	
	var _Websocket2 = _interopRequireDefault(_Websocket);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var PortManager = function () {
	    function PortManager(port) {
	        _classCallCheck(this, PortManager);
	
	        this.port = port;
	    }
	
	    _createClass(PortManager, [{
	        key: 'connect',
	        value: function connect() {}
	    }]);
	
	    return PortManager;
	}();
	
	var portManager = new PortManager();
	
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
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var EventEmitter = __webpack_require__(3);
	
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
/* 3 */
/***/ function(module, exports) {

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

/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNzczNzQ2ZmE4OGI3YzNlZDQ1MTEiLCJ3ZWJwYWNrOi8vLy4vc3JjL2JhY2tncm91bmQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudC9Ib3N0LmpzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnQvV2Vic29ja2V0LmpzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnQvRXZlbnRFbWl0dGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7QUNuQ0E7Ozs7OztBQUVBLHNCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNGQTs7Ozs7Ozs7S0FDTSxXO0FBQ0YsMEJBQVksSUFBWixFQUFrQjtBQUFBOztBQUNkLGNBQUssSUFBTCxHQUFZLElBQVo7QUFDSDs7OzttQ0FFUyxDQUVUOzs7Ozs7QUFHTCxLQUFJLGNBQWMsSUFBSSxXQUFKLEVBQWxCOztLQUNNLEksR0FDRixnQkFBYztBQUFBOztBQUNWLFlBQU8sT0FBUCxDQUFlLFNBQWYsQ0FBeUIsV0FBekIsQ0FBcUMsVUFBVSxJQUFWLEVBQWdCO0FBQUEsZ0NBQy9CLEtBQUssSUFBTCxDQUFVLEtBQVYsQ0FBZ0IsR0FBaEIsQ0FEK0I7O0FBQUE7O0FBQUEsYUFDNUMsS0FENEM7QUFBQSxhQUN0QyxLQURzQzs7QUFFakQsYUFBSSxLQUFLLHdCQUFjLEtBQWQsQ0FBVDtBQUNBLFlBQUcsRUFBSCxDQUFNLEdBQU4sRUFBVyxVQUFVLElBQVYsRUFBZ0I7QUFDdkIscUJBQVEsR0FBUixDQUFZLElBQVo7QUFDQSxrQkFBSyxXQUFMLENBQWlCLElBQWpCO0FB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QUNKLGNBQUssQ0FBTDtBQUNJLG9CQUFPLEtBQUssSUFBTCxDQUFVLElBQVYsRUFBZ0IsS0FBSyxDQUFMLENBQWhCLEVBQXlCLEtBQUssQ0FBTCxDQUF6QixFQUFrQyxLQUFLLENBQUwsQ0FBbEMsQ0FBUDtBQUNKLGNBQUssQ0FBTDtBQUNJLG9CQUFPLEtBQUssSUFBTCxDQUFVLElBQVYsRUFBZ0IsS0FBSyxDQUFMLENBQWhCLEVBQXlCLEtBQUssQ0FBTCxDQUF6QixFQUFrQyxLQUFLLENBQUwsQ0FBbEMsRUFBMkMsS0FBSyxDQUFMLENBQTNDLENBQVA7QUFDSjtBQUNJLG9CQUFPLEtBQUssS0FBTCxDQUFXLElBQVgsRUFBaUIsSUFBakIsQ0FBUDtBQVpSO0FBY0g7O0FBRUQsVUFBUyxTQUFULENBQW1CLElBQW5CLEVBQXlCLEtBQXpCLEVBQWdDO0FBQzVCLFVBQUssSUFBSSxJQUFJLEtBQVIsRUFBZSxJQUFJLElBQUksQ0FBdkIsRUFBMEIsSUFBSSxLQUFLLE1BQXhDLEVBQWdELElBQUksQ0FBcEQsRUFBdUQsS0FBSyxDQUFMLEVBQVEsS0FBSyxDQUFwRTtBQUNJLGNBQUssQ0FBTCxJQUFVLEtBQUssQ0FBTCxDQUFWO0FBREosTUFFQSxLQUFLLEdBQUw7QUFDSDtBQUNELEtBQUksT0FBTyxNQUFQLEtBQWtCLFdBQWxCLElBQWlDLE9BQU8sT0FBNUMsRUFBcUQ7QUFDakQsWUFBTyxPQUFQLEdBQWlCLFlBQWpCO0FBQ0gsRSIsImZpbGUiOiJiYWNrZ3JvdW5kLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiB3ZWJwYWNrL2Jvb3RzdHJhcCA3NzM3NDZmYTg4YjdjM2VkNDUxMVxuICoqLyIsIi8qKlxuICogQ3JlYXRlZCBieSBnb2Rzb25nIG9uIDE2LzkvMjIuXG4gKi9cbmltcG9ydCBIb3N0IGZyb20gXCIuL2NvbXBvbmVudC9Ib3N0LmpzXCJcblxubmV3IEhvc3QoKTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9iYWNrZ3JvdW5kLmpzXG4gKiovIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGdvZHNvbmcgb24gMTYvOS8xOS5cbiAqL1xuaW1wb3J0IFdlYnNvY2tldCBmcm9tIFwiLi9XZWJzb2NrZXQuanNcIlxuY2xhc3MgUG9ydE1hbmFnZXIge1xuICAgIGNvbnN0cnVjdG9yKHBvcnQpIHtcbiAgICAgICAgdGhpcy5wb3J0ID0gcG9ydDtcbiAgICB9XG5cbiAgICBjb25uZWN0KCkge1xuXG4gICAgfVxufVxuXG52YXIgcG9ydE1hbmFnZXIgPSBuZXcgUG9ydE1hbmFnZXIoKTtcbmNsYXNzIEhvc3Qge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBjaHJvbWUucnVudGltZS5vbkNvbm5lY3QuYWRkTGlzdGVuZXIoZnVuY3Rpb24gKHBvcnQpIHtcbiAgICAgICAgICAgIGxldCBbdGFiSWQscHJveHldPXBvcnQubmFtZS5zcGxpdCgnQCcpO1xuICAgICAgICAgICAgbGV0IHdzID0gbmV3IFdlYnNvY2tldChwcm94eSk7XG4gICAgICAgICAgICB3cy5vbignKicsIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XG4gICAgICAgICAgICAgICAgcG9ydC5wb3N0TWVzc2FnZShkYXRhKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcG9ydC5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoZnVuY3Rpb24gKG1lc3NhZ2UpIHtcbiAgICAgICAgICAgICAgICB3cy5zZW5kKG1lc3NhZ2UpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBwb3J0Lm9uRGlzY29ubmVjdC5hZGRMaXN0ZW5lcihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgd3MuY2xvc2UoKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG59XG5leHBvcnQgZGVmYXVsdCBIb3N0O1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2NvbXBvbmVudC9Ib3N0LmpzXG4gKiovIiwidmFyIEV2ZW50RW1pdHRlciA9IHJlcXVpcmUoJy4vRXZlbnRFbWl0dGVyJyk7XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXZWJzb2NrZXRDbGllbnQgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuICAgIGNvbnN0cnVjdG9yKHVybCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmNvbm5lY3QodXJsKTtcbiAgICB9XG5cbiAgICBjb25uZWN0KHVybCkge1xuICAgICAgICB2YXIgVGhpcyA9IHRoaXM7XG4gICAgICAgIFRoaXMuaXNTb2NrZXRSZWFkeSA9IGZhbHNlO1xuICAgICAgICBUaGlzLl9zZW5kZWQgPSBbXTtcbiAgICAgICAgVGhpcy5fcmVjZWl2ZWQgPSBbXTtcbiAgICAgICAgaWYgKFRoaXMud3MpIHtcbiAgICAgICAgICAgIFRoaXMud3Mub25vcGVuID0gbnVsbDtcbiAgICAgICAgICAgIFRoaXMud3Mub25tZXNzYWdlID0gbnVsbDtcbiAgICAgICAgICAgIFRoaXMud3Mub25jbG9zZSA9IG51bGw7XG4gICAgICAgICAgICBpZiAoVGhpcy53cy5yZWFkeVN0YXRlID09IFdlYlNvY2tldC5PUEVOKSB7XG4gICAgICAgICAgICAgICAgVGhpcy53cy5jbG9zZSgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cbiAgICAgICAgdmFyIHdzID0gbmV3IFdlYlNvY2tldCh1cmwpO1xuICAgICAgICBUaGlzLndzID0gd3M7XG4gICAgICAgIHdzLm9ub3BlbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIFRoaXMuaXNTb2NrZXRSZWFkeSA9IHRydWU7XG4gICAgICAgICAgICBUaGlzLmVtaXQoJ3NvY2tldE9wZW5lZCcpO1xuICAgICAgICB9O1xuICAgICAgICB3cy5vbm1lc3NhZ2UgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgdmFyIG1lc3NhZ2UgPSBKU09OLnBhcnNlKGUuZGF0YSk7XG4gICAgICAgICAgICBpZiAobWVzc2FnZS5tZXRob2QpIHtcbiAgICAgICAgICAgICAgICBUaGlzLl9yZWNlaXZlZC5wdXNoKG1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgIFRoaXMuZW1pdChtZXNzYWdlLm1ldGhvZCwgbWVzc2FnZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBUaGlzLmVtaXQoJ2RhdGEnLCBtZXNzYWdlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgd3Mub25jbG9zZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIFRoaXMuaXNTb2NrZXRSZWFkeSA9IGZhbHNlO1xuICAgICAgICAgICAgLyogc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICAgICAgIFRoaXMuY29ubmVjdCh1cmwpO1xuICAgICAgICAgICAgIH0sODAwKTsqL1xuICAgICAgICB9O1xuXG4gICAgfVxuXG4gICAgY2xvc2UoKSB7XG4gICAgICAgIHRoaXMud3MuY2xvc2UoKTtcbiAgICB9XG5cbiAgICBzZW5kKGRhdGEpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNTb2NrZXRSZWFkeSkge1xuICAgICAgICAgICAgdGhpcy5fc2VuZGVkLnB1c2goZGF0YSk7XG4gICAgICAgICAgICB0aGlzLndzLnNlbmQoSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5vbmNlKCdzb2NrZXRPcGVuZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fc2VuZGVkLnB1c2goZGF0YSk7XG4gICAgICAgICAgICAgICAgdGhpcy53cy5zZW5kKEpTT04uc3RyaW5naWZ5KGRhdGEpKVxuICAgICAgICAgICAgfS5iaW5kKHRoaXMpKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2NvbXBvbmVudC9XZWJzb2NrZXQuanNcbiAqKi8iLCIvKipcbiAqIENyZWF0ZWQgYnkgZ29kc29uZyBvbiAxNi82LzI5LlxuICovXG5mdW5jdGlvbiBFdmVudENvbnRleHQoaG9zdCkge1xuICAgIHRoaXMuaG9zdCA9IGhvc3Q7XG4gICAgdGhpcy5fcHJvcGFnYWJsZSA9IHRydWU7XG4gICAgdGhpcy5fcHJldmVudERlZmF1bHQgPSBmYWxzZTtcbn1cbkV2ZW50Q29udGV4dC5wcm90b3R5cGUgPSB7XG4gICAgY29uc3RydWN0b3I6IEV2ZW50Q29udGV4dCxcbiAgICBzdG9wUHJvcGFnYXRpb246IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5fcHJvcGFnYWJsZSA9IGZhbHNlO1xuICAgIH0sXG4gICAgcHJldmVudERlZmF1bHQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5fcHJldmVudERlZmF1bHQgPSB0cnVlO1xuICAgIH1cblxufTtcbmZ1bmN0aW9uIF9tZXJnZUNvbmZpZyhkZWZhdWx0Q29uZmlnLCB1c2VyQ29uZmlnKSB7XG4gICAgdmFyIGNvbmZpZyA9IHt9O1xuICAgIGZvciAodmFyIGsgaW4gZGVmYXVsdENvbmZpZykge1xuICAgICAgICBpZiAoZGVmYXVsdENvbmZpZy5oYXNPd25Qcm9wZXJ0eShrKSkge1xuICAgICAgICAgICAgY29uZmlnW2tdID0gdXNlckNvbmZpZyAmJiB1c2VyQ29uZmlnW2tdICE9PSB1bmRlZmluZWQgPyB1c2VyQ29uZmlnW2tdIDogZGVmYXVsdENvbmZpZ1trXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gY29uZmlnO1xufVxuZnVuY3Rpb24gRXZlbnRFbWl0dGVyKGNvbmZpZykge1xuICAgIHRoaXMuX2hhbmRsZXJzID0ge307XG4gICAgdGhpcy5jb25maWcgPSBfbWVyZ2VDb25maWcoe1xuICAgICAgICBjYWNoZTogZmFsc2VcbiAgICB9LCBjb25maWcpO1xuICAgIHRoaXMuX2VtaXRDYWNoZXMgPSBbXTtcbn1cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUgPSB7XG4gICAgY29uc3RydWN0b3I6IEV2ZW50RW1pdHRlcixcbiAgICBvZmY6IGZ1bmN0aW9uIChtZXRob2QsIGhhbmRsZXIpIHtcbiAgICAgICAgaWYgKGhhbmRsZXIpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5faGFuZGxlcnNbbWV0aG9kXS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9oYW5kbGVyc1ttZXRob2RdW2ldID09PSBoYW5kbGVyKSB7XG4gICAgICAgICAgICAgICAgICAgIHNwbGljZU9uZSh0aGlzLl9oYW5kbGVyc1ttZXRob2RdLCBpKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKG1ldGhvZCkge1xuICAgICAgICAgICAgdGhpcy5faGFuZGxlcnNbbWV0aG9kXSA9IFtdO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5faGFuZGxlcnMgPSB7fTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgb25jZTogZnVuY3Rpb24gKG1ldGhvZCwgaGFuZGxlcikge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHZhciBmaXJlZCA9IGZhbHNlO1xuXG4gICAgICAgIGZ1bmN0aW9uIGcoKSB7XG4gICAgICAgICAgICBzZWxmLm9mZihtZXRob2QsIGcpO1xuICAgICAgICAgICAgaWYgKCFmaXJlZCkge1xuICAgICAgICAgICAgICAgIGZpcmVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBfZmFzdEFwcGx5KGhhbmRsZXIsIHRoaXMsIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cykpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm9uKG1ldGhvZCwgZyk7XG4gICAgfSxcbiAgICBvbjogZnVuY3Rpb24gKG1ldGhvZCwgaGFuZGxlciwgaW5kZXgpIHtcbiAgICAgICAgaWYgKHRoaXMuX2hhbmRsZXJzW21ldGhvZF0pIHtcbiAgICAgICAgICAgIGlmIChpc0Zpbml0ZShpbmRleCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9oYW5kbGVycy5zcGxpY2UoaW5kZXgsIDAsIGhhbmRsZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5faGFuZGxlcnNbbWV0aG9kXS5wdXNoKGhhbmRsZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5faGFuZGxlcnNbbWV0aG9kXSA9IFtoYW5kbGVyXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5fZW1pdENhY2hlc1ttZXRob2RdICYmIHRoaXMuX2VtaXRDYWNoZXNbbWV0aG9kXS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBsZXQgZW1pdFZhbHVlO1xuICAgICAgICAgICAgICAgIHdoaWxlIChlbWl0VmFsdWUgPSBzZWxmLl9lbWl0Q2FjaGVzW21ldGhvZF0uc2hpZnQoKSkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLl9lbWl0KG1ldGhvZCwgZW1pdFZhbHVlLCBuZXcgRXZlbnRDb250ZXh0KHNlbGYpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgX2VtaXQ6IGZ1bmN0aW9uIChtZXRob2QsIGFyZ3MsIGNvbnRleHQpIHtcbiAgICAgICAgdmFyIGhhbmRsZXJzID0gdGhpcy5faGFuZGxlcnNbbWV0aG9kXTtcbiAgICAgICAgaWYgKGhhbmRsZXJzICYmIGhhbmRsZXJzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHZhciBjb3BpZWRIYW5kbGVycyA9IGhhbmRsZXJzLmNvbmNhdCgpO1xuICAgICAgICAgICAgY29waWVkSGFuZGxlcnMuZm9yRWFjaChmdW5jdGlvbiAoaGFuZGxlcikge1xuICAgICAgICAgICAgICAgIF9mYXN0QXBwbHkoaGFuZGxlciwgY29udGV4dCwgYXJncylcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIF9lbWl0TmFtZXNwYWNlOiBmdW5jdGlvbiAobnMsIG1vZGUsIGFyZ3MsIGNvbnRleHQpIHtcbiAgICAgICAgaWYgKG5zLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5fZW1pdChucy5qb2luKCcuJykgKyAnLicgKyBtb2RlLCBhcmdzLCBjb250ZXh0KSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9lbWl0TmFtZXNwYWNlKG5zLnNsaWNlKDAsIC0xKSwgbW9kZSwgYXJncywgY29udGV4dCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9lbWl0KG1vZGUsIGFyZ3MsIGNvbnRleHQpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBlbWl0OiBmdW5jdGlvbiAobWV0aG9kKSB7XG4gICAgICAgIHZhciBjb250ZXh0ID0gbmV3IEV2ZW50Q29udGV4dCh0aGlzKTtcbiAgICAgICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgICAgICB2YXIgbnMgPSBtZXRob2Quc3BsaXQoJy4nKTtcbiAgICAgICAgdmFyIG5vdEVtcHR5ID0gZmFsc2U7XG4gICAgICAgIGlmICghdGhpcy5fZW1pdChtZXRob2QsIGFyZ3MsIGNvbnRleHQpKSB7XG4gICAgICAgICAgICBub3RFbXB0eSA9IHRoaXMuX2VtaXROYW1lc3BhY2UobnMsICcqJywgYXJncywgY29udGV4dClcbiAgICAgICAgfVxuICAgICAgICBub3RFbXB0eSA9IHRoaXMuX2VtaXROYW1lc3BhY2UobnMsICcrJywgYXJncywgY29udGV4dCk7XG4gICAgICAgIGlmICghbm90RW1wdHkgJiYgdGhpcy5jb25maWcuY2FjaGUpIHtcbiAgICAgICAgICAgICh0aGlzLl9lbWl0Q2FjaGVzW21ldGhvZF0gfHwgKHRoaXMuX2VtaXRDYWNoZXNbbWV0aG9kXSA9IFtdKSkucHVzaChhcmdzKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29udGV4dDtcbiAgICB9XG59O1xuXG5mdW5jdGlvbiBfZmFzdEFwcGx5KGZ1bmMsIHRoYXQsIGFyZ3MpIHtcbiAgICBhcmdzID0gYXJncyB8fCBbXTtcbiAgICBzd2l0Y2ggKGFyZ3MubGVuZ3RoKSB7XG4gICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgIHJldHVybiBmdW5jLmNhbGwodGhhdCk7XG4gICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgIHJldHVybiBmdW5jLmNhbGwodGhhdCwgYXJnc1swXSk7XG4gICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgIHJldHVybiBmdW5jLmNhbGwodGhhdCwgYXJnc1swXSwgYXJnc1sxXSk7XG4gICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgIHJldHVybiBmdW5jLmNhbGwodGhhdCwgYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSk7XG4gICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgIHJldHVybiBmdW5jLmNhbGwodGhhdCwgYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSwgYXJnc1szXSlcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHJldHVybiBmdW5jLmFwcGx5KHRoYXQsIGFyZ3MpO1xuICAgIH1cbn1cbi8vIEFib3V0IDEuNXggZmFzdGVyIHRoYW4gdGhlIHR3by1hcmcgdmVyc2lvbiBvZiBBcnJheSNzcGxpY2UoKS5cbmZ1bmN0aW9uIHNwbGljZU9uZShsaXN0LCBpbmRleCkge1xuICAgIGZvciAodmFyIGkgPSBpbmRleCwgayA9IGkgKyAxLCBuID0gbGlzdC5sZW5ndGg7IGsgPCBuOyBpICs9IDEsIGsgKz0gMSlcbiAgICAgICAgbGlzdFtpXSA9IGxpc3Rba107XG4gICAgbGlzdC5wb3AoKTtcbn1cbmlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgIG1vZHVsZS5leHBvcnRzID0gRXZlbnRFbWl0dGVyO1xufVxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2NvbXBvbmVudC9FdmVudEVtaXR0ZXIuanNcbiAqKi8iXSwic291cmNlUm9vdCI6IiJ9