(function($){
   $.fn.digitalIdCard = function(options){
      var defaults = {
        height: 500px,
        width: 5000px,
      }

      var settings = $.extend({}, defaults, options);

      if(settings.variable1){
         // do something
      }

      ...
   }
})(jQuery);