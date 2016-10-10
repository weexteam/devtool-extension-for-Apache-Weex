/**
 * Created by godsong on 16/10/8.
 */
class StyleRender {
    constructor() {
    }

    renderSelectorList(cssRule) {
        return cssRule.selectorList.selectors.map(selector=>selector.text).join(',');
    }

    renderStyleProperties(cssRule) {
        var html = '';
        cssRule.style.cssProperties.forEach(function (css) {
            html += `<li class="styles-panel-hovered"><input class="enabled-button" type="checkbox"><span class="styles-clipboard-only">    </span><span class="webkit-css-property">${css.name}</span>: <span class="expand-element"></span><span class="value">${css.value}</span>;</li>`
        })
        return html;
    }

    render(cssRule) {
        return `<div class="styles-section matched-styles monospace read-only">
    <div class="styles-section-title styles-selector">
    <div class="media-list media-matches"></div>
    <div class="styles-section-subtitle"></div>
    <div><span class="selector"><span class="simple-selector selector-matches">${this.renderSelectorList(cssRule)}</span></span><span> {</span>
    </div>
    </div>
    <ol class="style-properties monospace" tabindex="0">
    ${this.renderStyleProperties(cssRule)}


    </ol>
    <div class="sidebar-pane-closing-brace">}</div>
</div>`
    }
}
export default StyleRender;