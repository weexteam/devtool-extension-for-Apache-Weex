# weex-devtool-extension
A extension for Weex devtool to improve your debug experience，which equivalent an element tag for debugger page.
#download 
[react-devtools-chrome-0.0.2.zip](https://github.com/weexteam/weex-devtool-extension/releases/download/0.0.2/react-devtools-chrome.zip)

#useage
* ~~下载crx文件~~
* ~~打开chrome浏览器的菜单，选择【更多工具】->【扩展程序】进入扩展程序界面~~
* ~~把crx文件拖到扩展程序页面里，点击安装~~（此方法已失效，新版本chrome会自动禁用第三方安装的extension）
* 下载zip文件，并解压到任意目录。
* 打开chrome浏览器的菜单，选择【更多工具】->【扩展程序】进入扩展程序界面，并勾选开发模式
* 选择【加载已解压的扩展程序】选择你刚才解压出来的那个目录【weex-devtool-extension】完成安装
* 确保你的weex devtool的版本在0.2.46以上（通过weex debug -v查看）如果版本过低请使用npm install -g weex-toolkit升级。
* 打开weex debug，连接设备调试，建议ElementMode选择vdom。
* 打开debugger页面。打开devtool调试器，点击weex tab


# changelo
##### 0.0.3
* 修复ios下的bug (ios的dom结构与andorid不一致)g
#####0.0.2
* 重新整理了下代码
* 加入构建机制，crx的方式不行了 只能通过zip包发布了
* 增加elements窗口和styles窗口的拖动功能

#####0.0.1
first publish
