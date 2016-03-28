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
    });


    /**
     * Form for SMS Signups
     */
    $("form.sms-signup").submit(function(e){
      e.preventDefault();

      var $form = $(this);
      var $phone = $form.find("#phone_input")
      var $submit = $form.find('input[type=submit]');
      var $status = $form.find('.status');

      var action = $form.attr('action');
      var phone = $phone.val();

      $submit.attr('disabled','disabled');
      $submit.val("Submitting...")
      $status.html('&nbsp').removeClass('error success')

      $.post(action, {phone: phone})
      .done(function(resp){
        $status.addClass('success').text('Thank you!');
        $phone.val('');
      })
      .fail(function(jqxhr, txt, err){
        err = jqxhr.responseJSON;
        $status.addClass('error').text(err.message);
      })
      .always(function(){
        $submit.removeAttr('disabled');
        $submit.val('Submit');
      })

    })

    $('body.subscribe #phone_input').focus(function(){
      $(this).closest('form').find('.status').removeClass('success error').html('&nbsp;')
    })
  })
})(jQuery)
