Language : English | [中文](./README.zh-CN.md)

<h1 align="center">Hypercrx</h1>

<div align="center">

[![CLA assistant](https://cla-assistant.io/readme/badge/hypertrons/hypertrons-crx)](https://cla-assistant.io/hypertrons/hypertrons-crx)
[![Slack](https://img.shields.io/badge/slack-join_chat-success.svg?logo=slack)](https://join.slack.com/t/hypertrons/shared_invite/zt-1a7tfc1tx-5YP8m59Yg~vSqiMBMeUJnQ)

</div>

`Hypercrx` (pronounced: 'Hai-puh CRX') project aims at tracing, digging and gaining insight into the projects and developers you're interested in. We do this by inserting useful dashboards into `GitHub` pages. `Hypercrx` provides an effective way for digital operations and analysis of open source community.

## Dashboards 🔥🔥🔥

You can find these dashboards in:

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


### Project Releated

 <table> 
   <thead> 
     <tr> 
       <th width="33%">Project Correlation Network</th> 
       <th width="33%">Developer Collabration Network within Project</th> 
       <th width="34%">Project Activity & Influence Trend</th> 
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
           src="https://user-images.githubusercontent.com/90528630/171819879-d76a3f01-444a-4544-8d46-de539c5684c3.gif"
         /> 
       </td> 
       <td>
         <img 
           src="https://user-images.githubusercontent.com/90528630/171828864-2aeb8a30-bce8-4544-839d-834fc2720a46.gif"
         /> </td>
     </tr> 
   </tbody> 
 </table> 


- **Project Correlation Network**: Project Correlation Network shows the correlation between projects for a given time period. From this graph you can find the projects that are related to the given project.

- **Developer Collabration Network within project**: Developer Collabration Network within project shows the collaboration between active developers within the project for a given time period. From this graph you can find the active developers in the given project. What's more, you can find the collaborative relationships between these developers.

- **Project Activity & Influence Trend**: The Project Activity and Influence Trend chart presents how the two metrics evolve since 2015. In the chart, you can zoom and drag using your mouse or touchpad, and you can toggle either of the data by clicking the legend buttons as well.


### Developer Releated

<table> 
   <thead> 
     <tr> 
       <th width="33%">Developer Collabration Network</th> 
       <th width="33%">Developer's Most Participated Repos</th> 
       <th width="34%">Developer's Activity & Influence Trend</th> 
     </tr> 
   </thead> 
   <tbody> 
     <tr> 
       <td> 
         <img 
           src="https://user-images.githubusercontent.com/90528630/171820059-96c6da74-3d29-4e79-a08d-a07861682646.gif"
         /> 
       </td> 
       <td> 
         <img 
           src="https://hypertrons.oss-cn-shanghai.aliyuncs.com/images/readme-dmpr.gif"
         /> 
       </td> 
       <td>
         <img 
           src="https://user-images.githubusercontent.com/90528630/171830059-acabce8a-86e2-42c4-812b-51685e7c0d30.gif"
         /> </td>
     </tr> 
   </tbody> 
 </table> 



- **Developer Collabration Network**: Developer Collaboration Network shows the collaboration between developers for a given time period. From this graph you can find other developers who are closet to a given developer.
- **Developer's Most Participated Repos**: Developer's Most Participated Repos shows the active projects of developers in a given time period. From this graph you can find out the most active repositories for a given developer.
- **Developer's Activity & Influence Trend**：The Developer Activity and Influence Trend chart presents how the two metrics evolve since 2015. In the chart, you can zoom and drag using your mouse or touchpad, and you can toggle either of the data by clicking the legend buttons as well.

## Install

[link-chrome]: https://chrome.google.com/webstore/detail/hypercrx/ijchfbpdgeljmhnhokmekkecpbdkgabc "Version published on Chrome Web Store"
[link-edge]: https://microsoftedge.microsoft.com/addons/detail/hypercrx/lbbajaehiibofpconjgdjonmkidpcome "Version published on Microsoft Edge Add-ons"

[<img src="https://raw.githubusercontent.com/alrra/browser-logos/90fdf03c/src/chrome/chrome.svg" width="48" alt="Chrome" valign="middle">][link-chrome] [<img valign="middle" src="https://img.shields.io/chrome-web-store/v/ijchfbpdgeljmhnhokmekkecpbdkgabc.svg?label=%20">][link-chrome] also compatible with [<img src="https://raw.githubusercontent.com/alrra/browser-logos/90fdf03c/src/edge/edge.svg" width="24" alt="Edge" valign="middle">][link-edge]<img src="https://raw.githubusercontent.com/alrra/browser-logos/90fdf03c/src/opera/opera.svg" width="24" alt="Opera" valign="middle">

For more information please refer to [Installation Guide](./INSTALLATION.md).

## Contributing

Please read [CONTRIBUTING](./CONTRIBUTING.md) if you are new here or not familiar with the basic rules of Git/GitHub world.
### Requirements

1. node >= 16.14

2. yarn

### Quickstart

1. git clone https://github.com/hypertrons/hypertrons-crx

2. cd hypertrons-crx

3. yarn install

4. yarn run start

5. Load the freshly built unpacked extension on Chrome following:

   1. Access chrome://extensions/

   2. Check "Developer mode"

   3. Click on "Load unpacked extension"

   4. Select the "build" folder under the project root directory

   5. Keep "service worker" DevTools page open ([why?](https://github.com/hypertrons/hypertrons-crx/pull/274#discussion_r811878203))

      ![](./assets/keep-service-worker-devtools-open.jpeg)

6. Happy hacking!

### HMR & auto-reload

If you are developing Options page or Popup page, each time you save files the pages will hot replace the modules without refreshing, which means you can see the changes right away.

However, if you are developing Background or ContentScripts, each time you save files the service worker will reload the extension automatically. And if you are developing ContentScripts, then pages that injected with ContentScripts will refresh themselves to run the newest scripts.

### Q&A

Any type of contribution is welcome, you can submit [Issue](https://github.com/hypertrons/hypertrons-crx/issues) to report bugs or ask question.

For more information please refer to [Contributing Guide](./CONTRIBUTING.md).

Message us on <a href="https://join.slack.com/t/hypertrons/shared_invite/zt-1a7tfc1tx-5YP8m59Yg~vSqiMBMeUJnQ" target="_blank">Slack</a>.
