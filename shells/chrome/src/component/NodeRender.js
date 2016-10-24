/**
 * Created by godsong on 16/9/2.
 */
var nodeClassMap;
var _nodeMap = {};
function noop() {
}
class ENode {
    constructor(nodeInfo) {
        this.nodeInfo = nodeInfo;
        this.children = [];
        //fix ios childNodeCount loss bug
        this.nodeInfo.nodeName==this.nodeInfo.nodeName||'';
        if (nodeInfo.children && nodeInfo.children.length > 0) {
            this.nodeInfo.childNodeCount=isFinite(nodeInfo.childNodeCount)?nodeInfo.childNodeCount:nodeInfo.children.length;
            for (var i = 0; i < this.nodeInfo.childNodeCount; i++) {
                this.children.push(new nodeClassMap[nodeInfo.children[i].nodeType](nodeInfo.children[i]));
            }
            delete nodeInfo.children;
        }

        this._ArrowWidth = 10;
        this._expandable = this.nodeInfo.childNodeCount > 0;
        this.expanded = false;
        _nodeMap[nodeInfo.nodeId] = this;
    }

    _createContainer() {
        return this._createElement('li', this.nodeInfo.childNodeCount > 0 ? 'parent' : '');
    }

    _renderBody() {
        throw new Error('_renderBody not implement');
    }

    removeChild(nodeId) {
        var childNode = _nodeMap[nodeId];
        if (childNode) {
            this.childElement.removeChild(childNode.element);
            if (childNode.childElement) {
                this.childElement.removeChild(childNode.childElement);
            }
            delete _nodeMap[nodeId];
        }
        else {
            console.warn('can not remove node:', nodeId);
        }
    }

    insertChild(prevNodeId, nodeInfo) {
        var afterNode, i = 0;
        var newNode = new nodeClassMap[nodeInfo.nodeType](nodeInfo);
        var elements = newNode.render();
        if (prevNodeId&&prevNodeId != -1) {
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
        }
        else {
            this.childElement.appendChild(elements[0]);
            elements[1] && this.childElement.appendChild(elements[1]);
            this.children.push(newNode)
        }


    }

    _renderChild() {
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
            closeTag.innerHTML = `<div class="selection-fill"></div><span class="webkit-html-tag close">&lt;<span class="webkit-html-close-tag-name">/${this.nodeInfo.nodeName.toLowerCase()}</span>&gt;</span>`
            childElement.appendChild(closeTag);
        }
        return childElement;
    }

    render() {
        this._hook('@beforeRender')();
        this.element = this._createContainer();
        this.element.innerHTML = this._renderBody();
        this.childElement = this._renderChild();
        this.element.addEventListener('click', this._toggleElementTree.bind(this), false);
        this._hook('@afterRender')();
        this.element._nodeId = this.nodeInfo.nodeId;
        return [this.element, this.childElement];
    }

    _hook(name) {
        return typeof this[name] === 'function' ? this[name].bind(this) : noop;
    }

    _toggleElementTree(event) {
        var element = event.currentTarget;
        if (this._expandable && this.isClickAtTriangle(event)) {
            event.stopPropagation();
            if (this.expanded) {
                this.collapseChild();
            }
            else {
                this.expandChild();
            }
        }
        else {
        }
    }

    _totalOffset(element) {
        var rect = element.getBoundingClientRect();
        return {
            left: rect.left,
            top: rect.top
        };
    }

    isClickAtTriangle(event) {
        var paddingLeftValue = window.getComputedStyle(this.element).paddingLeft;
        var computedLeftPadding = parseFloat(paddingLeftValue);
        var left = this._totalOffset(this.element).left + computedLeftPadding;
        return event.pageX >= left && event.pageX <= left + this._ArrowWidth;
    }

    expandChild() {
        if (!this.expanded) {
            this.expanded = true;
            this.element.className = this.element.className.replace(/ expanded|$/, ' expanded');
            this.childElement.className = this.childElement.className.replace(/ expanded|$/, ' expanded');
        }
    }

    collapseChild() {
        if (this.expanded) {
            this.expanded = false;
            this.element.className = this.element.className.replace(/ expanded/, '');
            this.childElement.className = this.childElement.className.replace(/ expanded/, '');
        }
    }

    _createElement(tagName, className) {
        var element = document.createElement(tagName);
        if (className)element.className = className;
        return element;

    }

}
class DocumentNode extends ENode {
    render() {
        this.element = this._createElement('ol', 'elements-tree');
        this.children.forEach(function (e) {
            var elements = e.render();
            this.element.appendChild(elements[0]);
            elements[1] && this.element.appendChild(elements[1]);

        }.bind(this))
        this.childElement = this.element;
        return [this.element];
    }
}
class ElementNode extends ENode {
    ['@afterRender']() {
        if (this.nodeInfo.nodeName === 'HTML') {
            this.expandChild();
            this._expandable = false;
            this.element.className += ' always-parent';
        }
    }

    _renderBody() {
        var body = `<div class="selection-fill"></div><span class="webkit-html-tag">&lt;<span class="webkit-html-tag-name">${this.nodeInfo.nodeName.toLowerCase()}</span>`
        if (this.nodeInfo.attributes && this.nodeInfo.attributes.length > 0) {
            for (var i = 0; i < this.nodeInfo.attributes.length - 1; i += 2) {
                body += ` <span class="webkit-html-attribute"><span class="webkit-html-attribute-name">${this.nodeInfo.attributes[i]}</span>="<span class="webkit-html-attribute-value">${this.nodeInfo.attributes[i + 1]}</span>"</span>`;
            }
        }
        body += `&gt;</span><span class="webkit-html-text-node bogus">${this.nodeInfo.childNodeCount > 0 ? '…' : ''}</span><span class="webkit-html-tag close-tag-section">&lt;<span class="webkit-html-close-tag-name">/${this.nodeInfo.nodeName.toLowerCase()}</span>&gt;</span></span>`
        return body;
    }
}
class TextNode extends ENode {
    _renderBody() {
        return `<div class="selection-fill"></div><span class="webkit-html-text-node bogus">${this.nodeInfo.nodeValue}</span>`;
    }
}
class DocumentTypeNode extends ENode {
    _renderBody() {
        return `<div class="selection-fill"></div><span class="webkit-html-doctype">&lt;!DOCTYPE html&gt;</span>`;
    }
}
nodeClassMap = {
    [Node.ELEMENT_NODE]: ElementNode,
    [Node.TEXT_NODE]: TextNode,
    [Node.DOCUMENT_NODE]:DocumentNode,
    [Node.DOCUMENT_TYPE_NODE]: DocumentTypeNode,
};
DocumentNode.all = _nodeMap;
export {
    DocumentNode,
    TextNode,
    ElementNode
};