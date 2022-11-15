Language : [English](./README.md) | 中文

<h1 align="center">Hypercrx</h1>

<div align="center">

开源项目与开发者关系的追踪、挖掘与洞察

[![CLA assistant](https://cla-assistant.io/readme/badge/hypertrons/hypertrons-crx)](https://cla-assistant.io/hypertrons/hypertrons-crx)
[![Slack](https://img.shields.io/badge/slack-join_chat-success.svg?logo=slack)](https://join.slack.com/t/hypertrons/shared_invite/zt-1a7tfc1tx-5YP8m59Yg~vSqiMBMeUJnQ)

</div>

`Hypercrx` (发音: 'Hai-puh CRX') 浏览器插件项目旨在通过直接往 GitHub 页面中插入各类可视化看板的形式，帮助用户快速追踪、挖掘和洞察项目与开发者的各类行为数据，为社区的数字化运营和分析提供有效支撑。

## 安装与使用 📢

<img src="https://raw.githubusercontent.com/alrra/browser-logos/90fdf03c/src/chrome/chrome.svg" width="48" alt="Chrome" valign="middle"> [前往Chrome商店安装插件](https://chrome.google.com/webstore/detail/hypercrx/ijchfbpdgeljmhnhokmekkecpbdkgabc)

<img src="https://raw.githubusercontent.com/alrra/browser-logos/90fdf03c/src/edge/edge.svg" width="48" alt="Edge" valign="middle"> [前往Edge商店安装插件](https://microsoftedge.microsoft.com/addons/detail/hypercrx/lbbajaehiibofpconjgdjonmkidpcome)

获取更多信息，请查阅[安装指南](./INSTALLATION.zh-CN.md)。

## 数据来源

`Hypercrx`呈现的所有数据都由[OpenDigger](https://github.com/X-lab2017/open-digger)产生。OpenDigger是一个聚焦于开源分析的开源项目。

## 可视化看板 🔥🔥🔥

您可以在以下入口处找到这些看板：

<table>
  <thead>
    <tr>
      <th width="50%">Entrance 1: GitHub User's Profile Page</th>
      <th width="50%">Entrance 2: GitHub Repository Page</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <img
          src="https://user-images.githubusercontent.com/32434520/180445548-63d5e0ce-635f-4e7b-bed7-e4bcbf2dc8c4.png"
        />
      </td>
      <td>
        <img
          src="https://user-images.githubusercontent.com/32434520/180447103-76ff1e25-ec35-4e7f-bd54-9d98545ca1df.png"
        />
        <img
          src="https://user-images.githubusercontent.com/32434520/180446790-50b6a53b-119e-4b74-a08d-dda146fb9f29.png"
        />
      </td>
    </tr>
  </tbody>
</table>

### 项目关系挖掘

 <table> 
   <thead> 
     <tr> 
       <th width="33%">项目关系网络图</th> 
       <th width="33%">项目活跃开发者协作网络图</th> 
       <th width="34%">项目活跃度&影响力趋势图</th> 
     </tr> 
   </thead> 
   <tbody> 
     <tr> 
       <td> 
         <img 
           src="https://hypertrons.oss-cn-shanghai.aliyuncs.com/images/readme-prn.gif"
         /> 
       </td> 
       <td> 
         <img 
           src="https://hypertrons.oss-cn-shanghai.aliyuncs.com/images/readme-dcnp.gif"
         /> 
       </td> 
       <td>
         <img 
           src="https://hypertrons.oss-cn-shanghai.aliyuncs.com/images/readme_activity%26influence.gif"
         /> </td>
     </tr> 
     <tr> 
       <th colspan="3">仓库详情 (鼠标悬浮触发)</th> 
     </tr> 
     <tr> 
       <td colspan="3"> 
         <img 
           src="https://user-images.githubusercontent.com/32434520/199235703-a5609b58-35f0-4c26-ad94-8ddc98915147.png"
         /> 
       </td> 
     </tr> 
   </tbody> 
 </table> 


- **项目关系网络图**: 项目关系网络图展示了在给定的时间段内，项目与项目之间的联结关系，**_用于项目间关系的追踪与挖掘_**。从该网络图中，可以找出与该项目有联结关系的其他项目。

- **项目活跃开发者协作网络图**: 项目活跃开发者协作网络图展示了在给定的时间段内，项目内部活跃的开发者之间的协作关系，**_用于项目内部开发者关系的追踪与挖掘_**。从该网络图中，可以找出该项目中最活跃的开发者，及开发者之间的协作关系。

- **项目活跃度&影响力趋势图**：项目活跃度和影响力趋势图显示了项目成立至今的活跃度和影响力这两个指标的变化。您可以利用鼠标或触控板在图表内缩放和拖拽，此外，您还可以点击Legend按钮来控制图例的显示和隐藏。

- **仓库详情**: 显示了以下统计指标的历史值。活跃度、影响力、参与人数、Fork事件、Star事件、Issue创建事件、Issue评论事件、PR创建事件、PR合入事件、Review评论事件、通过PR合入增加和删除的代码行数。

### 开发者关系挖掘

 <table> 
   <thead> 
     <tr> 
       <th width="33%">开发者协作网络图</th> 
       <th width="33%">开发者活跃仓库网络图</th> 
       <th width="34%">开发者活跃度&影响力趋势图</th> 
     </tr> 
   </thead> 
   <tbody> 
     <tr> 
       <td> 
         <img 
           src="https://hypertrons.oss-cn-shanghai.aliyuncs.com/images/readme-dcn.gif"
         /> 
       </td> 
       <td> 
         <img 
           src="https://hypertrons.oss-cn-shanghai.aliyuncs.com/images/readme-dmpr.gif"
         /> 
       </td> 
       <td>
         <img 
           src="https://hypertrons.oss-cn-shanghai.aliyuncs.com/images/readme_activity%26influence.gif"
         /> </td>
     </tr> 
   </tbody> 
 </table> 



- **开发者协作网络图**: 开发者协作网络图展示了在给定的时间段内，开发者与开发者之间的协作关系, ***用于开发者关系的追踪与挖掘***。从该网络图中，可以找出与指定开发者联系较为紧密的其他开发者。
- **活跃仓库网络图**: 活跃仓库网络图展示了在给定的时间段内，开发者的活跃项目，***用于开发者行为的追踪与挖掘***。从该网络图中，可以找出该开发者在哪些项目中活跃。
- **开发者活跃度&影响力趋势图**：开发者活跃度和影响力趋势图显示了项目成立至今的活跃度和影响力这两个指标的变化。您可以利用鼠标或触控板在图表内缩放和拖拽，此外，您还可以点击Legend按钮来控制图例的显示和隐藏。

## 参与贡献

如果你初来乍到或对 Git/GitHub 的基本操作不熟悉，请阅读[CONTRIBUTING](./CONTRIBUTING.md)。

### 环境需求

1. node >= 16.14

2. yarn
### 快速开始

1. git clone https://github.com/hypertrons/hypertrons-crx

2. cd hypertrons-crx

3. yarn install

4. yarn run start

5. 在 chrome 中加载新鲜出炉的插件:

   1. 在浏览器地址栏访问 chrome://extensions/

   2. 勾选“开发者模式”

   3. 点击“加载已解压的扩展程序”

   4. 选择项目根目录下的“build”目录

   5. 保持“Service Worker”的 DevTools 页面为打开状态 ([why?](https://github.com/hypertrons/hypertrons-crx/pull/274#discussion_r811878203))

      ![](./assets/keep-service-worker-devtools-open.jpeg)

6. Happy hacking!

### HMR & auto-reload

如果你开发的是 Options 页面或 Popup 页面，每次保存文件都可以让页面进行热模块替换而不需要刷新页面，这意味着你能立马看到改动后的效果。

但是，如果你开发的是 Background 或 ContentScripts，每次保存文件后，service worker 会自动重新加载插件。除此之外，若你开发的是 ContentScripts，那么那些被注入 ContentScripts 的页面还会自动刷新从而运行最新的 ContentScripts。

### 问题交流

我们非常欢迎您的贡献，您可以通过 [Issue](https://github.com/hypertrons/hypertrons-crx/issues) 提出问题或交流。

更多信息请参考 [贡献指南](./CONTRIBUTING.md)。

在 <a href="https://join.slack.com/t/hypertrons/shared_invite/zt-1a7tfc1tx-5YP8m59Yg~vSqiMBMeUJnQ" target="_blank">Slack</a> 上联系我们。
