;
/*
 *  
 *  @author Clark Van Oyen
 *
 */

var $ = (function(undefined){

  var $ = function(a, context) { return new DomDecorator(a, context) },

  /*
   * The core jQuery-like object, which is used for
   * rich decorated dom element lists with chaining.
   */
  DomDecorator = function(a, context) {
    var length = 0;
    if (isString(a)) {
      if (/[\n\s]*</.test(a)) { // Create html
        a = make(a);
      }
      else a = selector(a, context instanceof DomDecorator ? context[0] : context);
    }

    if (isDef(a)) {
      if (!isDef(a.length)) {
        a = [a];
      }
      length = a.length;
    }

    for (var i=0; i<length; i++) this[i] = a[i];
    this.length = length;
  },

  /*
   * Minimal selector engine for ID, class and tagName, based on from 140medley.
   * Drop in your own if you want :)
   */
  selector = function(
    a,                         // take a simple selector like "name", "#name", or ".name", and
    b                          // an optional context, and
  ){
    a = a.match(/^([#\.])?(.*)/); // split the selector into name and symbol.
    return(                    // return an element or list, from within the scope of
      b                        // the passed context
      || document              // or document,
    )[
      "getElement" + (         // obtained by the appropriate method calculated by
        a[1]
          ? a[1] == "#"
            ? "ById"           // the node by ID,
            : "sByClassName"   // the nodes by class name, or
          : "sByTagName"       // the nodes by tag name,
      )
    ](
      a[2]                     // called with the name.
    )
  },

  /*
   * Create a DocumentFragment - based on from 140medley.
   */
  make = function(
    a, // an HTML string
    b, // placeholder
    c  // placeholder
  ){
    b = document;                   // get the document,
    c = b.createElement("div");       // create a container element,
    c.innerHTML = a;                // write the HTML to it, and
    a = b.createDocumentFragment(); // create a fragment.

    while (                         // while
      b = c.firstChild              // the container element has a first child
    ) a.appendChild(b);             // append the child to the fragment,

    return a                        // and then return the fragment.
  },

  splice = Array.prototype.splice,


  isString = $.isString = function(obj) { return typeof obj == 'string' },
  isDef = $.isDef = function(obj) { return obj !== undefined && obj !== null };
  //var isArray = function(obj) { return toString.call(obj) == '[object Array]'; };

  $.fn = DomDecorator.prototype; // Plugin framework like jQuery has.

  /*
   * The ubiquitous extend function - copies an object's properties into another object.
   */
  $.extend = function(obj) {
    var i, p, s = splice.call(arguments, 1);
    for(i=0; i<s.length;i++) {
      for (p in s[i]) {
        obj[p] = s[i][p];
      }
    }
    return obj;
  };
  

  /*
   *  Define out jQuery-style API methods.
   */
  $.fn.each= function(fn) {
    var me=this, args, i;
    for(i=0; i<me.length; i++) {
      args = [me[i], i].concat(splice.call(arguments, 1));
      fn.apply(me, args);
    }
    return me;
  };

  return $;

})();

/*
 *  Helper for creating jQuery style getter/setters like $().css and $().attr.
 */
$.G = function(getter, setter){
  return function(a, b) {
    if (isDef(b)) {
      tmp = {};
      tmp[a] = b;
      a = tmp;
    }
    if ($.isString(a)) {
      return getter.call(this, this[0], a)
    }
    return this.each(function(el, i, key) {
      for (key in a) {
        setter.call(this, el, key, a[key]);
      }
    });
  };
};

$.extend( $.fn, {
  /*
   * style getter / setter. ie)
   * $('.x').css('color') // returns 'red' for example.
   * $('.x').css({'color':'blue'}) // sets the color to blue.
   */
  /*css: $.G(function(el, key){
      val = el.style[key];
      return (val.indexOf('px') > -1) ? parseInt(val.replace('px','')) : val;
    },
    function(el, key, val){
      el.style[key] = val + (typeof val === 'number' ? 'px' : '');
    }
  ),*/
  css: function(a, b){
    if ($.isDef(b)) {
      tmp = {};
      tmp[a] = b;
      a = tmp;
    }
    if ($.isString(a)) {
      //return getter.call(this, this[0], a)
      val = this[0].style[a];
      return (val.indexOf('px') > -1) ? parseInt(val.replace('px','')) : val;
    }
    return this.each(function(el, i, key) {
      for (key in a) {
        var val = a[key];
        el.style[key] = val + (typeof val === 'number' ? 'px' : '');
        //setter.call(this, el, key, a[key]);
      }
    });
  },

  /*
  attr: $.G(function(el, key){
      return el[key];
    },
    function(el, key, val){
      el[key] = val;
    }
  ),
  */

  attr: function(a, b){
    if ($.isDef(b)) {
      tmp = {};
      tmp[a] = b;
      a = tmp;
    }
    if ($.isString(a)) {
      //return getter.call(this, this[0], a)
      return this[0][a];
    }
    return this.each(function(el, i, key) {
      for (key in a) {
        el[key] = a[key]
        //setter.call(this, el, key, a[key]);
      }
    });
  },

  /*
   * bind a function to an event. ie)
   * $('.x').on('click', function(){ ... })
   *
   * @param ev - the event name, ie 'click'.
   * @param fn - the function to call.
   */
  on: function(ev, fn) {
    return this.each(function(el){  
       if(el.attachEvent)
          el.attachEvent("on" + ev, function() {fn.call(el);}); 
       else
          el.addEventListener(ev, fn, false);
    });
  },

  hide: function() {
    return this.css({display:'none'});
  },

  show: function() {
    return this.css({display: ''});
  },

  append: function(a) {
    a = $(a);
    return this.each(function(el){
      el.appendChild(a[0]);
    });
  },

  empty: function() {
    return this.html('');
  },

  html: function(html) {
    return this.attr('innerHTML',html)
  },

  find: function(a) {
    return $(a, this);
  }

});