/**
 *
 *  MessageReporter class, used to display the messages at certain place
 *   in the web page.
 *
 * @author xitu
 */

function MessageReporter(divId) {
    this.divId = divId;
    this.error = null;
    this.success = null;
}

MessageReporter.prototype = {
    render: function() {
        if(this.error) {
            $('#'+this.divId).html(this.error).css({"text-align":"center","color":"red","font-family":"arial","font-size":"small","font-style":"italic"});
        } else if(this.success){
            $('#'+this.divId).html(this.success).css({"text-align":"center","color":"green","font-family":"arial","font-size":"small","font-style":"bold"});
        }
        $('#'+this.divId).show();
    },
    hide: function() {
        $('#'+this.divId).hide();
    },
    clear: function() {
        this.error = null;
        this.success = null;
        $('#'+this.divId).hide();
    },
    errorStatus: function(errorMessage) {
        this.error = errorMessage;
        this.success = null;
    },
    successStatus: function(successMessage) {
        this.error = null;
        this.success = successMessage;
    }

}