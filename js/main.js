var debug = true;

//declaring all vars

var number_of_people = 0;
var number_of_showers = 0;
var shower_minutes = 0;
var dishwasher_loads = 0;

var usageCategories = ['bath', 'dishwasher'];
var usageData = new Object();
// Gallons for calculations

var shower_gallons = 5;
var dishwasher_gallons = 25;



// PEOPLE IN HOUSEHOLD
// Grab the value of the radio button
// Recalculate when number of people Changes

$('input[name=household_members]:radio').change(function() {
  number_of_people = Number($(this).val());
  calculateUsage('all');
  
  if(debug) {
    console.log('Household Members Changed to ' + number_of_people);
  }

});



// SHOWERS

$('input[name=shower_number]:radio').change(function() {
  number_of_showers = Number($(this).val());
  calculateUsage('bath');
  
  if(debug) {
    console.log('Number of Showers Changed to ' + number_of_showers);
  }
  
});

$('input[name=shower_minutes]:radio').change(function() {
  shower_minutes = Number($(this).val());
  calculateUsage('bath');
  
  if(debug) {
    console.log('Length of showers changed to ' + shower_minutes + ' minutes' );
  }
  
});

// DISHWASHER

$('input[name=dishwasher_loads]:radio').change(function() {
  
  dishwasher_loads = Number($(this).val());
  calculateUsage('dishwasher');
  
  if(debug) {
    console.log('Number of Dishwasher Loads changed to ' + dishwasher_loads);
  }
  
});


// OUTPUT USAGE TOTALS ONTO PAGE
// AND STORE THEM IN usageData Object

function usageOutput(type, total) {
  usageData[type] = total;
  $('#' + type).html(total + ' gallons');
  usageTotals();
}

function usageTotals() {
  //HOUSEHOLD TOTALS
  usageData.total_household_day = 0;
  jQuery.each(usageCategories, function() {
    total = this+'_household_total';
    if(usageData[total]) {
      usageData.total_household_day += Number(usageData[total]);
      if(debug) {
        console.log(total + ': ' + usageData[total]);
      }
    }
  });
  
  usageData.total_household_week = (usageData.total_household_day * 7);
  usageData.total_household_month = (usageData.total_household_week * 4);
  usageData.total_household_year = (usageData.total_household_year * 52);
  
  $('#total_household_week').html(usageData.total_household_week = ' gallons');  
  
} //usageTotals




// CALCULATIONS FUNCTION
// This function handles all of the water usage calculations used above

function calculateUsage(type) {
  
  if(type == 'all') {
    jQuery.each(usageCategories, function() {
      calculateUsage(this);
    });
  }
  
  // SHOWER AND BATH
  
  else if(type == 'bath') {
    
    // Calculate Shower Total 
    
    shower_household_total = Math.round( number_of_showers * shower_minutes );
    shower_individual_total = Math.round( shower_household_total / number_of_people );
    
    //usageOutput(type, total);
    usageOutput('shower_household_total', shower_household_total);
    usageOutput('shower_individual_total', shower_individual_total);
    
  } //end Shower and Bath
  
  else if (type == 'dishwasher') {
    
    dishwasher_household_total = Math.round((dishwasher_loads * dishwasher_gallons) / 7 );
    dishwasher_individual_total = Math.round(dishwasher_household_total / number_of_people);
    
    usageOutput('dishwasher_household_total', dishwasher_household_total);
    usageOutput('dishwasher_individual_total', dishwasher_individual_total);
  }
  
} //end calculateUsage(type)

