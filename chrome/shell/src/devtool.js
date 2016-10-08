/**
 * Created by godsong on 16/10/7.
 */
var panelsCreated = false;
chrome.devtools.network.onNavigated.addListener(function () {
    createPanel();
});
function createPanel() {
    if (!panelsCreated) {
        chrome.devtools.panels.create('Weex', '/icons/16.png', 'panel.html', function (panel) {
            panelsCreated = true;
            console.log(panel);

        })
    }
}
createPanel();