(function($){
  $.fn.digitalIdCard = function(methodOrOptions){
  	if ( methods[methodOrOptions] ) {
			return methods[ methodOrOptions ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof methodOrOptions === 'object' || ! methodOrOptions ) {
			// Default to "init"
			return methods.init.apply( this, arguments );
		} else {
			$.error( "Method " +  methodOrOptions + " does not exist on jQuery.digitalIdCard" );
  	}

  }

  var methods = {
  	init : function(options) {

      var defaults = {
        height : "640px",
        width : "360px"
      };

      var settings = $.extend({}, defaults, options); 			

     	var Content = _createContent();	

      $(this).html(Content);

    	return this;
		},

		show : function( ) {},
		hide : function( ) {},
		onUpdate : function() {}
	}

	function _toJson()
	{

	}

	function _createContent()
	{
      var Content = '<div id="id-card-container">'

      // Header
      Content += '<div id="id-card-header">'

     	Content += '</div>';	// id-card-header

      // Content
      Content += '<div id="id-card-content">'

      // Image
      Content += '<div id="id-card-image">'

     	Content += '</div>';	// id-card-image

      // Description
      Content += '<div id="id-card-desciption">'

     	Content += '</div>';	// id-card-description


     	Content += '</div>';	// id-card-content

      // Footer
      Content += '<div id="id-card-footer">'

     	Content += '</div>';	// id-card-footer

     	Content += '</div>';	// id-card-container

  		var Content = $(Content);


  		return Content;
	}



})(jQuery);