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
    var leftColumnWidth = "75px";
    var breakHeight = "25px";

    content += '<div id="id-card-content-right">';

    content += '<div id="id-card-desciption-container">';

    content += '<div id="id-card-name-container">';
    content += '<label id="id-card-name-label" class="id-card-desciption-label" style="display:inline-block; width:' + leftColumnWidth + '">name:</label>';
    content += '<label id="id-card-name" class="id-card-desciption-label-text">Ryan Patrick McFadden</label>';
    content += '</div>';  // id-card-name-container

    content += '<div id="id-card-address-container" style="margin-top:' + breakHeight + '">';
    content += '<label id="id-card-addressline1-label" class="id-card-desciption-label" style="display:inline-block; width:' + leftColumnWidth + '">address:</label>';
    content += '<label id="id-card-addressline1" class="id-card-desciption-label-text">1101 De La Vina St.</label>';
    content += '<div/>';
    content += '<label id="id-card-addressline2-label" class="id-card-desciption-label" style="display:inline-block; width:' + leftColumnWidth + '"></label>';
    content += '<label id="id-card-addressline2" class="id-card-desciption-label-text">Santa Barbara, CA., 93101</label>';
    content += '<div/>';
    content += '<label id="id-card-country-label" class="id-card-desciption-label" style="display:inline-block; width:' + leftColumnWidth + '"></label>';
    content += '<label id="id-card-country" class="id-card-desciption-label-text">United States of America</label>';
    content += '</div>';  // id-card-name-address

    content += '<div id="id-card-address-container" style="margin-top:' + breakHeight + '">';
    content += '<label id="id-card-sex-label" class="id-card-desciption-label" style="display:inline-block; width:' + leftColumnWidth + '">sex:</label>';
    content += '<label id="id-card-sex" class="id-card-desciption-label-text" style="display:inline-block; width:' + leftColumnWidth + '">Male</label>';
    content += '<label id="id-card-height-label" class="id-card-desciption-label" style="display:inline-block; width:' + leftColumnWidth + '">Height:</label>';
    content += '<label id="id-card-height" class="id-card-desciption-label-text" style="display:inline-block; width:' + leftColumnWidth + '">6 ft.</label>';
    content += '<div/>';

    content += '<label id="id-card-sex-label" class="id-card-desciption-label" style="display:inline-block; width:' + leftColumnWidth + '">weight:</label>';
    content += '<label id="id-card-sex" class="id-card-desciption-label-text" style="display:inline-block; width:' + leftColumnWidth + '">weight</label>';
    content += '<label id="id-card-eye-label" class="id-card-desciption-label" style="display:inline-block; width:' + leftColumnWidth + '">eyes:</label>';
    content += '<label id="id-card-eye" class="id-card-desciption-label-text" style="display:inline-block; width:' + leftColumnWidth + '">blue</label>';



    content += '<div/>'; // id-card-name-physical



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