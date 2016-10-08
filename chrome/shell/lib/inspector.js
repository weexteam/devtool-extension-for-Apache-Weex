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
	
	var _NodeRender = __webpack_require__(4);
	
	var _Port = __webpack_require__(5);
	
	var _Port2 = _interopRequireDefault(_Port);
	
	var _StyleRender = __webpack_require__(6);
	
	var _StyleRender2 = _interopRequireDefault(_StyleRender);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	chrome.devtools.inspectedWindow.eval('$WeexInspectorProxy', function (proxy, exceptionInfo) {
	    if (exceptionInfo) {
	        document.body.innerHTML = '<h3>No weex environment detected!</h3>';
	    } else {
	        var port;
	        var id;
	
	        var _highlightTimer;
	
	        var currentStyleNodeId;
	        var requestStyleId, requestComputedStyleId;
	        var lastSelectedNode;
	
	        (function () {
	            var findParent = function findParent(node) {
	                var cur = node;
	                do {
	                    if (cur.tagName == 'LI') {
	                        return cur;
	                    }
	                } while (cur = cur.parentNode);
	                return null;
	            };
	
	            port = new _Port2.default(proxy);
	            id = 5;
	
	            port.send({ id: 0, method: 'Runtime.enable' });
	            port.send({ id: 1, method: 'DOM.enable' });
	            port.send({ id: 2, method: 'CSS.enable' });
	            port.send({ id: 3, method: 'DOM.getDocument' });
	            port.send({ id: 4, method: 'Runtime.run' });
	            currentStyleNodeId = -1;
	            requestStyleId = -1;
	            requestComputedStyleId = -1;
	
	
	            document.querySelector('#elements').addEventListener('click', function (event) {
	                var li = findParent(event.target);
	                if (li) {
	                    if (currentStyleNodeId != li._nodeId) {
	                        if (lastSelectedNode) lastSelectedNode.className = lastSelectedNode.className.replace(/\s*selected/g, '');
	
	                        li.className += ' selected';
	                        lastSelectedNode = li;
	                        requestStyleId = id++;
	                        requestComputedStyleId = id++;
	                        currentStyleNodeId = li._nodeId;
	                        port.send({
	                            "id": requestStyleId,
	                            "method": "CSS.getMatchedStylesForNode",
	                            "params": { "nodeId": li._nodeId }
	                        });
	                        port.send({
	                            "id": requestComputedStyleId,
	                            "method": "CSS.getComputedStyleForNode",
	                            "params": { "nodeId": li._nodeId }
	                        });
	                    }
	                }
	            });
	            document.querySelector('#elements').addEventListener('mouseover', function (event) {
	                var li = findParent(event.target);
	                if (li) {
	                    clearTimeout(_highlightTimer);
	                    port.send({
	                        "id": id++,
	                        "method": "DOM.highlightNode",
	                        "params": { "highlightConfig": highlightConfig, "nodeId": li._nodeId }
	                    });
	                }
	            });
	            window.onblur = function () {
	                port.send({ "id": id++, "method": "DOM.hideHighlight" });
	            };
	            document.querySelector('#elements').addEventListener('mouseout', function (event) {
	                var li = findParent(event.target);
	                if (li) {
	                    clearTimeout(_highlightTimer);
	                    _highlightTimer = setTimeout(function () {
	                        port.send({ "id": id++, "method": "DOM.hideHighlight" });
	                    }, 200);
	                }
	            });
	            port.on('data', function (data) {
	
	                if (data.id == 3 && data.result) {
	                    var documentRoot = new _NodeRender.DocumentNode(data.result.root);
	                    console.log(data.result.root);
	                    document.getElementById('elements').appendChild(documentRoot.render());
	                    /* var list=document.querySelectorAll('li');
	                     for(var i=0,l=list.length;i<l;i++){
	                     list[i].onmouseover=function(){
	                     clearTimeout(_highlightTimer);
	                     port.send({"id":id++,"method":"DOM.highlightNode","params":{"highlightConfig":highlightConfig,"nodeId":this._nodeId}})
	                     };
	                     list[i].onmouseout=function(){
	                     clearTimeout(_highlightTimer);
	                     _highlightTimer=setTimeout(function(){
	                     port.send({"id":id++,"method":"DOM.highlightNode"});
	                     },200)
	                     }
	                     list[i].onclick=function(){
	                      }
	                     }*/
	                } else if (data.id == requestStyleId && data.result) {
	
	                        var stylesHtml = '',
	                            stylesRender = new _StyleRender2.default();
	                        data.result.matchedCSSRules.forEach(function (cssRule) {
	                            stylesHtml += stylesRender.render(cssRule.rule);
	                        });
	                        document.getElementById('styles_panel').innerHTML = stylesHtml;
	                    } else if (data.id == requestComputedStyleId && data.result) {
	                        var computedStyle = {};
	                        data.result.computedStyle.forEach(function (style) {
	                            computedStyle[style.name] = style.value;
	                        });
	                        document.getElementById('metrics').innerHTML = renderMetrics(computedStyle);
	                    } else if (data.method == 'DOM.childNodeInserted') {
	                        _NodeRender.DocumentNode.all[data.params.parentNodeId].insertChild(data.params.previousNodeId, data.params.node);
	                    } else if (data.method == 'DOM.childNodeRemoved') {
	                        _NodeRender.DocumentNode.all[data.params.parentNodeId].removeChild(data.params.nodeId);
	                    }
	            });
	        })();
	    }
	}); /**
	     * Created by godsong on 16/8/29.
	     */
	
	var highlightConfig = {
	    "showInfo": true,
	    "showRulers": false,
	    "showExtensionLines": false,
	    "contentColor": { "r": 111, "g": 168, "b": 220, "a": 0.66 },
	    "paddingColor": { "r": 147, "g": 196, "b": 125, "a": 0.55 },
	    "borderColor": { "r": 255, "g": 229, "b": 153, "a": 0.66 },
	    "marginColor": { "r": 246, "g": 178, "b": 107, "a": 0.66 },
	    "eventTargetColor": { "r": 255, "g": 196, "b": 196, "a": 0.66 },
	    "shapeColor": { "r": 96, "g": 82, "b": 177, "a": 0.8 },
	    "shapeMarginColor": { "r": 96, "g": 82, "b": 127, "a": 0.6 },
	    "displayAsMaterial": true
	};
	function renderMetrics(computedStyle) {
	    return "<div class=\"position\" style=\"background-color: rgba(0, 0, 0, 0);\">\n        <div class=\"label\">position</div>\n        <div class=\"top\">" + (computedStyle['top'] || '0') + "</div>\n        <br>\n\n        <div class=\"left\">" + (computedStyle['left'] || '0') + "</div>\n        <div class=\"margin\" style=\"background-color: rgba(246, 178, 107, 0.658824);\">\n        <div class=\"label\">margin</div>\n        <div class=\"top\">" + (computedStyle['margin-top'] || '-') + "</div>\n    <br>\n\n    <div class=\"left\">" + (computedStyle['margin-left'] || '-') + "</div>\n    <div class=\"border\"\n    style=\"background-color: rgba(255, 229, 153, 0.658824);\">\n        <div class=\"label\">border</div>\n        <div class=\"top\">" + (computedStyle['border-top'] || '-') + "</div>\n    <br>\n\n    <div class=\"left\">" + (computedStyle['border-left'] || '-') + "</div>\n    <div class=\"padding\"\n    style=\"background-color: rgba(147, 196, 125, 0.54902);\">\n        <div class=\"label\">padding</div>\n        <div class=\"top\">" + (computedStyle['padding-top'] || '-') + "</div>\n    <br>\n\n    <div class=\"left\">" + (computedStyle['padding-left'] || '-') + "</div>\n    <div class=\"content\"\n    style=\"background-color: rgba(111, 168, 220, 0.658824);\"><span>" + (computedStyle['width'] || '0') + "</span>\n                                                        × <span>" + (computedStyle['height'] || '0') + "</span></div>\n    <div class=\"right\">" + (computedStyle['padding-right'] || '-') + "</div>\n    <br>\n\n    <div class=\"bottom\">" + (computedStyle['padding-bottom'] || '-') + "</div>\n    </div>\n    <div class=\"right\">" + (computedStyle['border-right'] || '-') + "</div>\n    <br>\n\n    <div class=\"bottom\">" + (computedStyle['border-bottom'] || '-') + "</div>\n    </div>\n    <div class=\"right\">" + (computedStyle['margin-right'] || '-') + "</div>\n    <br>\n\n    <div class=\"bottom\">" + (computedStyle['margin-bottom'] || '-') + "</div>\n    </div>\n    <div class=\"right\">" + (computedStyle['right'] || '0') + "</div>\n        <br>\n\n        <div class=\"bottom\">" + (computedStyle['bottom'] || '0') + "</div>\n        </div>";
	}

