[RealWork Sample](http://codeboyim.github.io/rws/)
===============

This sample project demonstrates a common input screen in the RealWork and how such a screen is developed recently using a more *modern* Web development approach.

Demo
----

Live demo: http://codeboyim.github.io/rws/


Features
----

The code in this sample is extracted from the RealWork project. It has been simplified and re-developed to emphasize on the following technical features:

- Code separation and modular development
- Re-usable components
- Nested Backbone views, models and collections
- Model/collection editing status track
- Observation/Event pattern for communications between parts via Backbone.Event
- On-demand data loading
- Chaining asynchronous activities using Promise (jQuery Deferred object)
- A simple CSS grid framework and modular architecture

Extras
----
Few more things have been implemented in this sample for the integrity and my own interest.


- Additional UI components, i.e. modal, alert and loader
- [Bower]
- [Grunt]
- [Font Awesome](http://fortawesome.github.io/Font-Awesome/)
- Some CSS3 for UI/UX


Tech
---

- [Backbone.js] - skeleton to build the app on
- [jQuery] - fast and the most popular cross-browser DOM traversal/manipulation solution
- [RequireJS] - module loader and code optimizer

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

