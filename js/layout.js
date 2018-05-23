var ignoreAnswers = true;

// Check if the Sidebar should be showing on this slide
function sidebarCheck() {
  var sidebar = $('.main-sidebar');
  var currentSlide = $('li.current-slide');
  var resultsSidebar = $('.results-sidebar');
  if(currentSlide.hasClass('landing-slide')) {
    sidebar.hide();
    resultsSidebar.hide();
  } else if(currentSlide.hasClass('results-slide')) {
    sidebar.hide();
    resultsSidebar.show();
  } else {
    sidebar.show();
  }
}

$(document).ready(function() {
  sidebarCheck();
});

// First Slide Begin button

$('.begin-button').click(function() {
  $('li.current-slide').removeClass('current-slide').next().addClass('current-slide');
  sidebarCheck();
});


// Continue to next slide
// Make sure all fields are filled in
// Hide Current Slide and show next one

$('.continue-button').click(function() {
    
  // Check that all questions on this slide have a response
  var questions = $('li.current-slide fieldset').length;
  var responses = $('li.current-slide input:checked').length;
  if(ignoreAnswers) {
    questions = 5;
    responses = 5;
  }
  // If all questions have a response, continue
  if( responses === questions ) {
    $('.proceed-alert').hide();
    
    $('li.current-slide').addClass('hide-for-next')
      .next().addClass('show-next').show()
      .find('fieldset').hide()
      .each(function(i) {
        var $that = $(this);
        setTimeout(function() {
          $that.addClass('show-this-field').show();
        }, i * 200);
      });
    
    setTimeout(function() {
      $('li.hide-for-next').removeClass('current-slide').removeClass('hide-for-next').hide()
      .next().addClass('current-slide').removeClass('show-next');
      $('.show-this-field').removeClass('show-this-field');
      
      //don't run sidebarCheck until new slide has current-slide class
      sidebarCheck();
    }, 1200); 

  } else { // Need responses
    $('.proceed-alert').show();
  } 
});

// Hide this Slide and return to previous slide

$('.previous-button').click(function() {
  
  $('li.current-slide').addClass('hide-for-previous').find('fieldset').each(function(i){
    var $that = $(this);
    setTimeout(function() {
      $that.addClass('hide-this-field');
    }, i * 200);
  });
  
  $('li.current-slide').prev().addClass('show-previous').show();
  setTimeout(function() {
    $('.hide-this-field').removeClass('hide-this-field');
    $('li.hide-for-previous')
      .removeClass('current-slide')
      .removeClass('hide-for-previous')
      .hide()
      .prev()
      .addClass('current-slide')
      .removeClass('show-previous')
      .show();
  }, 1000);

  //$('li.current-slide').prev().addClass('current-slide').show();
  //$(this).closest('.current-slide').removeClass('current-slide');
  sidebarCheck();
});



// Restart when finished
// Reloads the page to reset all fields

$('.restart-button').click(function() {
  writeValueToTxt(0);
  document.location.reload(true);
});
