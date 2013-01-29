
var TESTSTRAP = (function($){


return {
    
    index: 0,
    
    passes: 0,

    start_index: 0,
    
    group: 0,

    run: function(group, runner) {
        
        runner = runner || group;

        this.group++;
        if (typeof group !== "string") group = "Group "+this.group;
            
        this.$ = $("<div class='content'><h1 class='span12'>"+group+"</h1></div>")
            .appendTo('body')
        
        //try {
            runner.apply(this);
        //} catch (e) {
        //    this.index ++;
        //    throw (e);
        //} finally {
        //    return this.done();
        //}
        return this.done();
        
    },

    done: function(){
        var num = (this.index-this.start_index)
        var status = this.passes === num ? 'alert-success' : 'alert-error';
        this.message('<span class="badge">'
            +this.passes
            +"/"+num
            +"</span> tests passed.").addClass(status);
        this.start_index = this.index;
        this.passes = 0
        return this;
    },
    
    test_message: function(message) {
        this.index++;
        return this.message('<span class="badge">' + this.index+'</span> - '+message);
    },
    
    message: function(message) {
        return $('<p class="span12 alert">' + message + '</p>').appendTo(this.$);
    },
    
    fail: function(msg) {
        this.test_message('failed - '+(msg || 'unspecified')).addClass('alert-error');
    },
    
    pass: function(msg) {
        this.passes ++;
        this.test_message('passed - '+(msg || '')).addClass('alert-success');
    },
    
    assert: function(val, message) {
        val ? this.pass(message) : this.fail(message);
    },
    
    assertEqual: function(val, expected, message) {
        this.assert(val === expected, (message ? message+',':'') + ' expected: '+expected+' got: '+val);
    },

    assertEval: function(expr) {
        this.assert(eval(expr), expr);
    },

    assertEvalEqual: function(val, expr) {
        this.assertEqual(eval(expr), val, expr)
    }

};

})(jQuery);