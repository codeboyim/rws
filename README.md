[RealWork Sample](http://codeboyim.github.io/rws/)
===============

This sample project demonstrates a common input screen in the RealWork and how such a screen is developed recently using a more *modern* Web development approach.

Demo
----

Play it [**here**](http://codeboyim.github.io/rws/)


Features
----

Most of this sample is extracted from the source of the RealWork, but have been simplified, for example the system-wides person search component is not being included, or re-developed to emphasize more on the following technical features:

- Code separation and modular development
- Re-usable components
- Nested Backbone views, models and collections, property syncing
- Observation/Event pattern for communications between parts via Backbone.Event
- On-demand data loading
- Promise (via jQuery Deferred object) to streamline asynchronous callbacks

Extras
----

There are few things, which are not existing or applicable in the RealWork, have been implemented here for the integrity of the project or in my very own interest.

- [Bower], a package manager, to load the required tools and utilities
- [Grunt], the JavaScript task runner, and its powerful plug-ins to optimize and build the project
- [fontawesome], the replacement for the images used in the RealWork
- new visual components, i.e. modal, alert and loader
- Some CSS3 to improve the UI/UX


Tech
---

- [Backbone.js] - provides structures to build on
- [jQuery] - fast and the most popular cross-browser DOM traversal/manipulation solution
- [RequireJS] - loads modules and components when required


How to use
----
If you just want to have a feel about how it works, you can head to http://codeboyim.github.io/rws and open your development tool and play around in the browser.

Otherwise, you can clone this repo to your local folder and tweak. Make sure you have latest node.js, grunt and bower installed.

###Install
```shell
git clone git@github.com:codeboyim/rws.git
cd rws
npm install
bower install
```
You can then either run
```shell
grunt
```
to start a node server at port:9000,

or, you can use the built-in Web server in your favorite development IDE, e.g. Sublime Server for ST2/3

then navigate to http://127.0.0.1:9000/src/index.html

###Build
Run
```shell
grunt build
```
to create a production version in /build path


License
----

MIT

[Backbone.js]:http://backbonejs.org/
[RequireJS]:http://requirejs.org/
[jQuery]:http://jquery.com
[Bower]:http://bower.io/
[Grunt]:http://gruntjs.com/
[fontawesome]:http://fortawesome.github.io/Font-Awesome/
