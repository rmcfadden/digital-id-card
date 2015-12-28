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

    _makeLabelEditable('id-card-name');
    _makeLabelEditable('id-card-addressline1');
    _makeLabelEditable('id-card-addressline2');
    _makeLabelEditable('id-card-country');
    _makeLabelEditable('id-card-sex');
    _makeLabelEditable('id-card-height');
    _makeLabelEditable('id-card-weight');
    _makeLabelEditable('id-card-eyes');

      return this;
    },
    show : function( ) {},
    hide : function( ) {},
    onUpdate : function() {},
    text : function() { return _toText(); }
  }

  function _toJson(){
    var obj = {};

    var name = _getName();
    if(name){
      obj.name = name;
    }

    var addressLine1 = _getAddressLine1();
    if(addressLine1){
      obj.addressLine1 = addressLine1;
    }

    var addressLine2 = _getAddressLine2();
    if(addressLine2){
      obj.addressLine2 = addressLine2;
    }

    return obj;
  }

  function _toText(){
    var json = _toJson();
    return JSON.stringify(json);
  }


  function _getName(){
    return $('#id-card-name').text();
  }

  function _getAddressLine1(){
    return $('#id-card-addressline1').text();
  }

  function _getAddressLine2(){
    return $('#id-card-addressline2').text();
  }


  function _getcountry(){
    return $('#id-card-country').text();
  }


  function _makeLabelEditable(id){

    var idObj = $('#' + id);
    var idObjEdit = $('#' + id +'-edit');

    idObj.click(function() {
        idObj.css('display', 'none');
        idObjEdit.val(idObj.text())
        idObjEdit.css('display', '')
        idObjEdit.focus();
    });

    idObjEdit.blur(function() {
        idObjEdit.css('display', 'none');
        idObj.text(idObjEdit.val());
        idObj.css('display', 'inline-block');
    });

    idObjEdit.keyup(function(event){
        if(event.keyCode == 13){
            idObjEdit.css('display', 'none');
            idObj.text(idObjEdit.val());
            idObj.css('display', 'inline-block');
        }
    });

  }


  function _getLabelText(name, text, width){
    return '<label id="id-card-' + name + '-label" class="id-card-desciption-label" style="display:inline-block; width:' + width + '">' + text + '</label>';
  }


  function _getFieldTextBoxEdit(name, text, width){

    var widthText = ''
    if(width){
        widthText = width;
    }

    var returnText = '<label id="id-card-' + name + '" class="id-card-desciption-label-text" style="display:inline-block; width:' + widthText + '">' + text + '</label>'
    returnText += '<input id="id-card-' + name + '-edit" name="id-card-' + name + '" style="display:none; width:' + widthText + '"></input>';
    return returnText;
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
    content += _getLabelText('name', 'name:', leftColumnWidth);
    content += _getFieldTextBoxEdit('name', 'Ryan Patrick McFadden');
    content += '</div>';  // id-card-name-container

    content += '<div id="id-card-address-container" style="margin-top:' + breakHeight + '">';
    content += _getLabelText('addressline1', 'address:', leftColumnWidth);
    content += _getFieldTextBoxEdit('addressline1', '1101 De La Vina St.');
    content += '<div></div>';
    content += _getLabelText('addressline2', '', leftColumnWidth);
    content += _getFieldTextBoxEdit('addressline2', 'Santa Barbara, CA. 93101');
    content += '<div></div>';
    content += _getLabelText('country', '', leftColumnWidth);
    content += _getFieldTextBoxEdit('country', 'United States Of America');
    content += '<div></div>';  // id-card-name-address

    content += '<div id="id-card-address-container" style="margin-top:' + breakHeight + '">';
    content += _getLabelText('sex', 'sex:', leftColumnWidth);
    content += _getFieldTextBoxEdit('sex', 'Male', leftColumnWidth);
    content += _getLabelText('height', 'height:', leftColumnWidth);
    content += _getFieldTextBoxEdit('height', '6 ft.', leftColumnWidth);
    content += '<div/>';
    content += _getLabelText('weight', 'weight:', leftColumnWidth);
    content += _getFieldTextBoxEdit('weight', '185 lb.', leftColumnWidth);
    content += _getLabelText('eyes', 'eyes:', leftColumnWidth);
    content += _getFieldTextBoxEdit('eyes', 'Blue', leftColumnWidth);
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