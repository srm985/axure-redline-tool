# Axure Interactive Redline Tool
This plugin intends to mimic some of the functionality of the plugin Measure for Sketch or InVision Inspect. Within my organization, we overly rely on the use of Axure - which doesn't offer many easy options to provide redlines for developers. As Axure does not support plugins within the application itself, this code resides within and is applied to your AxShare projects. 

[Super Basic Demo](http://71gjur.AxShare.com/#g=1&p=test)

## Plugin Usage

To use this plugin, you'll need to copy and paste the code found within [**/axure-redline-tool/web/plugin.txt**](https://github.com/srm985/axure-redline-tool/blob/master/web/plugin.txt) into your AxShare project as a plugin. The code combination is derived from the markup framework, CDN links, the pertinent CSS, and the supporting JavaScript / jQuery code base.

To apply this code to one of your AxShare hosted projects, navigate to [www.share.axure.com](https://share.axure.com) and log into your account. Once logged in, you will see an inline gear icon to the far right of each Axure project. Hovering over this icon provides a list of options, including *PLUGINS* which you should select. Once on the plugin page, select *NEW PLUGIN*. Name your plugin whatever you deem appropriate and select *End of the Head* as the insertion location. Paste your plugin.min.htm code into the content area and save the plugin. Select all desired pages within which you'd like to have the interactive redline tool. If you would like to have the plugin appended to any new pages, you may select *Add to new pages by default*. Once saved, your plugin should  be activated. To modify the plugin, simply select *edit* and paste in any replacement code.

[Axure Plugin Tutorial](https://www.axure.com/c/forum/AxShare-general-discussion/9953-create-edit-plugin-AxShare-tutorial.html)

![plugin demo](http://www.seanmcquay.com/axure-redline-tool/axure-redline-tool.gif)

## Installation / Running

Install [Node.js](https://nodejs.org/en/download/)

Update npm to the latest version.

```sh
$ npm install npm@latest -g
```

Install [http-server](https://www.npmjs.com/package/http-server) or your own prefered server.

```sh
$ npm install http-server -g
$ cd /axure-redline-tool/src/
$ http-server
```

_Feel free to disregard these instructions if you have your own preferred server package or are running it live._

#### Prerequisites / Dependencies

This project was built and tested on jQuery 3.2 and Axure RP.

## Building Modified Plugin

If you've made changes and would like to build a new version of the plugin, run the following commands and plugin.txt will be updated.

```sh
$ cd /axure-redline-tool/
$ npm install
$ grunt
```

## Bugs / Drawbacks

As this code is embeded within Axure projects, it does not have direct control of how assets are exported from within Axure. The code makes every attempt to handle the various nested elements exported from Axure, but if you do encounter an issue, please let me know and I'll promptly resolve it.

## Coming Features

* Project Zoom Controls (High Priority)
* CDN Link (Low Priority)

## Versioning

We use [SemVer](http://semver.org/) for versioning. 

## Authors

* **Sean McQuay** - *Initial work* - [GitHub](https://github.com/srm985) - [Website](http://www.seanmcquay.com)

See also the list of [contributors](https://github.com/srm985/mok-project/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/srm985/axure-redline-tool/blob/master/LICENSE) file for details.