/***/ },
/* 1 */,
/* 2 */,
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

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _nodeClassMap;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/**
	 * Created by godsong on 16/9/2.
	 */
	var nodeClassMap;
	var _nodeMap = {};
	function noop() {}
	
	var ENode = function () {
	    function ENode(nodeInfo) {
	        _classCallCheck(this, ENode);
	
	        this.nodeInfo = nodeInfo;
	        this.children = [];
	
	        if (nodeInfo.children && nodeInfo.children.length > 0) {
	            for (var i = 0; i < nodeInfo.children.length; i++) {
	                this.children.push(new nodeClassMap[nodeInfo.children[i].nodeType](nodeInfo.children[i]));
	            }
	            delete nodeInfo.children;
	        }
	        this._ArrowWidth = 10;
	        this._expandable = this.nodeInfo.childNodeCount > 0;
	        this.expanded = false;
	        _nodeMap[nodeInfo.nodeId] = this;
	    }
	
	    _createClass(ENode, [{
	        key: '_createContainer',
	        value: function _createContainer() {
	            return this._createElement('li', this.nodeInfo.childNodeCount > 0 ? 'parent' : '');
	        }
	    }, {
	        key: '_renderBody',
	        value: function _renderBody() {
	            throw new Error('_renderBody not implement');
	        }
	    }, {
	        key: 'removeChild',
	        value: function removeChild(nodeId) {
	            var childNode = _nodeMap[nodeId];
	            if (childNode) {
	                this.childElement.removeChild(childNode.element);
	                if (childNode.childElement) {
	                    this.childElement.removeChild(childNode.childElement);
	                }
	                delete _nodeMap[nodeId];
	            } else {
	                console.warn('can not remove node:', nodeId);
	            }
	        }
	    }, {
	        key: 'insertChild',
	        value: function insertChild(prevNodeId, nodeInfo) {
	            var afterNode,
	                i = 0;
	            var newNode = new nodeClassMap[nodeInfo.nodeType](nodeInfo);
	            var elements = newNode.render();
	            if (prevNodeId != -1) {
	                for (var l = this.children.length; i < l; i++) {
	                    if (this.children[i].nodeInfo.nodeId == prevNodeId) {
	                        afterNode = this.children[i + 1];
	                        break;
	                    }
	                }
	                if (i == l) {
	                    throw new Error('can not find the prevNode:', prevNodeId);
	                }
	            }
	            if (afterNode) {
	                this.childElement.insertBefore(elements[0], afterNode.element);
	                elements[1] && this.childElement.insertBefore(elements[1], afterNode.element);
	                this.children.splice(i, 0, newNode);
	            } else {
	                this.childElement.appendChild(elements[0]);
	                elements[1] && this.childElement.appendChild(elements[1]);
	                this.children.push(newNode);
	            }
	        }
	    }, {
	        key: '_renderChild',
	        value: function _renderChild() {
	            var childElement = null;
	            if (this.nodeInfo.childNodeCount > 0) {
	                childElement = this.childElement = this._createElement('ol', 'children');
	
	                this.children.forEach(function (e) {
	                    var elements = e.render();
	                    childElement.appendChild(elements[0]);
	                    elements[1] && childElement.appendChild(elements[1]);
	                });
	                var closeTag = this._createElement('li');
	                closeTag._nodeId = this.nodeInfo.nodeId;
	                closeTag.innerHTML = '<div class="selection-fill"></div><span class="webkit-html-tag close">&lt;<span class="webkit-html-close-tag-name">/' + this.nodeInfo.nodeName.toLowerCase() + '</span>&gt;</span>';
	                childElement.appendChild(closeTag);
	            }
	            return childElement;
	        }
	    }, {
	        key: 'render',
	        value: function render() {
	            this._hook('@beforeRender')();
	            this.element = this._createContainer();
	            this.element.innerHTML = this._renderBody();
	            this.childElement = this._renderChild();
	            this.element.addEventListener('click', this._toggleElementTree.bind(this), false);
	            this._hook('@afterRender')();
	            this.element._nodeId = this.nodeInfo.nodeId;
	            return [this.element, this.childElement];
	        }
	    }, {
	        key: '_hook',
	        value: function _hook(name) {
	            return typeof this[name] === 'function' ? this[name].bind(this) : noop;
	        }
	    }, {
	        key: '_toggleElementTree',
	        value: function _toggleElementTree(event) {
	            var element = event.currentTarget;
	            if (this._expandable && this.isClickAtTriangle(event)) {
	                event.stopPropagation();
	                if (this.expanded) {
	                    this.collapseChild();
	                } else {
	                    this.expandChild();
	                }
	            } else {}
	        }
	    }, {
	        key: '_totalOffset',
	        value: function _totalOffset(element) {
	            var rect = element.getBoundingClientRect();
	            return {
	                left: rect.left,
	                top: rect.top
	            };
	        }
	    }, {
	        key: 'isClickAtTriangle',
	        value: function isClickAtTriangle(event) {
	            var paddingLeftValue = window.getComputedStyle(this.element).paddingLeft;
	            var computedLeftPadding = parseFloat(paddingLeftValue);
	            var left = this._totalOffset(this.element).left + computedLeftPadding;
	            return event.pageX >= left && event.pageX <= left + this._ArrowWidth;
	        }
	    }, {
	        key: 'expandChild',
	        value: function expandChild() {
	            if (!this.expanded) {
	                this.expanded = true;
	                this.element.className = this.element.className.replace(/ expanded|$/, ' expanded');
	                this.childElement.className = this.childElement.className.replace(/ expanded|$/, ' expanded');
	            }
	        }
	    }, {
	        key: 'collapseChild',
	        value: function collapseChild() {
	            if (this.expanded) {
	                this.expanded = false;
	                this.element.className = this.element.className.replace(/ expanded/, '');
	                this.childElement.className = this.childElement.className.replace(/ expanded/, '');
	            }
	        }
	    }, {
	        key: '_createElement',
	        value: function _createElement(tagName, className) {
	            var element = document.createElement(tagName);
	            if (className) element.className = className;
	            return element;
	        }
	    }]);
	
	    return ENode;
	}();
	
	var DocumentNode = function (_ENode) {
	    _inherits(DocumentNode, _ENode);
	
	    function DocumentNode() {
	        _classCallCheck(this, DocumentNode);
	
	        return _possibleConstructorReturn(this, (DocumentNode.__proto__ || Object.getPrototypeOf(DocumentNode)).apply(this, arguments));
	    }
	
	    _createClass(DocumentNode, [{
	        key: 'render',
	        value: function render() {
	            this.element = this._createElement('ol', 'elements-tree');
	            this.children.forEach(function (e) {
	                var elements = e.render();
	                this.element.appendChild(elements[0]);
	                elements[1] && this.element.appendChild(elements[1]);
	            }.bind(this));
	            this.childElement = this.element;
	            return this.element;
	        }
	    }]);
	
	    return DocumentNode;
	}(ENode);
	
	var ElementNode = function (_ENode2) {
	    _inherits(ElementNode, _ENode2);
	
	    function ElementNode() {
	        _classCallCheck(this, ElementNode);
	
	        return _possibleConstructorReturn(this, (ElementNode.__proto__ || Object.getPrototypeOf(ElementNode)).apply(this, arguments));
	    }
	
	    _createClass(ElementNode, [{
	        key: '@afterRender',
	        value: function afterRender() {
	            if (this.nodeInfo.nodeName === 'HTML') {
	                this.expandChild();
	                this._expandable = false;
	                this.element.className += ' always-parent';
	            }
	        }
	    }, {
	        key: '_renderBody',
	        value: function _renderBody() {
	            var body = '<div class="selection-fill"></div><span class="webkit-html-tag">&lt;<span class="webkit-html-tag-name">' + this.nodeInfo.nodeName.toLowerCase() + '</span>';
	            if (this.nodeInfo.attributes && this.nodeInfo.attributes.length > 0) {
	                for (var i = 0; i < this.nodeInfo.attributes.length - 1; i += 2) {
	                    body += ' <span class="webkit-html-attribute"><span class="webkit-html-attribute-name">' + this.nodeInfo.attributes[i] + '</span>="<span class="webkit-html-attribute-value">' + this.nodeInfo.attributes[i + 1] + '</span>"</span>';
	                }
	            }
	            body += '&gt;</span><span class="webkit-html-text-node bogus">' + (this.nodeInfo.childNodeCount > 0 ? '…' : '') + '</span><span class="webkit-html-tag close-tag-section">&lt;<span class="webkit-html-close-tag-name">/' + this.nodeInfo.nodeName.toLowerCase() + '</span>&gt;</span></span>';
	            return body;
	        }
	    }]);
	
	    return ElementNode;
	}(ENode);
	
	var TextNode = function (_ENode3) {
	    _inherits(TextNode, _ENode3);
	
	    function TextNode() {
	        _classCallCheck(this, TextNode);
	
	        return _possibleConstructorReturn(this, (TextNode.__proto__ || Object.getPrototypeOf(TextNode)).apply(this, arguments));
	    }
	
	    _createClass(TextNode, [{
	        key: '_renderBody',
	        value: function _renderBody() {
	            return '<div class="selection-fill"></div><span class="webkit-html-text-node bogus">' + this.nodeInfo.nodeValue + '</span>';
	        }
	    }]);
	
	    return TextNode;
	}(ENode);
	
	var DocumentTypeNode = function (_ENode4) {
	    _inherits(DocumentTypeNode, _ENode4);
	
	    function DocumentTypeNode() {
	        _classCallCheck(this, DocumentTypeNode);
	
	        return _possibleConstructorReturn(this, (DocumentTypeNode.__proto__ || Object.getPrototypeOf(DocumentTypeNode)).apply(this, arguments));
	    }
	
	    _createClass(DocumentTypeNode, [{
	        key: '_renderBody',
	        value: function _renderBody() {
	            return '<div class="selection-fill"></div><span class="webkit-html-doctype">&lt;!DOCTYPE html&gt;</span>';
	        }
	    }]);
	
	    return DocumentTypeNode;
	}(ENode);
	
	nodeClassMap = (_nodeClassMap = {}, _defineProperty(_nodeClassMap, Node.ELEMENT_NODE, ElementNode), _defineProperty(_nodeClassMap, Node.TEXT_NODE, TextNode), _defineProperty(_nodeClassMap, Node.DOCUMENT_TYPE_NODE, DocumentTypeNode), _nodeClassMap);
	DocumentNode.all = _nodeMap;
	exports.DocumentNode = DocumentNode;
	exports.TextNode = TextNode;
	exports.ElementNode = ElementNode;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _EventEmitter2 = __webpack_require__(3);
	
	var _EventEmitter3 = _interopRequireDefault(_EventEmitter2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by godsong on 16/10/7.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */
	
	
	var Port = function (_EventEmitter) {
	    _inherits(Port, _EventEmitter);
	
	    function Port(proxy) {
	        _classCallCheck(this, Port);
	
	        var _this = _possibleConstructorReturn(this, (Port.__proto__ || Object.getPrototypeOf(Port)).call(this));
	
	        _this.id = chrome.devtools.inspectedWindow.tabId;
	        _this.proxy = proxy;
	        _this._port = chrome.runtime.connect({
	            name: '' + chrome.devtools.inspectedWindow.tabId + '@' + _this.proxy
	        });
	        _this._port.onMessage.addListener(function (message) {
	            return _this.emit('data', message);
	        });
	        return _this;
	    }
	
	    _createClass(Port, [{
	        key: 'send',
	        value: function send(msg) {
	            this._port.postMessage(msg);
	        }
	    }]);
	
	    return Port;
	}(_EventEmitter3.default);
	
	exports.default = Port;

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/**
	 * Created by godsong on 16/10/8.
	 */
	
	var StyleRender = function () {
	    function StyleRender() {
	        _classCallCheck(this, StyleRender);
	    }
	
	    _createClass(StyleRender, [{
	        key: 'renderSelectorList',
	        value: function renderSelectorList(cssRule) {
	            return cssRule.selectorList.selectors.map(function (selector) {
	                return selector.text;
	            }).join(',');
	        }
	    }, {
	        key: 'renderStyleProperties',
	        value: function renderStyleProperties(cssRule) {
	            var html = '';
	            cssRule.style.cssProperties.forEach(function (css) {
	                html += '<li class="styles-panel-hovered"><input class="enabled-button" type="checkbox"><span class="styles-clipboard-only">    </span><span class="webkit-css-property">' + css.name + '</span>: <span class="expand-element"></span><span class="value">' + css.value + '</span>;</li>';
	            });
	            return html;
	        }
	    }, {
	        key: 'render',
	        value: function render(cssRule) {
	            return '<div class="styles-section matched-styles monospace read-only">\n    <div class="styles-section-title styles-selector">\n    <div class="media-list media-matches"></div>\n    <div class="styles-section-subtitle"></div>\n    <div><span class="selector"><span class="simple-selector selector-matches">' + this.renderSelectorList(cssRule) + '</span></span><span> {</span>\n    </div>\n    </div>\n    <ol class="style-properties monospace" tabindex="0">\n    ' + this.renderStyleProperties(cssRule) + '\n\n\n    </ol>\n    <div class="sidebar-pane-closing-brace">}</div>\n</div>';
	        }
	    }]);
	
	    return StyleRender;
	}();
	
	exports.default = StyleRender;

/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZTA4MjFhZGQxMDViODMwZTk1MDYiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luc3BlY3Rvci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50L0V2ZW50RW1pdHRlci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50L05vZGVSZW5kZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudC9Qb3J0LmpzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnQvU3R5bGVSZW5kZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUFlO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7OztBQ25DQTs7QUFDQTs7OztBQUNBOzs7Ozs7QUFHQSxRQUFPLFFBQVAsQ0FBZ0IsZUFBaEIsQ0FBZ0MsSUFBaEMsQ0FBcUMscUJBQXJDLEVBQTRELFVBQVUsS0FBVixFQUFpQixhQUFqQixFQUFnQztBQUN4RixTQUFJLGFBQUosRUFBbUI7QUFDZixrQkFBUyxJQUFULENBQWMsU0FBZCxHQUEwQix3Q0FBMUI7QUFDSCxNQUZELE1BR0s7QUFBQSxhQUNHLElBREg7QUFBQSxhQUVHLEVBRkg7O0FBQUEsYUFRRyxlQVJIOztBQUFBLGFBU0csa0JBVEg7QUFBQSxhQVVHLGNBVkgsRUFVd0Isc0JBVnhCO0FBQUEsYUFXRyxnQkFYSDs7QUFBQTtBQUFBLGlCQWFRLFVBYlIsR0FhRCxTQUFTLFVBQVQsQ0FBb0IsSUFBcEIsRUFBMEI7QUFDdEIscUJBQUksTUFBTSxJQUFWO0FBQ0Esb0JBQUc7QUFDQyx5QkFBSSxJQUFJLE9BQUosSUFBZSxJQUFuQixFQUF5QjtBQUNyQixnQ0FBTyxH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S0FBTCxHQUFhLE9BQU8sT0FBUCxDQUFlLE9BQWYsQ0FBdUI7QUFDaEMsbUJBQU0sS0FBSyxPQUFPLFFBQVAsQ0FBZ0IsZUFBaEIsQ0FBZ0MsS0FBckMsR0FBNkMsR0FBN0MsR0FBbUQsTUFBSztBQUQ5QixVQUF2QixDQUFiO0FBR0EsZUFBSyxLQUFMLENBQVcsU0FBWCxDQUFxQixXQUFyQixDQUFpQztBQUFBLG9CQUFTLE1BQUssSUFBTCxDQUFVLE1BQVYsRUFBa0IsT0FBbEIsQ0FBVDtBQUFBLFVBQWpDO0FBUGU7QUFRbEI7Ozs7OEJBRUksRyxFQUFLO0FBQ04sa0JBQUssS0FBTCxDQUFXLFdBQVgsQ0FBdUIsR0FBdkI7QUFDSDs7Ozs7O21CQUdVLEk7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0tDakJULFc7QUFDRiw0QkFBYztBQUFBO0FBQ2I7Ozs7NENBRWtCLE8sRUFBUztBQUN4QixvQkFBTyxRQUFRLFlBQVIsQ0FBcUIsU0FBckIsQ0FBK0IsR0FBL0IsQ0FBbUM7QUFBQSx3QkFBVSxTQUFTLElBQW5CO0FBQUEsY0FBbkMsRUFBNEQsSUFBNUQsQ0FBaUUsR0FBakUsQ0FBUDtBQUNIOzs7K0NBRXFCLE8sRUFBUztBQUMzQixpQkFBSSxPQUFPLEVBQVg7QUFDQSxxQkFBUSxLQUFSLENBQWMsYUFBZCxDQUE0QixPQUE1QixDQUFvQyxVQUFVLEdBQVYsRUFBZTtBQUMvQyw4TEFBMkssSUFBSSxJQUEvSyx5RUFBdVAsSUFBSSxLQUEzUDtBQUNILGNBRkQ7QUFHQSxvQkFBTyxJQUFQO0FBQ0g7OztnQ0FFTSxPLEVBQVM7QUFDWixvVUFJeUUsS0FBSyxrQkFBTCxDQUF3QixPQUF4QixDQUp6RSw2SEFRRixLQUFLLHFCQUFMLENBQTJCLE9BQTNCLENBUkU7QUFjSDs7Ozs7O21CQUVVLFciLCJmaWxlIjoiaW5zcGVjdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiB3ZWJwYWNrL2Jvb3RzdHJhcCBlMDgyMWFkZDEwNWI4MzBlOTUwNlxuICoqLyIsIi8qKlxuICogQ3JlYXRlZCBieSBnb2Rzb25nIG9uIDE2LzgvMjkuXG4gKi9cbmltcG9ydCB7RG9jdW1lbnROb2RlfSBmcm9tIFwiLi9jb21wb25lbnQvTm9kZVJlbmRlclwiO1xuaW1wb3J0IFBvcnQgZnJvbSBcIi4vY29tcG9uZW50L1BvcnRcIjtcbmltcG9ydCBTdHlsZVJlbmRlciBmcm9tIFwiLi9jb21wb25lbnQvU3R5bGVSZW5kZXJcIjtcblxuXG5jaHJvbWUuZGV2dG9vbHMuaW5zcGVjdGVkV2luZG93LmV2YWwoJyRXZWV4SW5zcGVjdG9yUHJveHknLCBmdW5jdGlvbiAocHJveHksIGV4Y2VwdGlvbkluZm8pIHtcbiAgICBpZiAoZXhjZXB0aW9uSW5mbykge1xuICAgICAgICBkb2N1bWVudC5ib2R5LmlubmVySFRNTCA9ICc8aDM+Tm8gd2VleCBlbnZpcm9ubWVudCBkZXRlY3RlZCE8L2gzPic7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB2YXIgcG9ydCA9IG5ldyBQb3J0KHByb3h5KTtcbiAgICAgICAgdmFyIGlkID0gNTtcbiAgICAgICAgcG9ydC5zZW5kKHtpZDogMCwgbWV0aG9kOiAnUnVudGltZS5lbmFibGUnfSk7XG4gICAgICAgIHBvcnQuc2VuZCh7aWQ6IDEsIG1ldGhvZDogJ0RPTS5lbmFibGUnfSk7XG4gICAgICAgIHBvcnQuc2VuZCh7aWQ6IDIsIG1ldGhvZDogJ0NTUy5lbmFibGUnfSk7XG4gICAgICAgIHBvcnQuc2VuZCh7aWQ6IDMsIG1ldGhvZDogJ0RPTS5nZXREb2N1bWVudCd9KTtcbiAgICAgICAgcG9ydC5zZW5kKHtpZDogNCwgbWV0aG9kOiAnUnVudGltZS5ydW4nfSk7XG4gICAgICAgIHZhciBfaGlnaGxpZ2h0VGltZXI7XG4gICAgICAgIHZhciBjdXJyZW50U3R5bGVOb2RlSWQgPSAtMTtcbiAgICAgICAgdmFyIHJlcXVlc3RTdHlsZUlkID0gLTEsIHJlcXVlc3RDb21wdXRlZFN0eWxlSWQgPSAtMTtcbiAgICAgICAgdmFyIGxhc3RTZWxlY3RlZE5vZGU7XG5cbiAgICAgICAgZnVuY3Rpb24gZmluZFBhcmVudChub2RlKSB7XG4gICAgICAgICAgICB2YXIgY3VyID0gbm9kZTtcbiAgICAgICAgICAgIGRvIHtcbiAgICAgICAgICAgICAgICBpZiAoY3VyLnRhZ05hbWUgPT0gJ0xJJykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY3VyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHdoaWxlIChjdXIgPSBjdXIucGFyZW50Tm9kZSk7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNlbGVtZW50cycpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICB2YXIgbGkgPSBmaW5kUGFyZW50KGV2ZW50LnRhcmdldCk7XG4gICAgICAgICAgICBpZiAobGkpIHtcbiAgICAgICAgICAgICAgICBpZiAoY3VycmVudFN0eWxlTm9kZUlkICE9IGxpLl9ub2RlSWQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxhc3RTZWxlY3RlZE5vZGUpbGFzdFNlbGVjdGVkTm9kZS5jbGFzc05hbWUgPSBsYXN0U2VsZWN0ZWROb2RlLmNsYXNzTmFtZS5yZXBsYWNlKC9cXHMqc2VsZWN0ZWQvZywgJycpO1xuXG4gICAgICAgICAgICAgICAgICAgIGxpLmNsYXNzTmFtZSArPSAnIHNlbGVjdGVkJztcbiAgICAgICAgICAgICAgICAgICAgbGFzdFNlbGVjdGVkTm9kZSA9IGxpO1xuICAgICAgICAgICAgICAgICAgICByZXF1ZXN0U3R5bGVJZCA9IGlkKys7XG4gICAgICAgICAgICAgICAgICAgIHJlcXVlc3RDb21wdXRlZFN0eWxlSWQgPSBpZCsrO1xuICAgICAgICAgICAgICAgICAgICBjdXJyZW50U3R5bGVOb2RlSWQgPSBsaS5fbm9kZUlkO1xuICAgICAgICAgICAgICAgICAgICBwb3J0LnNlbmQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiByZXF1ZXN0U3R5bGVJZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibWV0aG9kXCI6IFwiQ1NTLmdldE1hdGNoZWRTdHlsZXNGb3JOb2RlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInBhcmFtc1wiOiB7XCJub2RlSWRcIjogbGkuX25vZGVJZH1cbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgcG9ydC5zZW5kKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaWRcIjogcmVxdWVzdENvbXB1dGVkU3R5bGVJZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibWV0aG9kXCI6IFwiQ1NTLmdldENvbXB1dGVkU3R5bGVGb3JOb2RlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInBhcmFtc1wiOiB7XCJub2RlSWRcIjogbGkuX25vZGVJZH1cbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZWxlbWVudHMnKS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW92ZXInLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIHZhciBsaSA9IGZpbmRQYXJlbnQoZXZlbnQudGFyZ2V0KTtcbiAgICAgICAgICAgIGlmIChsaSkge1xuICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dChfaGlnaGxpZ2h0VGltZXIpO1xuICAgICAgICAgICAgICAgIHBvcnQuc2VuZCh7XG4gICAgICAgICAgICAgICAgICAgIFwiaWRcIjogaWQrKyxcbiAgICAgICAgICAgICAgICAgICAgXCJtZXRob2RcIjogXCJET00uaGlnaGxpZ2h0Tm9kZVwiLFxuICAgICAgICAgICAgICAgICAgICBcInBhcmFtc1wiOiB7XCJoaWdobGlnaHRDb25maWdcIjogaGlnaGxpZ2h0Q29uZmlnLCBcIm5vZGVJZFwiOiBsaS5fbm9kZUlkfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSlcbiAgICAgICAgd2luZG93Lm9uYmx1ciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHBvcnQuc2VuZCh7XCJpZFwiOiBpZCsrLCBcIm1ldGhvZFwiOiBcIkRPTS5oaWRlSGlnaGxpZ2h0XCJ9KTtcbiAgICAgICAgfVxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZWxlbWVudHMnKS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW91dCcsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgdmFyIGxpID0gZmluZFBhcmVudChldmVudC50YXJnZXQpO1xuICAgICAgICAgICAgaWYgKGxpKSB7XG4gICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KF9oaWdobGlnaHRUaW1lcik7XG4gICAgICAgICAgICAgICAgX2hpZ2hsaWdodFRpbWVyID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHBvcnQuc2VuZCh7XCJpZFwiOiBpZCsrLCBcIm1ldGhvZFwiOiBcIkRPTS5oaWRlSGlnaGxpZ2h0XCJ9KTtcbiAgICAgICAgICAgICAgICB9LCAyMDApXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSlcbiAgICAgICAgcG9ydC5vbignZGF0YScsIGZ1bmN0aW9uIChkYXRhKSB7XG5cbiAgICAgICAgICAgIGlmIChkYXRhLmlkID09IDMgJiYgZGF0YS5yZXN1bHQpIHtcbiAgICAgICAgICAgICAgICB2YXIgZG9jdW1lbnRSb290ID0gbmV3IERvY3VtZW50Tm9kZShkYXRhLnJlc3VsdC5yb290KTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhLnJlc3VsdC5yb290KTtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZWxlbWVudHMnKS5hcHBlbmRDaGlsZChkb2N1bWVudFJvb3QucmVuZGVyKCkpO1xuICAgICAgICAgICAgICAgIC8qIHZhciBsaXN0PWRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2xpJyk7XG4gICAgICAgICAgICAgICAgIGZvcih2YXIgaT0wLGw9bGlzdC5sZW5ndGg7aTxsO2krKyl7XG4gICAgICAgICAgICAgICAgIGxpc3RbaV0ub25tb3VzZW92ZXI9ZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KF9oaWdobGlnaHRUaW1lcik7XG4gICAgICAgICAgICAgICAgIHBvcnQuc2VuZCh7XCJpZFwiOmlkKyssXCJtZXRob2RcIjpcIkRPTS5oaWdobGlnaHROb2RlXCIsXCJwYXJhbXNcIjp7XCJoaWdobGlnaHRDb25maWdcIjpoaWdobGlnaHRDb25maWcsXCJub2RlSWRcIjp0aGlzLl9ub2RlSWR9fSlcbiAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgbGlzdFtpXS5vbm1vdXNlb3V0PWZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dChfaGlnaGxpZ2h0VGltZXIpO1xuICAgICAgICAgICAgICAgICBfaGlnaGxpZ2h0VGltZXI9c2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICBwb3J0LnNlbmQoe1wiaWRcIjppZCsrLFwibWV0aG9kXCI6XCJET00uaGlnaGxpZ2h0Tm9kZVwifSk7XG4gICAgICAgICAgICAgICAgIH0sMjAwKVxuICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgIGxpc3RbaV0ub25jbGljaz1mdW5jdGlvbigpe1xuXG4gICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgfSovXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChkYXRhLmlkID09IHJlcXVlc3RTdHlsZUlkICYmIGRhdGEucmVzdWx0KSB7XG5cbiAgICAgICAgICAgICAgICB2YXIgc3R5bGVzSHRtbCA9ICcnLCBzdHlsZXNSZW5kZXIgPSBuZXcgU3R5bGVSZW5kZXIoKTtcbiAgICAgICAgICAgICAgICBkYXRhLnJlc3VsdC5tYXRjaGVkQ1NTUnVsZXMuZm9yRWFjaChmdW5jdGlvbiAoY3NzUnVsZSkge1xuICAgICAgICAgICAgICAgICAgICBzdHlsZXNIdG1sICs9IHN0eWxlc1JlbmRlci5yZW5kZXIoY3NzUnVsZS5ydWxlKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3R5bGVzX3BhbmVsJykuaW5uZXJIVE1MID0gc3R5bGVzSHRtbDtcblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoZGF0YS5pZCA9PSByZXF1ZXN0Q29tcHV0ZWRTdHlsZUlkICYmIGRhdGEucmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgdmFyIGNvbXB1dGVkU3R5bGUgPSB7fTtcbiAgICAgICAgICAgICAgICBkYXRhLnJlc3VsdC5jb21wdXRlZFN0eWxlLmZvckVhY2goZnVuY3Rpb24gKHN0eWxlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbXB1dGVkU3R5bGVbc3R5bGUubmFtZV0gPSBzdHlsZS52YWx1ZTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWV0cmljcycpLmlubmVySFRNTCA9IHJlbmRlck1ldHJpY3MoY29tcHV0ZWRTdHlsZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChkYXRhLm1ldGhvZCA9PSAnRE9NLmNoaWxkTm9kZUluc2VydGVkJykge1xuICAgICAgICAgICAgICAgIERvY3VtZW50Tm9kZS5hbGxbZGF0YS5wYXJhbXMucGFyZW50Tm9kZUlkXS5pbnNlcnRDaGlsZChkYXRhLnBhcmFtcy5wcmV2aW91c05vZGVJZCwgZGF0YS5wYXJhbXMubm9kZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChkYXRhLm1ldGhvZCA9PSAnRE9NLmNoaWxkTm9kZVJlbW92ZWQnKSB7XG4gICAgICAgICAgICAgICAgRG9jdW1lbnROb2RlLmFsbFtkYXRhLnBhcmFtcy5wYXJlbnROb2RlSWRdLnJlbW92ZUNoaWxkKGRhdGEucGFyYW1zLm5vZGVJZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG5cblxuICAgIH1cblxufSk7XG52YXIgaGlnaGxpZ2h0Q29uZmlnID0ge1xuICAgIFwic2hvd0luZm9cIjogdHJ1ZSxcbiAgICBcInNob3dSdWxlcnNcIjogZmFsc2UsXG4gICAgXCJzaG93RXh0ZW5zaW9uTGluZXNcIjogZmFsc2UsXG4gICAgXCJjb250ZW50Q29sb3JcIjoge1wiclwiOiAxMTEsIFwiZ1wiOiAxNjgsIFwiYlwiOiAyMjAsIFwiYVwiOiAwLjY2fSxcbiAgICBcInBhZGRpbmdDb2xvclwiOiB7XCJyXCI6IDE0NywgXCJnXCI6IDE5NiwgXCJiXCI6IDEyNSwgXCJhXCI6IDAuNTV9LFxuICAgIFwiYm9yZGVyQ29sb3JcIjoge1wiclwiOiAyNTUsIFwiZ1wiOiAyMjksIFwiYlwiOiAxNTMsIFwiYVwiOiAwLjY2fSxcbiAgICBcIm1hcmdpbkNvbG9yXCI6IHtcInJcIjogMjQ2LCBcImdcIjogMTc4LCBcImJcIjogMTA3LCBcImFcIjogMC42Nn0sXG4gICAgXCJldmVudFRhcmdldENvbG9yXCI6IHtcInJcIjogMjU1LCBcImdcIjogMTk2LCBcImJcIjogMTk2LCBcImFcIjogMC42Nn0sXG4gICAgXCJzaGFwZUNvbG9yXCI6IHtcInJcIjogOTYsIFwiZ1wiOiA4MiwgXCJiXCI6IDE3NywgXCJhXCI6IDAuOH0sXG4gICAgXCJzaGFwZU1hcmdpbkNvbG9yXCI6IHtcInJcIjogOTYsIFwiZ1wiOiA4MiwgXCJiXCI6IDEyNywgXCJhXCI6IDAuNn0sXG4gICAgXCJkaXNwbGF5QXNNYXRlcmlhbFwiOiB0cnVlXG59O1xuZnVuY3Rpb24gcmVuZGVyTWV0cmljcyhjb21wdXRlZFN0eWxlKSB7XG4gICAgcmV0dXJuIGA8ZGl2IGNsYXNzPVwicG9zaXRpb25cIiBzdHlsZT1cImJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMCwgMCwgMCk7XCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJsYWJlbFwiPnBvc2l0aW9uPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJ0b3BcIj4ke2NvbXB1dGVkU3R5bGVbJ3RvcCddIHx8ICcwJ308L2Rpdj5cbiAgICAgICAgPGJyPlxuXG4gICAgICAgIDxkaXYgY2xhc3M9XCJsZWZ0XCI+JHtjb21wdXRlZFN0eWxlWydsZWZ0J10gfHwgJzAnfTwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwibWFyZ2luXCIgc3R5bGU9XCJiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDI0NiwgMTc4LCAxMDcsIDAuNjU4ODI0KTtcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImxhYmVsXCI+bWFyZ2luPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJ0b3BcIj4ke2NvbXB1dGVkU3R5bGVbJ21hcmdpbi10b3AnXSB8fCAnLSd9PC9kaXY+XG4gICAgPGJyPlxuXG4gICAgPGRpdiBjbGFzcz1cImxlZnRcIj4ke2NvbXB1dGVkU3R5bGVbJ21hcmdpbi1sZWZ0J10gfHwgJy0nfTwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJib3JkZXJcIlxuICAgIHN0eWxlPVwiYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyNTUsIDIyOSwgMTUzLCAwLjY1ODgyNCk7XCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJsYWJlbFwiPmJvcmRlcjwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwidG9wXCI+JHtjb21wdXRlZFN0eWxlWydib3JkZXItdG9wJ10gfHwgJy0nfTwvZGl2PlxuICAgIDxicj5cblxuICAgIDxkaXYgY2xhc3M9XCJsZWZ0XCI+JHtjb21wdXRlZFN0eWxlWydib3JkZXItbGVmdCddIHx8ICctJ308L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwicGFkZGluZ1wiXG4gICAgc3R5bGU9XCJiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDE0NywgMTk2LCAxMjUsIDAuNTQ5MDIpO1wiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwibGFiZWxcIj5wYWRkaW5nPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJ0b3BcIj4ke2NvbXB1dGVkU3R5bGVbJ3BhZGRpbmctdG9wJ10gfHwgJy0nfTwvZGl2PlxuICAgIDxicj5cblxuICAgIDxkaXYgY2xhc3M9XCJsZWZ0XCI+JHtjb21wdXRlZFN0eWxlWydwYWRkaW5nLWxlZnQnXSB8fCAnLSd9PC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cImNvbnRlbnRcIlxuICAgIHN0eWxlPVwiYmFja2dyb3VuZC1jb2xvcjogcmdiYSgxMTEsIDE2OCwgMjIwLCAwLjY1ODgyNCk7XCI+PHNwYW4+JHtjb21wdXRlZFN0eWxlWyd3aWR0aCddIHx8ICcwJ308L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIMOXIDxzcGFuPiR7Y29tcHV0ZWRTdHlsZVsnaGVpZ2h0J10gfHwgJzAnfTwvc3Bhbj48L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwicmlnaHRcIj4ke2NvbXB1dGVkU3R5bGVbJ3BhZGRpbmctcmlnaHQnXSB8fCAnLSd9PC9kaXY+XG4gICAgPGJyPlxuXG4gICAgPGRpdiBjbGFzcz1cImJvdHRvbVwiPiR7Y29tcHV0ZWRTdHlsZVsncGFkZGluZy1ib3R0b20nXSB8fCAnLSd9PC9kaXY+XG4gICAgPC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cInJpZ2h0XCI+JHtjb21wdXRlZFN0eWxlWydib3JkZXItcmlnaHQnXSB8fCAnLSd9PC9kaXY+XG4gICAgPGJyPlxuXG4gICAgPGRpdiBjbGFzcz1cImJvdHRvbVwiPiR7Y29tcHV0ZWRTdHlsZVsnYm9yZGVyLWJvdHRvbSddIHx8ICctJ308L2Rpdj5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwicmlnaHRcIj4ke2NvbXB1dGVkU3R5bGVbJ21hcmdpbi1yaWdodCddIHx8ICctJ308L2Rpdj5cbiAgICA8YnI+XG5cbiAgICA8ZGl2IGNsYXNzPVwiYm90dG9tXCI+JHtjb21wdXRlZFN0eWxlWydtYXJnaW4tYm90dG9tJ10gfHwgJy0nfTwvZGl2PlxuICAgIDwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJyaWdodFwiPiR7Y29tcHV0ZWRTdHlsZVsncmlnaHQnXSB8fCAnMCd9PC9kaXY+XG4gICAgICAgIDxicj5cblxuICAgICAgICA8ZGl2IGNsYXNzPVwiYm90dG9tXCI+JHtjb21wdXRlZFN0eWxlWydib3R0b20nXSB8fCAnMCd9PC9kaXY+XG4gICAgICAgIDwvZGl2PmBcblxufVxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvaW5zcGVjdG9yLmpzXG4gKiovIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGdvZHNvbmcgb24gMTYvNi8yOS5cbiAqL1xuZnVuY3Rpb24gRXZlbnRDb250ZXh0KGhvc3QpIHtcbiAgICB0aGlzLmhvc3QgPSBob3N0O1xuICAgIHRoaXMuX3Byb3BhZ2FibGUgPSB0cnVlO1xuICAgIHRoaXMuX3ByZXZlbnREZWZhdWx0ID0gZmFsc2U7XG59XG5FdmVudENvbnRleHQucHJvdG90eXBlID0ge1xuICAgIGNvbnN0cnVjdG9yOiBFdmVudENvbnRleHQsXG4gICAgc3RvcFByb3BhZ2F0aW9uOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuX3Byb3BhZ2FibGUgPSBmYWxzZTtcbiAgICB9LFxuICAgIHByZXZlbnREZWZhdWx0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuX3ByZXZlbnREZWZhdWx0ID0gdHJ1ZTtcbiAgICB9XG5cbn07XG5mdW5jdGlvbiBfbWVyZ2VDb25maWcoZGVmYXVsdENvbmZpZywgdXNlckNvbmZpZykge1xuICAgIHZhciBjb25maWcgPSB7fTtcbiAgICBmb3IgKHZhciBrIGluIGRlZmF1bHRDb25maWcpIHtcbiAgICAgICAgaWYgKGRlZmF1bHRDb25maWcuaGFzT3duUHJvcGVydHkoaykpIHtcbiAgICAgICAgICAgIGNvbmZpZ1trXSA9IHVzZXJDb25maWcgJiYgdXNlckNvbmZpZ1trXSAhPT0gdW5kZWZpbmVkID8gdXNlckNvbmZpZ1trXSA6IGRlZmF1bHRDb25maWdba107XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNvbmZpZztcbn1cbmZ1bmN0aW9uIEV2ZW50RW1pdHRlcihjb25maWcpIHtcbiAgICB0aGlzLl9oYW5kbGVycyA9IHt9O1xuICAgIHRoaXMuY29uZmlnID0gX21lcmdlQ29uZmlnKHtcbiAgICAgICAgY2FjaGU6IGZhbHNlXG4gICAgfSwgY29uZmlnKTtcbiAgICB0aGlzLl9lbWl0Q2FjaGVzID0gW107XG59XG5FdmVudEVtaXR0ZXIucHJvdG90eXBlID0ge1xuICAgIGNvbnN0cnVjdG9yOiBFdmVudEVtaXR0ZXIsXG4gICAgb2ZmOiBmdW5jdGlvbiAobWV0aG9kLCBoYW5kbGVyKSB7XG4gICAgICAgIGlmIChoYW5kbGVyKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuX2hhbmRsZXJzW21ldGhvZF0ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5faGFuZGxlcnNbbWV0aG9kXVtpXSA9PT0gaGFuZGxlcikge1xuICAgICAgICAgICAgICAgICAgICBzcGxpY2VPbmUodGhpcy5faGFuZGxlcnNbbWV0aG9kXSwgaSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChtZXRob2QpIHtcbiAgICAgICAgICAgIHRoaXMuX2hhbmRsZXJzW21ldGhvZF0gPSBbXTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX2hhbmRsZXJzID0ge307XG4gICAgICAgIH1cbiAgICB9LFxuICAgIG9uY2U6IGZ1bmN0aW9uIChtZXRob2QsIGhhbmRsZXIpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIgZmlyZWQgPSBmYWxzZTtcblxuICAgICAgICBmdW5jdGlvbiBnKCkge1xuICAgICAgICAgICAgc2VsZi5vZmYobWV0aG9kLCBnKTtcbiAgICAgICAgICAgIGlmICghZmlyZWQpIHtcbiAgICAgICAgICAgICAgICBmaXJlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgX2Zhc3RBcHBseShoYW5kbGVyLCB0aGlzLCBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5vbihtZXRob2QsIGcpO1xuICAgIH0sXG4gICAgb246IGZ1bmN0aW9uIChtZXRob2QsIGhhbmRsZXIsIGluZGV4KSB7XG4gICAgICAgIGlmICh0aGlzLl9oYW5kbGVyc1ttZXRob2RdKSB7XG4gICAgICAgICAgICBpZiAoaXNGaW5pdGUoaW5kZXgpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5faGFuZGxlcnMuc3BsaWNlKGluZGV4LCAwLCBoYW5kbGVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuX2hhbmRsZXJzW21ldGhvZF0ucHVzaChoYW5kbGVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX2hhbmRsZXJzW21ldGhvZF0gPSBbaGFuZGxlcl07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuX2VtaXRDYWNoZXNbbWV0aG9kXSAmJiB0aGlzLl9lbWl0Q2FjaGVzW21ldGhvZF0ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgbGV0IGVtaXRWYWx1ZTtcbiAgICAgICAgICAgICAgICB3aGlsZSAoZW1pdFZhbHVlID0gc2VsZi5fZW1pdENhY2hlc1ttZXRob2RdLnNoaWZ0KCkpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5fZW1pdChtZXRob2QsIGVtaXRWYWx1ZSwgbmV3IEV2ZW50Q29udGV4dChzZWxmKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIF9lbWl0OiBmdW5jdGlvbiAobWV0aG9kLCBhcmdzLCBjb250ZXh0KSB7XG4gICAgICAgIHZhciBoYW5kbGVycyA9IHRoaXMuX2hhbmRsZXJzW21ldGhvZF07XG4gICAgICAgIGlmIChoYW5kbGVycyAmJiBoYW5kbGVycy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB2YXIgY29waWVkSGFuZGxlcnMgPSBoYW5kbGVycy5jb25jYXQoKTtcbiAgICAgICAgICAgIGNvcGllZEhhbmRsZXJzLmZvckVhY2goZnVuY3Rpb24gKGhhbmRsZXIpIHtcbiAgICAgICAgICAgICAgICBfZmFzdEFwcGx5KGhhbmRsZXIsIGNvbnRleHQsIGFyZ3MpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBfZW1pdE5hbWVzcGFjZTogZnVuY3Rpb24gKG5zLCBtb2RlLCBhcmdzLCBjb250ZXh0KSB7XG4gICAgICAgIGlmIChucy5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuX2VtaXQobnMuam9pbignLicpICsgJy4nICsgbW9kZSwgYXJncywgY29udGV4dCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fZW1pdE5hbWVzcGFjZShucy5zbGljZSgwLCAtMSksIG1vZGUsIGFyZ3MsIGNvbnRleHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZW1pdChtb2RlLCBhcmdzLCBjb250ZXh0KTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgZW1pdDogZnVuY3Rpb24gKG1ldGhvZCkge1xuICAgICAgICB2YXIgY29udGV4dCA9IG5ldyBFdmVudENvbnRleHQodGhpcyk7XG4gICAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICAgICAgdmFyIG5zID0gbWV0aG9kLnNwbGl0KCcuJyk7XG4gICAgICAgIHZhciBub3RFbXB0eSA9IGZhbHNlO1xuICAgICAgICBpZiAoIXRoaXMuX2VtaXQobWV0aG9kLCBhcmdzLCBjb250ZXh0KSkge1xuICAgICAgICAgICAgbm90RW1wdHkgPSB0aGlzLl9lbWl0TmFtZXNwYWNlKG5zLCAnKicsIGFyZ3MsIGNvbnRleHQpXG4gICAgICAgIH1cbiAgICAgICAgbm90RW1wdHkgPSB0aGlzLl9lbWl0TmFtZXNwYWNlKG5zLCAnKycsIGFyZ3MsIGNvbnRleHQpO1xuICAgICAgICBpZiAoIW5vdEVtcHR5ICYmIHRoaXMuY29uZmlnLmNhY2hlKSB7XG4gICAgICAgICAgICAodGhpcy5fZW1pdENhY2hlc1ttZXRob2RdIHx8ICh0aGlzLl9lbWl0Q2FjaGVzW21ldGhvZF0gPSBbXSkpLnB1c2goYXJncyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvbnRleHQ7XG4gICAgfVxufTtcblxuZnVuY3Rpb24gX2Zhc3RBcHBseShmdW5jLCB0aGF0LCBhcmdzKSB7XG4gICAgYXJncyA9IGFyZ3MgfHwgW107XG4gICAgc3dpdGNoIChhcmdzLmxlbmd0aCkge1xuICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICByZXR1cm4gZnVuYy5jYWxsKHRoYXQpO1xuICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICByZXR1cm4gZnVuYy5jYWxsKHRoYXQsIGFyZ3NbMF0pO1xuICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICByZXR1cm4gZnVuYy5jYWxsKHRoYXQsIGFyZ3NbMF0sIGFyZ3NbMV0pO1xuICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICByZXR1cm4gZnVuYy5jYWxsKHRoYXQsIGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0pO1xuICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICByZXR1cm4gZnVuYy5jYWxsKHRoYXQsIGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0sIGFyZ3NbM10pXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICByZXR1cm4gZnVuYy5hcHBseSh0aGF0LCBhcmdzKTtcbiAgICB9XG59XG4vLyBBYm91dCAxLjV4IGZhc3RlciB0aGFuIHRoZSB0d28tYXJnIHZlcnNpb24gb2YgQXJyYXkjc3BsaWNlKCkuXG5mdW5jdGlvbiBzcGxpY2VPbmUobGlzdCwgaW5kZXgpIHtcbiAgICBmb3IgKHZhciBpID0gaW5kZXgsIGsgPSBpICsgMSwgbiA9IGxpc3QubGVuZ3RoOyBrIDwgbjsgaSArPSAxLCBrICs9IDEpXG4gICAgICAgIGxpc3RbaV0gPSBsaXN0W2tdO1xuICAgIGxpc3QucG9wKCk7XG59XG5pZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IEV2ZW50RW1pdHRlcjtcbn1cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9jb21wb25lbnQvRXZlbnRFbWl0dGVyLmpzXG4gKiovIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGdvZHNvbmcgb24gMTYvOS8yLlxuICovXG52YXIgbm9kZUNsYXNzTWFwO1xudmFyIF9ub2RlTWFwID0ge307XG5mdW5jdGlvbiBub29wKCkge1xufVxuY2xhc3MgRU5vZGUge1xuICAgIGNvbnN0cnVjdG9yKG5vZGVJbmZvKSB7XG4gICAgICAgIHRoaXMubm9kZUluZm8gPSBub2RlSW5mbztcbiAgICAgICAgdGhpcy5jaGlsZHJlbiA9IFtdO1xuXG4gICAgICAgIGlmIChub2RlSW5mby5jaGlsZHJlbiAmJiBub2RlSW5mby5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVJbmZvLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jaGlsZHJlbi5wdXNoKG5ldyBub2RlQ2xhc3NNYXBbbm9kZUluZm8uY2hpbGRyZW5baV0ubm9kZVR5cGVdKG5vZGVJbmZvLmNoaWxkcmVuW2ldKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkZWxldGUgbm9kZUluZm8uY2hpbGRyZW47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fQXJyb3dXaWR0aCA9IDEwO1xuICAgICAgICB0aGlzLl9leHBhbmRhYmxlID0gdGhpcy5ub2RlSW5mby5jaGlsZE5vZGVDb3VudCA+IDA7XG4gICAgICAgIHRoaXMuZXhwYW5kZWQgPSBmYWxzZTtcbiAgICAgICAgX25vZGVNYXBbbm9kZUluZm8ubm9kZUlkXSA9IHRoaXM7XG4gICAgfVxuXG4gICAgX2NyZWF0ZUNvbnRhaW5lcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NyZWF0ZUVsZW1lbnQoJ2xpJywgdGhpcy5ub2RlSW5mby5jaGlsZE5vZGVDb3VudCA+IDAgPyAncGFyZW50JyA6ICcnKTtcbiAgICB9XG5cbiAgICBfcmVuZGVyQm9keSgpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdfcmVuZGVyQm9keSBub3QgaW1wbGVtZW50Jyk7XG4gICAgfVxuXG4gICAgcmVtb3ZlQ2hpbGQobm9kZUlkKSB7XG4gICAgICAgIHZhciBjaGlsZE5vZGUgPSBfbm9kZU1hcFtub2RlSWRdO1xuICAgICAgICBpZiAoY2hpbGROb2RlKSB7XG4gICAgICAgICAgICB0aGlzLmNoaWxkRWxlbWVudC5yZW1vdmVDaGlsZChjaGlsZE5vZGUuZWxlbWVudCk7XG4gICAgICAgICAgICBpZiAoY2hpbGROb2RlLmNoaWxkRWxlbWVudCkge1xuICAgICAgICAgICAgICAgIHRoaXMuY2hpbGRFbGVtZW50LnJlbW92ZUNoaWxkKGNoaWxkTm9kZS5jaGlsZEVsZW1lbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZGVsZXRlIF9ub2RlTWFwW25vZGVJZF07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ2NhbiBub3QgcmVtb3ZlIG5vZGU6Jywgbm9kZUlkKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGluc2VydENoaWxkKHByZXZOb2RlSWQsIG5vZGVJbmZvKSB7XG4gICAgICAgIHZhciBhZnRlck5vZGUsIGkgPSAwO1xuICAgICAgICB2YXIgbmV3Tm9kZSA9IG5ldyBub2RlQ2xhc3NNYXBbbm9kZUluZm8ubm9kZVR5cGVdKG5vZGVJbmZvKTtcbiAgICAgICAgdmFyIGVsZW1lbnRzID0gbmV3Tm9kZS5yZW5kZXIoKTtcbiAgICAgICAgaWYgKHByZXZOb2RlSWQgIT0gLTEpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGwgPSB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoaWxkcmVuW2ldLm5vZGVJbmZvLm5vZGVJZCA9PSBwcmV2Tm9kZUlkKSB7XG4gICAgICAgICAgICAgICAgICAgIGFmdGVyTm9kZSA9IHRoaXMuY2hpbGRyZW5baSArIDFdO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpID09IGwpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2NhbiBub3QgZmluZCB0aGUgcHJldk5vZGU6JywgcHJldk5vZGVJZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGFmdGVyTm9kZSkge1xuICAgICAgICAgICAgdGhpcy5jaGlsZEVsZW1lbnQuaW5zZXJ0QmVmb3JlKGVsZW1lbnRzWzBdLCBhZnRlck5vZGUuZWxlbWVudCk7XG4gICAgICAgICAgICBlbGVtZW50c1sxXSAmJiB0aGlzLmNoaWxkRWxlbWVudC5pbnNlcnRCZWZvcmUoZWxlbWVudHNbMV0sIGFmdGVyTm9kZS5lbGVtZW50KTtcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4uc3BsaWNlKGksIDAsIG5ld05vZGUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5jaGlsZEVsZW1lbnQuYXBwZW5kQ2hpbGQoZWxlbWVudHNbMF0pO1xuICAgICAgICAgICAgZWxlbWVudHNbMV0gJiYgdGhpcy5jaGlsZEVsZW1lbnQuYXBwZW5kQ2hpbGQoZWxlbWVudHNbMV0pO1xuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbi5wdXNoKG5ld05vZGUpXG4gICAgICAgIH1cblxuXG4gICAgfVxuXG4gICAgX3JlbmRlckNoaWxkKCkge1xuICAgICAgICB2YXIgY2hpbGRFbGVtZW50ID0gbnVsbDtcbiAgICAgICAgaWYgKHRoaXMubm9kZUluZm8uY2hpbGROb2RlQ291bnQgPiAwKSB7XG4gICAgICAgICAgICBjaGlsZEVsZW1lbnQgPSB0aGlzLmNoaWxkRWxlbWVudCA9IHRoaXMuX2NyZWF0ZUVsZW1lbnQoJ29sJywgJ2NoaWxkcmVuJyk7XG5cbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4uZm9yRWFjaChmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIHZhciBlbGVtZW50cyA9IGUucmVuZGVyKCk7XG4gICAgICAgICAgICAgICAgY2hpbGRFbGVtZW50LmFwcGVuZENoaWxkKGVsZW1lbnRzWzBdKTtcbiAgICAgICAgICAgICAgICBlbGVtZW50c1sxXSAmJiBjaGlsZEVsZW1lbnQuYXBwZW5kQ2hpbGQoZWxlbWVudHNbMV0pO1xuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHZhciBjbG9zZVRhZyA9IHRoaXMuX2NyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgICAgICAgICBjbG9zZVRhZy5fbm9kZUlkID0gdGhpcy5ub2RlSW5mby5ub2RlSWQ7XG4gICAgICAgICAgICBjbG9zZVRhZy5pbm5lckhUTUwgPSBgPGRpdiBjbGFzcz1cInNlbGVjdGlvbi1maWxsXCI+PC9kaXY+PHNwYW4gY2xhc3M9XCJ3ZWJraXQtaHRtbC10YWcgY2xvc2VcIj4mbHQ7PHNwYW4gY2xhc3M9XCJ3ZWJraXQtaHRtbC1jbG9zZS10YWctbmFtZVwiPi8ke3RoaXMubm9kZUluZm8ubm9kZU5hbWUudG9Mb3dlckNhc2UoKX08L3NwYW4+Jmd0Ozwvc3Bhbj5gXG4gICAgICAgICAgICBjaGlsZEVsZW1lbnQuYXBwZW5kQ2hpbGQoY2xvc2VUYWcpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjaGlsZEVsZW1lbnQ7XG4gICAgfVxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgICB0aGlzLl9ob29rKCdAYmVmb3JlUmVuZGVyJykoKTtcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gdGhpcy5fY3JlYXRlQ29udGFpbmVyKCk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5pbm5lckhUTUwgPSB0aGlzLl9yZW5kZXJCb2R5KCk7XG4gICAgICAgIHRoaXMuY2hpbGRFbGVtZW50ID0gdGhpcy5fcmVuZGVyQ2hpbGQoKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5fdG9nZ2xlRWxlbWVudFRyZWUuYmluZCh0aGlzKSwgZmFsc2UpO1xuICAgICAgICB0aGlzLl9ob29rKCdAYWZ0ZXJSZW5kZXInKSgpO1xuICAgICAgICB0aGlzLmVsZW1lbnQuX25vZGVJZCA9IHRoaXMubm9kZUluZm8ubm9kZUlkO1xuICAgICAgICByZXR1cm4gW3RoaXMuZWxlbWVudCwgdGhpcy5jaGlsZEVsZW1lbnRdO1xuICAgIH1cblxuICAgIF9ob29rKG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIHR5cGVvZiB0aGlzW25hbWVdID09PSAnZnVuY3Rpb24nID8gdGhpc1tuYW1lXS5iaW5kKHRoaXMpIDogbm9vcDtcbiAgICB9XG5cbiAgICBfdG9nZ2xlRWxlbWVudFRyZWUoZXZlbnQpIHtcbiAgICAgICAgdmFyIGVsZW1lbnQgPSBldmVudC5jdXJyZW50VGFyZ2V0O1xuICAgICAgICBpZiAodGhpcy5fZXhwYW5kYWJsZSAmJiB0aGlzLmlzQ2xpY2tBdFRyaWFuZ2xlKGV2ZW50KSkge1xuICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICBpZiAodGhpcy5leHBhbmRlZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuY29sbGFwc2VDaGlsZCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5leHBhbmRDaGlsZCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgX3RvdGFsT2Zmc2V0KGVsZW1lbnQpIHtcbiAgICAgICAgdmFyIHJlY3QgPSBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbGVmdDogcmVjdC5sZWZ0LFxuICAgICAgICAgICAgdG9wOiByZWN0LnRvcFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGlzQ2xpY2tBdFRyaWFuZ2xlKGV2ZW50KSB7XG4gICAgICAgIHZhciBwYWRkaW5nTGVmdFZhbHVlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUodGhpcy5lbGVtZW50KS5wYWRkaW5nTGVmdDtcbiAgICAgICAgdmFyIGNvbXB1dGVkTGVmdFBhZGRpbmcgPSBwYXJzZUZsb2F0KHBhZGRpbmdMZWZ0VmFsdWUpO1xuICAgICAgICB2YXIgbGVmdCA9IHRoaXMuX3RvdGFsT2Zmc2V0KHRoaXMuZWxlbWVudCkubGVmdCArIGNvbXB1dGVkTGVmdFBhZGRpbmc7XG4gICAgICAgIHJldHVybiBldmVudC5wYWdlWCA+PSBsZWZ0ICYmIGV2ZW50LnBhZ2VYIDw9IGxlZnQgKyB0aGlzLl9BcnJvd1dpZHRoO1xuICAgIH1cblxuICAgIGV4cGFuZENoaWxkKCkge1xuICAgICAgICBpZiAoIXRoaXMuZXhwYW5kZWQpIHtcbiAgICAgICAgICAgIHRoaXMuZXhwYW5kZWQgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTmFtZSA9IHRoaXMuZWxlbWVudC5jbGFzc05hbWUucmVwbGFjZSgvIGV4cGFuZGVkfCQvLCAnIGV4cGFuZGVkJyk7XG4gICAgICAgICAgICB0aGlzLmNoaWxkRWxlbWVudC5jbGFzc05hbWUgPSB0aGlzLmNoaWxkRWxlbWVudC5jbGFzc05hbWUucmVwbGFjZSgvIGV4cGFuZGVkfCQvLCAnIGV4cGFuZGVkJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb2xsYXBzZUNoaWxkKCkge1xuICAgICAgICBpZiAodGhpcy5leHBhbmRlZCkge1xuICAgICAgICAgICAgdGhpcy5leHBhbmRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTmFtZSA9IHRoaXMuZWxlbWVudC5jbGFzc05hbWUucmVwbGFjZSgvIGV4cGFuZGVkLywgJycpO1xuICAgICAgICAgICAgdGhpcy5jaGlsZEVsZW1lbnQuY2xhc3NOYW1lID0gdGhpcy5jaGlsZEVsZW1lbnQuY2xhc3NOYW1lLnJlcGxhY2UoLyBleHBhbmRlZC8sICcnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9jcmVhdGVFbGVtZW50KHRhZ05hbWUsIGNsYXNzTmFtZSkge1xuICAgICAgICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnTmFtZSk7XG4gICAgICAgIGlmIChjbGFzc05hbWUpZWxlbWVudC5jbGFzc05hbWUgPSBjbGFzc05hbWU7XG4gICAgICAgIHJldHVybiBlbGVtZW50O1xuXG4gICAgfVxuXG59XG5jbGFzcyBEb2N1bWVudE5vZGUgZXh0ZW5kcyBFTm9kZSB7XG4gICAgcmVuZGVyKCkge1xuICAgICAgICB0aGlzLmVsZW1lbnQgPSB0aGlzLl9jcmVhdGVFbGVtZW50KCdvbCcsICdlbGVtZW50cy10cmVlJyk7XG4gICAgICAgIHRoaXMuY2hpbGRyZW4uZm9yRWFjaChmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgdmFyIGVsZW1lbnRzID0gZS5yZW5kZXIoKTtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZChlbGVtZW50c1swXSk7XG4gICAgICAgICAgICBlbGVtZW50c1sxXSAmJiB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQoZWxlbWVudHNbMV0pO1xuXG4gICAgICAgIH0uYmluZCh0aGlzKSlcbiAgICAgICAgdGhpcy5jaGlsZEVsZW1lbnQgPSB0aGlzLmVsZW1lbnQ7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQ7XG4gICAgfVxufVxuY2xhc3MgRWxlbWVudE5vZGUgZXh0ZW5kcyBFTm9kZSB7XG4gICAgWydAYWZ0ZXJSZW5kZXInXSgpIHtcbiAgICAgICAgaWYgKHRoaXMubm9kZUluZm8ubm9kZU5hbWUgPT09ICdIVE1MJykge1xuICAgICAgICAgICAgdGhpcy5leHBhbmRDaGlsZCgpO1xuICAgICAgICAgICAgdGhpcy5fZXhwYW5kYWJsZSA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTmFtZSArPSAnIGFsd2F5cy1wYXJlbnQnO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgX3JlbmRlckJvZHkoKSB7XG4gICAgICAgIHZhciBib2R5ID0gYDxkaXYgY2xhc3M9XCJzZWxlY3Rpb24tZmlsbFwiPjwvZGl2PjxzcGFuIGNsYXNzPVwid2Via2l0LWh0bWwtdGFnXCI+Jmx0OzxzcGFuIGNsYXNzPVwid2Via2l0LWh0bWwtdGFnLW5hbWVcIj4ke3RoaXMubm9kZUluZm8ubm9kZU5hbWUudG9Mb3dlckNhc2UoKX08L3NwYW4+YFxuICAgICAgICBpZiAodGhpcy5ub2RlSW5mby5hdHRyaWJ1dGVzICYmIHRoaXMubm9kZUluZm8uYXR0cmlidXRlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubm9kZUluZm8uYXR0cmlidXRlcy5sZW5ndGggLSAxOyBpICs9IDIpIHtcbiAgICAgICAgICAgICAgICBib2R5ICs9IGAgPHNwYW4gY2xhc3M9XCJ3ZWJraXQtaHRtbC1hdHRyaWJ1dGVcIj48c3BhbiBjbGFzcz1cIndlYmtpdC1odG1sLWF0dHJpYnV0ZS1uYW1lXCI+JHt0aGlzLm5vZGVJbmZvLmF0dHJpYnV0ZXNbaV19PC9zcGFuPj1cIjxzcGFuIGNsYXNzPVwid2Via2l0LWh0bWwtYXR0cmlidXRlLXZhbHVlXCI+JHt0aGlzLm5vZGVJbmZvLmF0dHJpYnV0ZXNbaSArIDFdfTwvc3Bhbj5cIjwvc3Bhbj5gO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGJvZHkgKz0gYCZndDs8L3NwYW4+PHNwYW4gY2xhc3M9XCJ3ZWJraXQtaHRtbC10ZXh0LW5vZGUgYm9ndXNcIj4ke3RoaXMubm9kZUluZm8uY2hpbGROb2RlQ291bnQgPiAwID8gJ+KApicgOiAnJ308L3NwYW4+PHNwYW4gY2xhc3M9XCJ3ZWJraXQtaHRtbC10YWcgY2xvc2UtdGFnLXNlY3Rpb25cIj4mbHQ7PHNwYW4gY2xhc3M9XCJ3ZWJraXQtaHRtbC1jbG9zZS10YWctbmFtZVwiPi8ke3RoaXMubm9kZUluZm8ubm9kZU5hbWUudG9Mb3dlckNhc2UoKX08L3NwYW4+Jmd0Ozwvc3Bhbj48L3NwYW4+YFxuICAgICAgICByZXR1cm4gYm9keTtcbiAgICB9XG59XG5jbGFzcyBUZXh0Tm9kZSBleHRlbmRzIEVOb2RlIHtcbiAgICBfcmVuZGVyQm9keSgpIHtcbiAgICAgICAgcmV0dXJuIGA8ZGl2IGNsYXNzPVwic2VsZWN0aW9uLWZpbGxcIj48L2Rpdj48c3BhbiBjbGFzcz1cIndlYmtpdC1odG1sLXRleHQtbm9kZSBib2d1c1wiPiR7dGhpcy5ub2RlSW5mby5ub2RlVmFsdWV9PC9zcGFuPmA7XG4gICAgfVxufVxuY2xhc3MgRG9jdW1lbnRUeXBlTm9kZSBleHRlbmRzIEVOb2RlIHtcbiAgICBfcmVuZGVyQm9keSgpIHtcbiAgICAgICAgcmV0dXJuIGA8ZGl2IGNsYXNzPVwic2VsZWN0aW9uLWZpbGxcIj48L2Rpdj48c3BhbiBjbGFzcz1cIndlYmtpdC1odG1sLWRvY3R5cGVcIj4mbHQ7IURPQ1RZUEUgaHRtbCZndDs8L3NwYW4+YDtcbiAgICB9XG59XG5ub2RlQ2xhc3NNYXAgPSB7XG4gICAgW05vZGUuRUxFTUVOVF9OT0RFXTogRWxlbWVudE5vZGUsXG4gICAgW05vZGUuVEVYVF9OT0RFXTogVGV4dE5vZGUsXG4gICAgW05vZGUuRE9DVU1FTlRfVFlQRV9OT0RFXTogRG9jdW1lbnRUeXBlTm9kZSxcbn07XG5Eb2N1bWVudE5vZGUuYWxsID0gX25vZGVNYXA7XG5leHBvcnQge1xuICAgIERvY3VtZW50Tm9kZSxcbiAgICBUZXh0Tm9kZSxcbiAgICBFbGVtZW50Tm9kZVxufTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9jb21wb25lbnQvTm9kZVJlbmRlci5qc1xuICoqLyIsIi8qKlxuICogQ3JlYXRlZCBieSBnb2Rzb25nIG9uIDE2LzEwLzcuXG4gKi9cbmltcG9ydCBFdmVudEVtaXR0ZXIgZnJvbSBcIi4vRXZlbnRFbWl0dGVyXCI7XG5jbGFzcyBQb3J0IGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgICBjb25zdHJ1Y3Rvcihwcm94eSkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmlkID0gY2hyb21lLmRldnRvb2xzLmluc3BlY3RlZFdpbmRvdy50YWJJZDtcbiAgICAgICAgdGhpcy5wcm94eSA9IHByb3h5O1xuICAgICAgICB0aGlzLl9wb3J0ID0gY2hyb21lLnJ1bnRpbWUuY29ubmVjdCh7XG4gICAgICAgICAgICBuYW1lOiAnJyArIGNocm9tZS5kZXZ0b29scy5pbnNwZWN0ZWRXaW5kb3cudGFiSWQgKyAnQCcgKyB0aGlzLnByb3h5XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLl9wb3J0Lm9uTWVzc2FnZS5hZGRMaXN0ZW5lcihtZXNzYWdlPT50aGlzLmVtaXQoJ2RhdGEnLCBtZXNzYWdlKSk7XG4gICAgfVxuXG4gICAgc2VuZChtc2cpIHtcbiAgICAgICAgdGhpcy5fcG9ydC5wb3N0TWVzc2FnZShtc2cpO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUG9ydDtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9jb21wb25lbnQvUG9ydC5qc1xuICoqLyIsIi8qKlxuICogQ3JlYXRlZCBieSBnb2Rzb25nIG9uIDE2LzEwLzguXG4gKi9cbmNsYXNzIFN0eWxlUmVuZGVyIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICB9XG5cbiAgICByZW5kZXJTZWxlY3Rvckxpc3QoY3NzUnVsZSkge1xuICAgICAgICByZXR1cm4gY3NzUnVsZS5zZWxlY3Rvckxpc3Quc2VsZWN0b3JzLm1hcChzZWxlY3Rvcj0+c2VsZWN0b3IudGV4dCkuam9pbignLCcpO1xuICAgIH1cblxuICAgIHJlbmRlclN0eWxlUHJvcGVydGllcyhjc3NSdWxlKSB7XG4gICAgICAgIHZhciBodG1sID0gJyc7XG4gICAgICAgIGNzc1J1bGUuc3R5bGUuY3NzUHJvcGVydGllcy5mb3JFYWNoKGZ1bmN0aW9uIChjc3MpIHtcbiAgICAgICAgICAgIGh0bWwgKz0gYDxsaSBjbGFzcz1cInN0eWxlcy1wYW5lbC1ob3ZlcmVkXCI+PGlucHV0IGNsYXNzPVwiZW5hYmxlZC1idXR0b25cIiB0eXBlPVwiY2hlY2tib3hcIj48c3BhbiBjbGFzcz1cInN0eWxlcy1jbGlwYm9hcmQtb25seVwiPiAgICA8L3NwYW4+PHNwYW4gY2xhc3M9XCJ3ZWJraXQtY3NzLXByb3BlcnR5XCI+JHtjc3MubmFtZX08L3NwYW4+OiA8c3BhbiBjbGFzcz1cImV4cGFuZC1lbGVtZW50XCI+PC9zcGFuPjxzcGFuIGNsYXNzPVwidmFsdWVcIj4ke2Nzcy52YWx1ZX08L3NwYW4+OzwvbGk+YFxuICAgICAgICB9KVxuICAgICAgICByZXR1cm4gaHRtbDtcbiAgICB9XG5cbiAgICByZW5kZXIoY3NzUnVsZSkge1xuICAgICAgICByZXR1cm4gYDxkaXYgY2xhc3M9XCJzdHlsZXMtc2VjdGlvbiBtYXRjaGVkLXN0eWxlcyBtb25vc3BhY2UgcmVhZC1vbmx5XCI+XG4gICAgPGRpdiBjbGFzcz1cInN0eWxlcy1zZWN0aW9uLXRpdGxlIHN0eWxlcy1zZWxlY3RvclwiPlxuICAgIDxkaXYgY2xhc3M9XCJtZWRpYS1saXN0IG1lZGlhLW1hdGNoZXNcIj48L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwic3R5bGVzLXNlY3Rpb24tc3VidGl0bGVcIj48L2Rpdj5cbiAgICA8ZGl2PjxzcGFuIGNsYXNzPVwic2VsZWN0b3JcIj48c3BhbiBjbGFzcz1cInNpbXBsZS1zZWxlY3RvciBzZWxlY3Rvci1tYXRjaGVzXCI+JHt0aGlzLnJlbmRlclNlbGVjdG9yTGlzdChjc3NSdWxlKX08L3NwYW4+PC9zcGFuPjxzcGFuPiB7PC9zcGFuPlxuICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICAgIDxvbCBjbGFzcz1cInN0eWxlLXByb3BlcnRpZXMgbW9ub3NwYWNlXCIgdGFiaW5kZXg9XCIwXCI+XG4gICAgJHt0aGlzLnJlbmRlclN0eWxlUHJvcGVydGllcyhjc3NSdWxlKX1cblxuXG4gICAgPC9vbD5cbiAgICA8ZGl2IGNsYXNzPVwic2lkZWJhci1wYW5lLWNsb3NpbmctYnJhY2VcIj59PC9kaXY+XG48L2Rpdj5gXG4gICAgfVxufVxuZXhwb3J0IGRlZmF1bHQgU3R5bGVSZW5kZXI7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvY29tcG9uZW50L1N0eWxlUmVuZGVyLmpzXG4gKiovIl0sInNvdXJjZVJvb3QiOiIifQ==