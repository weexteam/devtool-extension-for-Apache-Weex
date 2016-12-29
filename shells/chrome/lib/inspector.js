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
/******/ 	return __webpack_require__(__webpack_require__.s = 8);
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
/* 1 */,
/* 2 */
/***/ function(module, exports) {

"use strict";
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
    function ENode(nodeInfo, parent) {
        _classCallCheck(this, ENode);

        this.nodeInfo = nodeInfo;
        this.children = [];
        this.parent = parent;
        this.deep = parent ? parent.deep + 1 : 0;
        //fix ios childNodeCount loss bug
        this.nodeInfo.nodeName == this.nodeInfo.nodeName || '';
        if (nodeInfo.children && nodeInfo.children.length > 0) {
            this.nodeInfo.childNodeCount = isFinite(nodeInfo.childNodeCount) ? nodeInfo.childNodeCount : nodeInfo.children.length;
            for (var i = 0; i < this.nodeInfo.childNodeCount; i++) {
                this.children.push(new nodeClassMap[nodeInfo.children[i].nodeType](nodeInfo.children[i], this));
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
        key: '_addAttribute',
        value: function _addAttribute(element, attrName, attrValue, extraFlag) {
            var attr = document.createElement('span');
            attr.className = 'webkit-html-attribute ' + extraFlag;
            attr.innerHTML = ' <span class="webkit-html-attribute-name">' + attrName + '</span>="<span class="webkit-html-attribute-value">' + attrValue + '</span>"';
            var tag = element.querySelector('.webkit-html-tag');
            tag.insertBefore(attr, tag.lastChild);
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
            if (prevNodeId && prevNodeId != -1) {
                for (var l = this.children.length; i < l; i++) {
                    if (this.children[i].nodeInfo.nodeId == prevNodeId) {
                        afterNode = this.children[i + 1];
                        break;
                    }
                }
                if (i == l) {
                    throw new Error('can not find the prevNode:', prevNodeId);
                }
            } else if (prevNodeId == -1) {
                afterNode = this.children[0];
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
            childElement = this.childElement = this._createElement('ol', 'children');
            childElement.deepLevel = this.deep;
            if (this.nodeInfo.childNodeCount > 0) {

                this.children.forEach(function (e) {
                    var elements = e.render();
                    if (e.deepLevel > childElement.deepLevel) {
                        childElement.deepLevel = e.deepLevel;
                    }
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
            this.deepLevel = this.childElement.deepLevel;
            /*this._addAttribute(this.element,'level',this.deepLevel);
            this._addAttribute(this.element,'deep',this.deep);
            if(this.deepLevel>=9){
                this.element.className+=' warn';
            }*/
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
            return [this.element];
        }
    }, {
        key: '_addAttribute',
        value: function _addAttribute() {}
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

nodeClassMap = (_nodeClassMap = {}, _defineProperty(_nodeClassMap, Node.ELEMENT_NODE, ElementNode), _defineProperty(_nodeClassMap, Node.TEXT_NODE, TextNode), _defineProperty(_nodeClassMap, Node.DOCUMENT_NODE, DocumentNode), _defineProperty(_nodeClassMap, Node.DOCUMENT_TYPE_NODE, DocumentTypeNode), _nodeClassMap);
DocumentNode.all = _nodeMap;
exports.DocumentNode = DocumentNode;
exports.TextNode = TextNode;
exports.ElementNode = ElementNode;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _EventEmitter2 = __webpack_require__(0);

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
/* 4 */
/***/ function(module, exports) {

"use strict";
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

/***/ },
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";

var _NodeRender = __webpack_require__(2);

var _Port = __webpack_require__(3);

var _Port2 = _interopRequireDefault(_Port);

var _StyleRender = __webpack_require__(4);

var _StyleRender2 = _interopRequireDefault(_StyleRender);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _documentRoot; /**
                    * Created by godsong on 16/8/29.
                    */

var _deepLevelFlag = 10;
chrome.devtools.inspectedWindow.eval('$WeexInspectorProxy', function (proxy, exceptionInfo) {

    var port = new _Port2.default(proxy);
    var id = 5;
    port.send({ id: 0, method: 'Runtime.enable' });
    port.send({ id: 1, method: 'DOM.enable' });
    port.send({ id: 2, method: 'CSS.enable' });
    port.send({ id: 3, method: 'DOM.getDocument' });
    port.send({ id: 4, method: 'Runtime.run' });
    var _highlightTimer;
    var currentStyleNodeId = -1;
    var requestStyleId = -1,
        requestComputedStyleId = -1;
    var lastSelectedNode;

    function findParent(node) {
        var cur = node;
        do {
            if (cur.tagName == 'LI') {
                return cur;
            }
        } while (cur = cur.parentNode);
        return null;
    }

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
    initResizer();
    var _timer;
    port.on('data', function (data) {
        if (!data) {
            debugger;
        }
        if (data.id == 3 && data.result) {
            var documentRoot = new _NodeRender.DocumentNode(data.result.root);
            _documentRoot = documentRoot;
            console.log(data.result.root);
            document.getElementById('elements').appendChild(documentRoot.render()[0]);
            //analyzeDeepLevel(documentRoot);
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
                var parent = _NodeRender.DocumentNode.all[data.params.parentNodeId];
                if (parent) {
                    parent.insertChild(data.params.previousNodeId, data.params.node);
                    clearTimeout(_timer);
                    _timer = setTimeout(function () {
                        analyzeDeepLevel(_documentRoot);
                    }, 500);
                } else {
                    console.warn('parent[' + data.params.parentNodeId + '] not found when childNodeInserted!');
                }
            } else if (data.method == 'DOM.childNodeRemoved') {
                var _parent = _NodeRender.DocumentNode.all[data.params.parentNodeId];
                if (_parent) {
                    _parent.removeChild(data.params.nodeId);
                    clearTimeout(_timer);
                    _timer = setTimeout(function () {
                        analyzeDeepLevel(_documentRoot);
                    }, 500);
                } else {
                    console.warn('parent[' + data.params.parentNodeId + '] not found when childNodeRemoved!');
                }
            }
    });
    document.querySelector('#validate').onclick = function () {
        _deepLevelFlag = document.querySelector('#deep_level').value;
        analyzeDeepLevel(_documentRoot);
    };
    document.querySelector('#clear').onclick = function () {
        _clearDeepLevelWarnHighlight();
    };
});
function initResizer() {
    var resizer = document.querySelector('.split-widget-resizer');
    var elementWidget = document.querySelector('.element-widget');
    var panel = document.querySelector('.panel');
    resizer.style.left = elementWidget.offsetWidth + 'px';
    function onMouseMove(event) {
        resizer.style.left = event.clientX + 'px';
        elementWidget.style.width = event.clientX + 'px';
    }

    resizer.addEventListener('mousedown', function () {
        panel.style.cursor = 'ew-resize';
        document.addEventListener('mousemove', onMouseMove);
    });
    document.addEventListener('mouseup', function () {
        panel.style.cursor = 'auto';
        document.removeEventListener('mousemove', onMouseMove);
    });
}
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
function _resolveDeepLevel(node) {
    var deep = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

    var deepLevel = deep;
    for (var i = 0, l = node.children.length; i < l; i++) {
        var childDeepLevel = _resolveDeepLevel(node.children[i], deep + 1);
        if (Math.abs(childDeepLevel) > Math.abs(deepLevel)) {
            if (deepLevel < 0 && childDeepLevel > 0) {
                deepLevel = -childDeepLevel;
            } else {
                deepLevel = childDeepLevel;
            }
        }
    }
    var $deepAttr = node.element.querySelector('.ext-deep');
    $deepAttr && $deepAttr.parentNode.removeChild($deepAttr);
    node._addAttribute(node.element, 'deep', deep, 'ext-deep');
    if (node.children.length > 0) {
        node._addAttribute(node.element, 'max-deep', Math.abs(deepLevel), 'ext-deep');
    }
    if (deepLevel >= _deepLevelFlag || deepLevel < 0) {
        node.element.className += ' warn';
    } else if (node.nodeInfo.nodeName === 'div' && node.children.length == 1 && node.children[0].nodeInfo.nodeName === 'div') {
        node.element.className += ' important-warn';
        node.children[0].element.className += ' important-warn';
        deepLevel = -Math.abs(deepLevel);
    }
    return deepLevel;
}
function _clearDeepLevelWarnHighlight() {
    var nodeList = document.querySelectorAll('li.warn,li.important-warn');
    for (var i = 0, l = nodeList.length; i < l; i++) {
        nodeList[i].className = nodeList[i].className.replace(/\s+(warn|important-warn)/g, '');
    }
}
function analyzeDeepLevel(node) {
    _clearDeepLevelWarnHighlight();
    _resolveDeepLevel(node, 0);
}

/***/ }
/******/ ]);