/**
 * Created by godsong on 16/8/29.
 */
import {DocumentNode} from "./component/NodeRender";
import Port from "./component/Port";
import StyleRender from "./component/StyleRender";
var _documentRoot;
var _deepLevelFlag = 10;
chrome.devtools.inspectedWindow.eval('$WeexInspectorProxy', function (proxy, exceptionInfo) {

    var port = new Port(proxy);
    var id = 5;
    port.send({id: 0, method: 'Runtime.enable'});
    port.send({id: 1, method: 'DOM.enable'});
    port.send({id: 2, method: 'CSS.enable'});
    port.send({id: 3, method: 'DOM.getDocument'});
    port.send({id: 4, method: 'Runtime.run'});
    var _highlightTimer;
    var currentStyleNodeId = -1;
    var requestStyleId = -1, requestComputedStyleId = -1;
    var lastSelectedNode;

    function findParent(node) {
        var cur = node;
        do {
            if (cur.tagName == 'LI') {
                return cur;
            }
        }
        while (cur = cur.parentNode);
        return null;
    }

    document.querySelector('#elements').addEventListener('click', function (event) {
        var li = findParent(event.target);
        if (li) {
            if (currentStyleNodeId != li._nodeId) {
                if (lastSelectedNode)lastSelectedNode.className = lastSelectedNode.className.replace(/\s*selected/g, '');

                li.className += ' selected';
                lastSelectedNode = li;
                requestStyleId = id++;
                requestComputedStyleId = id++;
                currentStyleNodeId = li._nodeId;
                port.send({
                    "id": requestStyleId,
                    "method": "CSS.getMatchedStylesForNode",
                    "params": {"nodeId": li._nodeId}
                })
                port.send({
                    "id": requestComputedStyleId,
                    "method": "CSS.getComputedStyleForNode",
                    "params": {"nodeId": li._nodeId}
                })
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
                "params": {"highlightConfig": highlightConfig, "nodeId": li._nodeId}
            })
        }

    });
    window.onblur = function () {
        port.send({"id": id++, "method": "DOM.hideHighlight"});
    };
    document.querySelector('#elements').addEventListener('mouseout', function (event) {
        var li = findParent(event.target);
        if (li) {
            clearTimeout(_highlightTimer);
            _highlightTimer = setTimeout(function () {
                port.send({"id": id++, "method": "DOM.hideHighlight"});
            }, 200)
        }

    });
    initResizer();
    var _timer;
    port.on('data', function (data) {
        if (!data) {
            debugger;
        }
        if (data.id == 3 && data.result) {
            var documentRoot = new DocumentNode(data.result.root);
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
        }
        else if (data.id == requestStyleId && data.result) {

            var stylesHtml = '', stylesRender = new StyleRender();
            data.result.matchedCSSRules.forEach(function (cssRule) {
                stylesHtml += stylesRender.render(cssRule.rule);
            });
            document.getElementById('styles_panel').innerHTML = stylesHtml;

        }
        else if (data.id == requestComputedStyleId && data.result) {
            var computedStyle = {};
            data.result.computedStyle.forEach(function (style) {
                computedStyle[style.name] = style.value;
            });
            document.getElementById('metrics').innerHTML = renderMetrics(computedStyle);
        }
        else if (data.method == 'DOM.childNodeInserted') {
            let parent = DocumentNode.all[data.params.parentNodeId];
            if (parent) {
                parent.insertChild(data.params.previousNodeId, data.params.node);
                clearTimeout(_timer);
                _timer = setTimeout(function () {
                    analyzeDeepLevel(_documentRoot);
                }, 500)

            }
            else {
                console.warn('parent[' + data.params.parentNodeId + '] not found when childNodeInserted!');
            }
        }
        else if (data.method == 'DOM.childNodeRemoved') {
            let parent = DocumentNode.all[data.params.parentNodeId];
            if (parent) {
                parent.removeChild(data.params.nodeId);
                clearTimeout(_timer);
                _timer = setTimeout(function () {
                    analyzeDeepLevel(_documentRoot);
                }, 500)
            }
            else {
                console.warn('parent[' + data.params.parentNodeId + '] not found when childNodeRemoved!')
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
    "contentColor": {"r": 111, "g": 168, "b": 220, "a": 0.66},
    "paddingColor": {"r": 147, "g": 196, "b": 125, "a": 0.55},
    "borderColor": {"r": 255, "g": 229, "b": 153, "a": 0.66},
    "marginColor": {"r": 246, "g": 178, "b": 107, "a": 0.66},
    "eventTargetColor": {"r": 255, "g": 196, "b": 196, "a": 0.66},
    "shapeColor": {"r": 96, "g": 82, "b": 177, "a": 0.8},
    "shapeMarginColor": {"r": 96, "g": 82, "b": 127, "a": 0.6},
    "displayAsMaterial": true
};
function renderMetrics(computedStyle) {
    return `<div class="position" style="background-color: rgba(0, 0, 0, 0);">
        <div class="label">position</div>
        <div class="top">${computedStyle['top'] || '0'}</div>
        <br>

        <div class="left">${computedStyle['left'] || '0'}</div>
        <div class="margin" style="background-color: rgba(246, 178, 107, 0.658824);">
        <div class="label">margin</div>
        <div class="top">${computedStyle['margin-top'] || '-'}</div>
    <br>

    <div class="left">${computedStyle['margin-left'] || '-'}</div>
    <div class="border"
    style="background-color: rgba(255, 229, 153, 0.658824);">
        <div class="label">border</div>
        <div class="top">${computedStyle['border-top'] || '-'}</div>
    <br>

    <div class="left">${computedStyle['border-left'] || '-'}</div>
    <div class="padding"
    style="background-color: rgba(147, 196, 125, 0.54902);">
        <div class="label">padding</div>
        <div class="top">${computedStyle['padding-top'] || '-'}</div>
    <br>

    <div class="left">${computedStyle['padding-left'] || '-'}</div>
    <div class="content"
    style="background-color: rgba(111, 168, 220, 0.658824);"><span>${computedStyle['width'] || '0'}</span>
                                                        × <span>${computedStyle['height'] || '0'}</span></div>
    <div class="right">${computedStyle['padding-right'] || '-'}</div>
    <br>

    <div class="bottom">${computedStyle['padding-bottom'] || '-'}</div>
    </div>
    <div class="right">${computedStyle['border-right'] || '-'}</div>
    <br>

    <div class="bottom">${computedStyle['border-bottom'] || '-'}</div>
    </div>
    <div class="right">${computedStyle['margin-right'] || '-'}</div>
    <br>

    <div class="bottom">${computedStyle['margin-bottom'] || '-'}</div>
    </div>
    <div class="right">${computedStyle['right'] || '0'}</div>
        <br>

        <div class="bottom">${computedStyle['bottom'] || '0'}</div>
        </div>`

}
function _resolveDeepLevel(node, deep = 0) {
    var deepLevel = deep;
    for (var i = 0, l = node.children.length; i < l; i++) {
        let childDeepLevel = _resolveDeepLevel(node.children[i], deep + 1);
        if (Math.abs(childDeepLevel) > Math.abs(deepLevel)) {
            if(deepLevel<0&&childDeepLevel>0){
                deepLevel = -childDeepLevel
            }
            else{
                deepLevel = childDeepLevel
            }
        }
    }
    var $deepAttr=node.element.querySelector('.ext-deep');
    $deepAttr&&$deepAttr.parentNode.removeChild($deepAttr);
    node._addAttribute(node.element, 'deep', deep,'ext-deep');
    if(node.children.length>0){
        node._addAttribute(node.element, 'max-deep', Math.abs(deepLevel),'ext-deep');
    }
    if (deepLevel >= _deepLevelFlag||deepLevel<0) {
        node.element.className += ' warn'
    }
    else if(node.nodeInfo.nodeName==='div'&&node.children.length==1&&node.children[0].nodeInfo.nodeName==='div'){
        node.element.className += ' important-warn';
        node.children[0].element.className+=' important-warn';
        deepLevel=-Math.abs(deepLevel);
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
    _resolveDeepLevel(node, 0)
}
