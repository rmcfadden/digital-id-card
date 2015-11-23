"use strict";
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
      var defaults = {};

      var settings = $.extend({}, defaults, options); 			

      var contentText = _createContent();	

      $(this).html(contentText);

      return this;
    },
    show : function( ) {},
    hide : function( ) {},
    onUpdate : function() {}
  }

  function _toJson(){

  }

  function _createContent(){
    var content = '<div id="id-card-container">';

    // Header
    content += '<div id="id-card-header">';
    content += '</div>';	// id-card-header

    // Content
    content += '<div id="id-card-content">';

    content += '<div id="id-card-content-left">';


    // Image Container
    content += '<div id="id-card-image-container">';

    content += '</div>';	// id-card-image-container

    content += '</div>';  // id-card-content-left


    // Description
    content += '<div id="id-card-content-right">';

    content += '<div id="id-card-desciption-container">';

    content += '<div id="id-card-name-container">';
    content += '<label id="id-card-name" class="id-card-desciption-label">John Do</label>';
    content += '<label id="id-card-name" class="id-card-desciption-label-text">John Do</label>';
    content += '</div>';  // id-card-name-container


    content += '</div>';	// id-card-description-container
    content += '</div>';  // id-card-content-right


    content += '</div>';	// id-card-content

    // Footer
    content += '<div id="id-card-footer">';
    content += '</div>';	// id-card-footer

    content += '</div>';	// id-card-container

    return content;
  }

  // Editable lable: example: http://jsfiddle.net/jasuC/

})(jQuery);