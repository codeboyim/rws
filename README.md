[RealWork Sample](http://codeboyim.github.io/rws/)
===============
Information collection (input screen) is a commonly used UI in RealWork. It could get so complex that its own is a de facto single page application in some cases. This project  demos how such UIs have been re-engineered in a more modularized approach in recent projects.

This project contains only front-end code demonstration but uses a mocking backend store for retrieving reference data and saving.

Demo
----

Live demo: http://codeboyim.github.io/rws/


Features
----

The code in this sample is extracted from the RealWork project. It has been simplified to emphasize on the following technical features:

- Code separation and modularized development
- Re-usable components, e.g. Notes
- Nested Backbone views, models and collections
- Model/collection editing status track
- Observer/Event pattern for module interactions via Backbone.Event
- On-demand data loading
- Chaining asynchronous activities using Promise (jQuery Deferred object)
- A simple CSS grid framework and modular architecture


Tools and Utilities
---

- [Backbone.js]
- [Underscore.js](http://underscorejs.org/)
- [jQuery]
- [RequireJS]



Get started
---
Prerequisite: Node, npm, bower, Grunt cli

Clone the repo and install required packages:
```bash
git clone git@github.com:codeboyim/rws.git
cd rws
npm install
bower install
```
Run the default Grunt task to start a node server at port:9000:
```bash
grunt
```
then open http://127.0.0.1:9000/src/index.html in the browser

Build
---
A Grunt task, using r.js optimizer, has been set up to create a production ready version of the project in ```/build``` folder:
```bash
grunt build
```



License
----

MIT

[Backbone.js]:http://backbonejs.org/
[RequireJS]:http://requirejs.org/
[jQuery]:http://jquery.com
[Bower]:http://bower.io/
[Grunt]:http://gruntjs.com/

