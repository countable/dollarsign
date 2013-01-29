dollarsign
==========

How much of jQuery can we implement in 1K?

At over 30K minified and gzipped, jQuery has become too large for some projects. What are we to do in these cases?

1. We can use pure javascript, but after being spoiled by jQuery, the native DOM API and browser inconsistency is SO painful to use.

2. Luckily there are other projects, Zepto and Ender (the jeesh) which come to the rescue, at 5-10K gzipped. Zepto doesn't work with IE, so that's more or less out. And Ender... well, the build system made me think too hard when trying to effortlessly drop it into projects. That, and neither of these projects are truly as lightweight as I want. They provide more of the jQuery API than I really care about.

3. Implement our own DOM utility that does that parts that I use most, and not include the parts others use. Not to go in circles, but this begs the question, is there a subset of these DOM utilities that does 90% of the stuff most people care about, which is an order of magnitude smaller than even the minimal jQuery libraries in step 2?

To further specify what I want, the library doesn't need to pamper me by providing BOTH of $(thing).append(other) and $(other).appendTo(thing). And it doesn't need to help me for cases the native dom works fine. There are lots of grey areas where we can ask "do I really need to include feature X"? My approach is to say NO except when feature X is something I really can't live without. Here are is my no-compromise minimal feature list for a dom library:

 - Works in all browsers jQuery works in.
 - Presents a jQuery style API with *rich DOM element collections* (call them *RDEC*) that have chainable convenience methods.
 - $(selector) returns a RDEC for *at least* ID, class, and tagName selectors.
 - $(DOM element), and $(HTML string) produce RDEC, as with jQuery.
 - RDEC allows extension via $.fn to easily produce jQuery style API extensions (plugins).
 - implement $.extend, $().each, and a few other basic helpers to aid in implementing the rest of the API as plugins.

This list is sparse, but because of the ability to easily add other features we need on a per-project basis via $.fn = function(){...} why not implement any other bits of the jQuery library we need using this minimal plugin framework? I've done this with $().css , $().hide , $().append , and others.

To run the tests, open tests/teststrap.html in your browser. Please add more tests!
