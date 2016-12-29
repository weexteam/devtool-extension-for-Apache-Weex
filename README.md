# weex-devtool-extension
A extension for Weex devtool to improve your debug experience，which equivalent an element tag for debugger page.
#download 
[weex-devtools-chrome-0.0.6.zip](https://github.com/weexteam/weex-devtool-extension/releases/download/0.0.6/weex-devtools-chrome.zip)

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

###深度检查工具
 weex tab的下方有一个Node Deep Validator 用于检查当前Node tree的一些过深的节点和需要优化的情况（目前是div嵌套）  
 点击validate按钮会对当前的Node tree进行深度检查，超过警戒值的节点的整个路径上的节点都会标记高亮（警戒值可以通过下面那个输入框设置 默认是10层）  
 另外 DIV嵌套的情况(即一个div套了一个div且这个div是其唯一子节点)也是会标记为高亮(即使深度没有超过警戒值)  
 P.S. Node tree里的deep属性是最大深度level的意思 本身是我了我自己调试用，所以不要依赖这个属性(标记div嵌套的时候我做了处理 那个值不是真实值)  
 
# changelog
##### 0.0.6 
  *避免误解重新展示 deep 和max deep 并优化div嵌套处理对deep的干扰 
  
##### 0.0.5  
* 增加node深度检查功能，深度过深的节点会标为高亮（整个路径节点全部高亮），可以设置阈值 默认10层深度
* 单纯div嵌套也会标记为高亮（即一个div套了一个div且这个div是其唯一子节点）  
#####0.0.4
* ios所有问题已解决  

#####0.0.3
* 修复ios下的bug (ios的dom结构与andorid不一致)  

#####0.0.2
* 重新整理了下代码
* 加入构建机制，crx的方式不行了 只能通过zip包发布了
* 增加elements窗口和styles窗口的拖动功能

#####0.0.1
first publish
