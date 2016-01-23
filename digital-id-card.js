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
          shouldLoadDependencies : true
      };

      settings = $.extend({}, defaults, options); 			
      
      if(settings.shouldLoadDependencies)
      {
        var proxyThis = this;
        _loadDependencies(function(){          
          _init.apply(proxyThis);
          if(options.callback){
            options.callback();
          }
        });
      }
      else{     
        return _init.apply(this);
      }
    },
    show : function( ) {},
    hide : function( ) {},
    onUpdate : function() {},
    idtext : function() { return _idToJsonText(); },
    envelopetext : function() { return _idToEnvelopeJsonText(); },
    generatekeypair : function() { return _generateKeyPair(); }
  }


  function _loadDependencies(callback){
    var scripts = [
      'include/sjcl.js',
      'include/crypto.js',
      'include/jSignature.min.js',
      'include/jquery.qrcode.js'
    ];

    _getMultiScripts(scripts, function(){
      if(callback){
        callback();          
      }  
    });
  }


  function _init(){    
    var contentText = _createContent();	
    $(this).html(contentText);

    _makeLabelEditable('id-card-name');
    _makeLabelEditable('id-card-email');
    _makeLabelEditable('id-card-addressline1');
    _makeLabelEditable('id-card-addressline2');
    _makeLabelEditable('id-card-country');
    _makeLabelEditable('id-card-sex');
    _makeLabelEditable('id-card-height');
    _makeLabelEditable('id-card-weight');
    _makeLabelEditable('id-card-eyes');

    _enableImageUploader();

    _loadSignatureSection();

     return this;
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

    return obj;
  }


  function _idToJsonText(){
    var json = _idToJson();
    return JSON.stringify(json);
  }


  function _idToEnvelopeJson(){
    var envelope = {};
 
    var id = _idToJson();

    envelope.id = id;

    var idText = JSON.stringify(id);

    var crypt = new crypto();
    var idHash = crypt.hash(idText);

    envelope.idHash = { 
      hasher: crypt.args.hashAlgo,
      value : idHash
    };

    if(!this.settings.keys){
      this.settings.keys = _generateKeyPair();
    }

    envelope.keys = this.settings.keys;    

    return envelope;
  }


  function _generateKeyPair(){
    var crypt = new crypto();
    return crypt.generateKeyPair();
  }


  function _idToEnvelopeJsonText(){
    var json = _idToEnvelopeJson();
    return JSON.stringify(json);
  }


  function _getName(){
    return $('#id-card-name').text();
  }


  function _getEmail(){
    return $('#id-card-email').text();
  }


  function _getAddressLine1(){
    return $('#id-card-addressline1').text();
  }


  function _getAddressLine2(){
    return $('#id-card-addressline2').text();
  }


  function _getCountry(){
    return $('#id-card-country').text();
  }


  function _getWeight(){
    return $('#id-card-weight').text();
  }


  function _getHeight(){
    return $('#id-card-height').text();
  }


  function _getEyes(){
    return $('#id-card-eyes').text();
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


  function _getLabelText(name, text, width){
    return '<label id="id-card-' + name + '-label" class="id-card-desciption-label" style="display:inline-block; width:' + width + '">' + text + '</label>';
  }


  function _getFieldTextBoxEdit(name, text, width){
    var widthText = '';
    if(width){
      widthText = width;
    }

    var returnText = '<label id="id-card-' + name + '" class="id-card-desciption-label-text" style="display:inline-block;width:' + widthText + '">' + text + '</label>';
    returnText += '<span id="id-card-' + name + '-edit-image"></span>';
    returnText += '<input id="id-card-' + name + '-edit" name="id-card-' + name + '" style="display:none; width:' + widthText + '"></input>';
    return returnText;
  }


  function _enableImageUploader(){
    $("input[id='id-card-image-uploader']").change(function(event){
        var file = event.target.files[0];
        _applyPhoto(file); 
    });

    $('#id-card-image-container').click(function(event){
         $("input[id='id-card-image-uploader']").click();
    });

    $('#id-card-image-container').css('cursor','pointer');
  }


  function _applyPhoto(file){
    var image = $('#id-card-image-container');
    var reader  = new FileReader();

    reader.onloadend = function () {
      image.css('background-image',  'url(' + reader.result + ')');
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
  }


  function _createContent(){
    var content = '<div id="id-card-container">';

    // Header
    content += '<div id="id-card-header" style="background-color:red">';
    content += '</div>';	// id-card-header

    // Content
    content += '<div id="id-card-content">';

    content += '<div id="id-card-content-left" style="background-color:orange;">';

    // Image Container
    content += '<div id="id-card-image-container" >';
    content += '</div>';	// id-card-image-container
    content += '<input type="file"" id="id-card-image-uploader" style="display:none" />';
    content += '</div>';  // id-card-content-left


    // Description
    var leftColumnWidth = "75px";
    var breakHeight = "25px";

    content += '<div id="id-card-content-right">';

    content += '<div id="id-card-description-container">';

    content += '<div id="id-card-name-container">';
    content += _getLabelText('name', 'name:', leftColumnWidth);
    content += _getFieldTextBoxEdit('name', 'Ryan Patrick McFadden');
    content += '</div>';  // id-card-name-container

    content += '<div id="id-card-email-container">';
    content += _getLabelText('email', 'email:', leftColumnWidth);
    content += _getFieldTextBoxEdit('email', 'ryan@email.com');
    content += '</div>';  // id-card-email-container


    content += '<div id="id-card-address-container" style="margin-top:' + breakHeight + '">';
    content += _getLabelText('addressline1', 'address:', leftColumnWidth);
    content += _getFieldTextBoxEdit('addressline1', '1101 De La Vina St.');
    content += '<div></div>';
    content += _getLabelText('addressline2', '', leftColumnWidth);
    content += _getFieldTextBoxEdit('addressline2', 'Santa Barbara, CA. 93101');
    content += '<div></div>';
    content += _getLabelText('country', '', leftColumnWidth);
    content += _getFieldTextBoxEdit('country', 'United States Of America');
    content += '<div></div>';  
    content += '</div>'; // id-card-address-address

    content += '<div id="id-card-physical-container" style="margin-top:' + breakHeight + '">';
    content += _getLabelText('sex', 'sex:', leftColumnWidth);
    content += _getFieldTextBoxEdit('sex', 'Male', leftColumnWidth);
    content += _getLabelText('height', 'height:', leftColumnWidth);
    content += _getFieldTextBoxEdit('height', '6 ft.', leftColumnWidth);
    content += '<div></div>';  
    content += _getLabelText('weight', 'weight:', leftColumnWidth);
    content += _getFieldTextBoxEdit('weight', '185 lb.', leftColumnWidth);
    content += _getLabelText('eyes', 'eyes:', leftColumnWidth);
    content += _getFieldTextBoxEdit('eyes', 'Blue', leftColumnWidth);
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

    content += '<div id="id-card-footer-content-right" style="background-color:red;">';
    content += 'RIGHT SIDE!!!';

    content += '</div>';  // id-card-footer-content-left
    content += '</div>';  // id-card-footer-content

    content += '</div>';	// id-card-footer


    content += '</div>';	// id-card-container

    return content;
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

    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
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

