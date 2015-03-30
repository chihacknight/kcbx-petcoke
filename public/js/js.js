(function($){
  $(document).ready(function(){
    $('.compass .bearing-indicator').each(function(idx, obj){
      var $indicator = $(this);
      var bearing = $indicator.data('bearing')
      $indicator.css({
          '-webkit-transform': 'rotate(' + bearing + 'deg)',
          '-moz-transform': 'rotate(' + bearing + 'deg)',
          '-o-transform': 'rotate(' + bearing + 'deg)',
          'transform': 'rotate(' + bearing + 'deg)'
      })
    })
  })
})(jQuery)