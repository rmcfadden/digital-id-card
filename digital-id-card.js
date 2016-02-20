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
      var defaults = {
        shouldLoadDependencies : true,
        includeRoot : 'include/'
      };

      var $this = $(this);
      var settings =  $.extend(true, {}, defaults, options || {});
      $this.data('digitalIdCard', settings);

      if(settings.shouldLoadDependencies)
      {
      	var proxyThis = this;
        _loadDependencies(settings, function(){          
          _init.call(proxyThis, function(){
	          if(settings.callback){
	          	settings.callback();
          	}
          });
        });
      }
      else{     
       	_init.call(this, function(){
          if(settings.callback){
          	settings.callback();
        	}
    		});
      }
    
      return this;
    },
    show : function( ) {},
    hide : function( ) {},
    onUpdate : function() {},
    idtext : function() { return _idToJsonText(); },
    envelopetext : function() { 
      return _idToEnvelopeJsonText.apply(this);
    },
    generatekeypair : function() { return _generateKeyPair(); }
  }


  function _loadDependencies(settings, callback){
    var scripts = [
      settings.includeRoot + 'sjcl.js',
      settings.includeRoot + 'crypto.js',
      settings.includeRoot + 'jSignature.min.js',
      settings.includeRoot + 'qrcode.js',
      settings.includeRoot + 'jquery.qrcode.js'
    ];

    _getMultiScripts(scripts, function(){
      if(callback){
        callback();          
      }  
    });
  }


  function _init(callback){    
    var contentText = _createContent();	
    $(this).html(contentText);

    _initPopup();

    _makeLabelEditable('id-card-name');
    _makeLabelEditable('id-card-email');
    _makeLabelEditable('id-card-addressline1');
    _makeLabelEditable('id-card-addressline2');
    _makeLabelEditable('id-card-country');
    _makeLabelEditable('id-card-sex');
    _makeLabelEditable('id-card-height');
    _makeLabelEditable('id-card-weight');
    _makeLabelEditable('id-card-eyes');

    _enableImageUploader(this);
    _loadSignatureSection(this);
    _loadQRCode(this);

    var proxyThis = this;
    _loadEnvelope.call(this,function(){
	   	_applyEnvelopeToCard(proxyThis);  
			if(callback){
				callback();
    	}
   	});
  }


  function _loadEnvelope(callback){
  	var $this = $(this);
    var settings = $this.data('digitalIdCard');

    if(settings.url){
			$.getJSON( settings.url, function(obj) {
				settings.obj = obj;
				if(callback){
					callback();
				} 			
			})
  		.fail(function() {
    	console.log( "error" );
  		});
    }

 
  }

  function _initPopup(){
		$(document).mouseup(function (e) {
			var popup = $("#id-card-popup");
			if (!$('#id-card-popup').is(e.target) && !popup.is(e.target) && popup.has(e.target).length == 0) {
				_hidePopup();
			}
		});

		$('#id-card-popup-header-close').click(function(e){
			_hidePopup();
		});


		$('#id-card-popup-accept').click(function(e){
			_hidePopup();
		});

		$('#id-card-popup-accept').html(_localizeString('popup_accept_text','ACCEPT'));

		$('#id-card-popup-close').click(function(e){
			_hidePopup();
		});
		$('#id-card-popup-close').html(_localizeString('popup_close_text','CLOSE'));
  }


  function _applyEnvelopeToCard(obj){
    var $this = $(obj);
    var settings = $this.data('digitalIdCard');

    if(settings.obj){

      if(settings.obj.digitalId){
        var digitalId = settings.obj.digitalId;

        if(digitalId.name){
          _setName(digitalId.name);
        }

        if(digitalId.email){
          _setEmail(digitalId.email);
        }

        if(digitalId.addressLine1){
          _setAddressLine1(digitalId.addressLine1);
        }

				if(digitalId.addressLine1){
          _setPhoto(digitalId.photo);
        }

        if(digitalId.photo){
	     		_setPhoto(digitalId.photo);
        }
      }
    }
  }


  function _hidePopup(){
		var popup = $("#id-card-popup");
		popup.hide(100);  	
  }


  function _idToJson(){
    var obj = {};

    var name = _getName();
    if(name){
      obj.name = name;
    }

    var email = _getEmail();
    if(email){
      obj.email = email;
    }

    var addressLine1 = _getAddressLine1();
    if(addressLine1){
      obj.addressLine1 = addressLine1;
    }

    var addressLine2 = _getAddressLine2();
    if(addressLine2){
      obj.addressLine2 = addressLine2;
    }

    var country = _getCountry();
    if(country){
      obj.country = country;
    }

    var height = _getHeight();
    if(height){
      obj.height = height;
    }

    var weight = _getWeight();
    if(weight){
      obj.weight = weight;
    }

    var eyes = _getEyes();
    if(eyes){
      obj.eyes = eyes;
    }

		var $this = $(this);
		var settings = $this.data('digitalIdCard');

		if(settings.hasPhoto){
			obj.photo = _getPhoto();
		}

    return obj;
  }


  function _idToJsonText(){
    var json = _idToJson();
    return JSON.stringify(json);
  }


  function _idToEnvelopeJson(){
    var envelope = {};
 
    var digitalid = _idToJson.apply(this);

    envelope.digitalid = digitalid;

    var idText = JSON.stringify(digitalid);

    var crypt = new crypto();
    var idHash = crypt.hash(idText);

    envelope.idHash = { 
      hasher: crypt.args.hashAlgo,
      value : idHash
    };

    var $this = $(this);
    var settings = $this.data('digitalIdCard');

    if(!settings.keys){
      settings.keys = _generateKeyPair();
    }

    envelope.keys = settings.keys;    

    return envelope;
  }


  function _generateKeyPair(){
    var crypt = new crypto();
    return crypt.generateKeyPair();
  }


  function _idToEnvelopeJsonText(){
    var json = _idToEnvelopeJson.apply(this);
    return JSON.stringify(json);
  }


  function _getName(){
    return $('#id-card-name').text();
  }


  function _setName(name){
    $('#id-card-name').text(name);
  }


  function _getEmail(){
    return $('#id-card-email').text();
  }


  function _setEmail(email){
    $('#id-card-email').text(email);
  }


  function _getAddressLine1(){
    return $('#id-card-addressline1').text();
  }


  function _setAddressLine1(addressline1){
    $('#id-card-addressline1').text(addressline1);
  }


  function _getAddressLine2(){
    return $('#id-card-addressline2').text();
  }


  function _setAddressLine2(addressline2){
    $('#id-card-addressline2').text(addressline2);
  }


  function _getCountry(){
    return $('#id-card-country').text();
  }


  function _setCountry(country){
    $('#id-card-country').text(country);
  }


  function _getWeight(){
    return $('#id-card-weight').text();
  }


  function _setWeight(weight){
    $('#id-card-weight').text(weight);
  }


  function _getHeight(){
    return $('#id-card-height').text();
  }


  function _setHeight(height){
    $('#id-card-height').text(height);
  }


  function _getEyes(){
    return $('#id-card-eyes').text();
  }


  function _setEyes(eyes){
    $('#id-card-height').text(height);
  }


	function _getPhoto(){
		var photoImg = $('#id-card-photo')[0];
		return _getImageDataUrl(photoImg);  
	}


  function _setPhoto(photo){
		$('#id-card-photo').attr('src',photo);
  }



  function _makeLabelEditable(id){
    var idObj = $('#' + id);
    var idObjEdit = $('#' + id +'-edit');
    var idObjEditImage = $('#' + id +'-edit-image');

    idObj.hover(function() {
      idObjEditImage.addClass('id-card-edit-image');
    });

    idObj.mouseout(function() {
      idObjEditImage.removeClass('id-card-edit-image');
    });

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


  function _getLabelText(name, text){
    return '<label id="id-card-' + name + '-label" class="id-card-desciption-label">' + text + '</label>';
  }


  function _getFieldTextBoxEdit(name, text, fixedWidthClass){
    var newFixedWidthClass = '';
    if(fixedWidthClass){
      newFixedWidthClass = fixedWidthClass;
    }

    var returnText = '<label id="id-card-' + name + '" class="id-card-desciption-label-text ' +  newFixedWidthClass + '">' + text + '</label>';
    returnText += '<span id="id-card-' + name + '-edit-image"></span>';
    returnText += '<input id="id-card-' + name + '-edit" name="id-card-' + name + '" class="' + newFixedWidthClass + '" style="display:none;"></input>';
    return returnText;
  }


  function _enableImageUploader(obj){
    $("input[id='id-card-photo-uploader']").change(function(event){
			var file = event.target.files[0];
			_applyPhoto(obj,file); 
    });

    $('#id-card-photo-container').click(function(event){
         $("input[id='id-card-photo-uploader']").click();
    });

    $('#id-card-photo-container').css('cursor','pointer');
  }


  function _applyPhoto(obj,file){
    var image = $('#id-card-photo');
    var reader  = new FileReader();

    reader.onloadend = function () {
      //image.css('background-image',  'url(' + reader.result + ')');
      image.attr('src', reader.result );

			var $this = $(obj);
			var settings = $this.data('digitalIdCard');
			settings.isPhotoChanged = true;
			settings.hasPhoto = true;
    }

    if (file) {
      reader.readAsDataURL(file); //reads the data as a URL
    } else {
      image.src = "";
    }  
  }


  function _loadSignatureSection(){
    var cardIdSignature = $('#id-card-signature');
  	cardIdSignature.jSignature();

		cardIdSignature.click(function(){
    	_showSignaurePopupFrame();
    });
  }


  function _loadQRCode(code){
  	// Custom colors are not working!
    $('#id-card-qrcode').qrcode({ width: 90, height: 90, colorDark : '#9e9e9e', colorLight : '#ffffff', text: 'this plugin is great'});
    $('#id-card-qrcode').click(function(){
    	_showQRPopupFrame();
    });
  }


  function _loadPopupQRCode(code){
  	// Custom colors are not working!
		$('#id-card-popup-content').empty();
		$('#id-card-popup-content').append('<div id="id-card-popup-qrcode"></div>');
		$('#id-card-popup-qrcode').qrcode({ width: 300, height: 300, colorDark : '#9e9e9e', colorLight : '#ffffff', text: 'this plugin is great'});
  }


  function _showQRPopupFrame(){
		_showCardPopup();
		_loadPopupQRCode();  
	}


  function _showSignaurePopupFrame(){
		_showCardPopup();
		_showSignaturePopup();
	}


	function _showSignaturePopup(){
		$('#id-card-popup-content').empty();

		var cardIdSignature = $('<div id="id-card-popup-signature"></div>');
		$('#id-card-popup-content').append(cardIdSignature);
		cardIdSignature.jSignature();
	} 


  function _createContent(){
    var content = '<div id="id-card-container">';

    // Card Popup
		content += '<div id="id-card-popup" style="display:none">';
		content += '<header>';
		content += '<div id="id-card-header-title"></div>';
		content += '<svg id="id-card-popup-header-close" class="svg-icon"></svg>';
		content += '</header>'; // id-card-popup-header

		content += '<main id="id-card-popup-content">TESTING!</main>'; 
		content += '<footer id="id-card-popup-footer">';
		content += '<span id="id-card-popup-accept"></span>';
		content += '<span id="id-card-popup-close"></span>';
		content += '</footer>'; 
		content += '</div>'; // id-card-popup


    // Header
    content += '<div id="id-card-header">';
    content += '</div>';	// id-card-header

    // Content
    content += '<div id="id-card-content">';

    content += '<div id="id-card-content-left">';

    // Image Container
    content += '<div id="id-card-photo-container" >';
   	content += '<img id="id-card-photo"></img>';
    content += '</div>';	// id-card-photo-container
    content += '<input type="file"" id="id-card-photo-uploader" style="display:none" />';
    content += '</div>';  // id-card-content-left


    // Description
    var fixedWidthClass = 'field-fixed-width';

    content += '<div id="id-card-content-right">';

    content += '<div id="id-card-description-container">';

    content += '<div id="id-card-name-container">';

    var nameLabel =_localizeString('name_label_text','name:')
    content += _getLabelText('name', nameLabel);
    content += _getFieldTextBoxEdit('name', '');
    content += '</div>';  // id-card-name-container

    content += '<div id="id-card-email-container">';

    var emailLabel =_localizeString('email_label_text','email:')
    content += _getLabelText('email', emailLabel);
    content += _getFieldTextBoxEdit('email', '');
    content += '</div>';  // id-card-email-container

    content += '<div id="id-card-address-container" class="label-break">';

    var addressLabel =_localizeString('address_label_text','address:')
    content += _getLabelText('addressline1', addressLabel);
    content += _getFieldTextBoxEdit('addressline1','');
    content += '<div></div>';
    content += _getLabelText('addressline2', '');
    content += _getFieldTextBoxEdit('addressline2', '');
    content += '<div></div>';
    content += _getLabelText('country', '');
    content += _getFieldTextBoxEdit('country', 'United States Of America');
    content += '<div></div>';  
    content += '</div>'; // id-card-address-address

    content += '<div id="id-card-physical-container" class="label-break">';

    var sexLabel =_localizeString('sex_label_text','sex:')
    content += _getLabelText('sex', sexLabel);
    content += _getFieldTextBoxEdit('sex', 'Male', fixedWidthClass);

    var heightLabel =_localizeString('height_label_text',heightLabel)
    content += _getLabelText('height', heightLabel);
    content += _getFieldTextBoxEdit('height', '6 ft.', fixedWidthClass);
    content += '<div></div>';  

    var weightLabel =_localizeString('weight_label_text',weightLabel)
    content += _getLabelText('weight', 'weight:');
    content += _getFieldTextBoxEdit('weight', '185 lb.', fixedWidthClass);

    var eyesLabel =_localizeString('eyes_label_text',eyesLabel)
    content += _getLabelText('eyes', 'eyes:');
    content += _getFieldTextBoxEdit('eyes', 'Blue', fixedWidthClass);
    content += '<div></div>';  
    content += '</div>'; // id-card-physical-container


    content += '</div>';	// id-card-description-container
    content += '</div>';  // id-card-content-right

    content += '</div>';  // id-card-content

    // Footer
    content += '<div id="id-card-footer">';

    content += '<div id="id-card-footer-content">';

    content += '<div id="id-card-footer-content-left">';

    content += '<div id="id-card-signature">';
    content += '</div>'; //id-card-signature


    content += '</div>';  // id-card-footer-content-left

    content += '<div id="id-card-footer-content-right">';

    content += '<div id="id-card-footer-info-left">';
    content += '</div>'; //   id-card-footer-info-left

    content += '<div id="id-card-footer-info-right" >';

    content += '<div id="id-card-qrcode">';
    content += '</div>'; //id-card-qrcode

    content += '</div>'; //   id-card-footer-info-right


    content += '</div>';  // id-card-footer-content-left
    content += '</div>';  // id-card-footer-content

    content += '</div>';	// id-card-footer

    content += '</div>';	// id-card-container

 
    return content;
  }


  function _showCardPopup(){
 		$('#id-card-popup').show();
  }


  function _getImageDataUrl(img){
    //http://stackoverflow.com/questions/934012/get-image-data-in-javascript
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    // Copy the image contents to the canvas
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    // Get the data-URL formatted image
    // Firefox supports PNG and JPEG. You could check img.src to
    // guess the original format, but be aware the using "image/jpg"
    // will re-encode the image.
    var dataURL = canvas.toDataURL("image/png");

    return dataURL; //.replace(/^data:image\/(png|jpg);base64,/, "");
  }


  function _getMultiScripts(scripts, callback) {
    if(scripts.length ==0){
        callback();
        return;
    }

    var url = scripts[0];
    scripts.shift();
    loadScript(url, function(){
        _getMultiScripts(scripts, callback);
    });        
  }


  function _localizeString(item, defaulText){
  	// TOOD
  	return defaulText;
  }


  function loadScript(url, callback){
    // Adding the script tag to the head as suggested before
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;

    // Then bind the event to the callback function.
    // There are several events for cross browser compatibility.
    script.onreadystatechange = callback;
    script.onload = callback;

    // Fire the loading
    head.appendChild(script);
  }

})(jQuery);

