var debug = true;
var gaugePercentage = 0;
var usageTotalsData = new Object;
//declaring all vars

var householdCount = 1;

var showerCount = 0,
     showerMinutes = 0,
     showerLowFlow,
     showerGallons = 4,
     showerGallonsLow = 2;

var bathCount = 0,
     bathGallons = 35;

var toiletCount = 0,
     toiletLowFlow, 
     toiletGallons = 4,
     toiletGallonsLow = 1.6;

var bathSinkMinutes = 0,
     bathSinkLowFlow,
     bathSinkGallons;

var kitchenSinkMinutes = 0,
     kitchenSinkLowFlow,
     kitchenSinkGallons;

// for bath and kitchen sinks
var sinkGallons = 2.2, 
     sinkGallonsLow = 1.5;

var dishwasherWeekly = 0,
     dishwasherSaving,
     dishwasherGallons = 12,
     dishwasherGallonsLow = 5.5;

var laundryWeekly = 0,
     laundrySaving,
     laundryGallons = 43,
     laundryGallonsLow = 27;

var lawnWeekly = 0,
     lawnMinutes = 0,
     rainSensor,
     lawnGallons = 11.67,
     lawnGallonsLow; // may not need this depending on how formula is written. If rain sensor, lawn_gallons * 0.76

var hoseMinutes = 0,
     hoseGallons = 9; // also for pool

var poolMinutes = 0;


// Below we collect the values input by the user, and then calculate usage.

// Household

$('input[name=household_count]:radio').change(function() {
  
  householdCount = Number($(this).val());
  
  if(debug) {
    console.log('Household Count changed to ' + householdCount);
  }
  
});

// Shower
$('input[name=shower_count]:radio').change(function() {
  calculateUsage('shower');
  calculateUsage('bathroom');
});

$('input[name=shower_minutes]:radio').change(function() {
  calculateUsage('shower');
  calculateUsage('bathroom');
});

$('input[name=shower_low_flow]:radio').change(function() {
  calculateUsage('shower');
  calculateUsage('bathroom');
});

// Bath
$('input[name=bath_count]:radio').change(function() {
  calculateUsage('bath');
  calculateUsage('bathroom');  
});

// Toilet
$('input[name=toilet_count]:radio').change(function() {
  calculateUsage('toilet');
  calculateUsage('bathroom');
});

$('input[name=toilet_low_flow]:radio').change(function() {
  calculateUsage('toilet');
  calculateUsage('bathroom');
});

// Bathroom Sink
$('input[name=bath_sink_minutes]:radio').change(function() {
  calculateUsage('bathSink');
  calculateUsage('bathroom');
});

$('input[name=bath_sink_low_flow]:radio').change(function() {
  calculateUsage('bathSink');
  calculateUsage('bathroom');
});


// Kitchen sink
$('input[name=kitchen_sink_minutes]:radio').change(function() {
  calculateUsage('kitchenSink');
  calculateUsage('kitchen');
});

$('input[name=kitchen_sink_low_flow]:radio').change(function() { 
  calculateUsage('kitchenSink');
  calculateUsage('kitchen');
});

// Dishwasher
$('input[name=dishwasher_weekly]:radio').change(function() { 
  calculateUsage('dishwasher');
  calculateUsage('kitchen');
});

$('input[name=dishwasher_saving]:radio').change(function() {
  calculateUsage('dishwasher');
  calculateUsage('kitchen');
});

// Laundry
$('input[name=laundry_weekly]:radio').change(function() {
  calculateUsage('laundry');
});

$('input[name=laundry_saving]:radio').change(function() {
  calculateUsage('laundry');
});

// Lawn
$('input[name=lawn_weekly]:radio').change(function() {
  calculateUsage('lawn');
  calculateUsage('outside');  
});

$('input[name=lawn_minutes]:radio').change(function() {
  calculateUsage('lawn');
  calculateUsage('outside');
});

$('input[name=rain_sensor]:radio').change(function() {
  calculateUsage('lawn');
  calculateUsage('outside');
});

// Hose
$('input[name=hose_minutes]:radio').change(function() {
  calculateUsage('hose');
  calculateUsage('outside');
});

// Pool 
$('input[name=pool_minutes]:radio').change(function() {
  calculateUsage('pool');
  calculateUsage('outside');
});


// OUTPUT USAGE TOTALS ONTO PAGE
// AND STORE THEM IN usageTotalsData Object
function usageOutput(type, total) {
  usageTotalsData[type] = total;
  
  console.log(usageTotalsData);
  //$('#' + type).html(total + ' gallons');
  usageTotals();
  
  renderResultsPage();
  
}


//Output all of the data onto the results Page

function renderResultsPage() {
  
  // Display comparison to nationalAverage on Left column
  var nationalAverage = 90;
  var nationalDifference = Math.round(usageTotalsData.dailyUsageTotal - nationalAverage);
  
  if(nationalDifference > 0) {
    // You use more
    $('#nationalDifference').text(nationalDifference);
    $('#differenceWord').text('more');
  } else if(nationalDifference <= 0) {
    // You use less
    $('#nationalDifference').text(Math.abs(nationalDifference));
    $('#differenceWord').text('less');
  }
  
  // Chart Values  
  var chartistData = {
    labels: ['Bathroom', 'Kitchen', 'Laundry', 'Outside'],
    series: [bathroomTotal, kitchenTotal, laundryTotal, outsideTotal]
  };
  
  // Chart Options
  var chartistOptions = {
    labelInterpolationFnc: function(value) {
      return value;
    },
    donut: true,
    donutWidth: 80,
    chartPadding: 30,
  };
  
  // Create Chart
  new Chartist.Pie('.chartist-chart', chartistData, chartistOptions);

  // Calculate Percentages
  
  var bathroomPercentage = Math.round((bathroomTotal / usageTotalsData.dailyUsageTotal) * 100);
  var kitchenPercentage = Math.round((kitchenTotal / usageTotalsData.dailyUsageTotal) * 100);
  var laundryPercentage = Math.round((laundryTotal / usageTotalsData.dailyUsageTotal) * 100);
  var outsidePercentage = Math.round((outsideTotal / usageTotalsData.dailyUsageTotal) * 100);
  
  $('#bathroomPercentage').text(bathroomPercentage);
  $('#kitchenPercentage').text(kitchenPercentage);
  $('#laundryPercentage').text(laundryPercentage);
  $('#outsidePercentage').text(outsidePercentage);
  
  // Right Column values
  
  $('#dailyUsage').text(Math.round(usageTotalsData.dailyUsageTotal).toLocaleString());
  $('#weeklyUsage').text(Math.round(usageTotalsData.weeklyUsageTotal).toLocaleString());
  $('#monthlyUsage').text(Math.round(usageTotalsData.monthlyUsageTotal).toLocaleString());
  $('#yearlyUsage').text(Math.round(usageTotalsData.yearlyUsageTotal).toLocaleString());
  
} // renderResultsPage()

// Temporary Charist Output

/*
var chartistTempData = {
    labels: ['Bathroom', 'Kitchen', 'Laundry', 'Outside'],
    series: [25, 56, 12, 30]
  }
*/
  
//new Chartist.Pie('.chartist-chart', chartistTempData, chartistOptions);

//Calculates Daily, Weekly, Monthly, and Yearly totals.
function usageTotals() {
  usageTotalsData.dailyUsageTotal = 0;
  // Get each total and add it together to get a daily Total.
  jQuery.each(totalCategories, function() {
    getTotal = this + 'Total';
    if(usageTotalsData[getTotal]) {
      usageTotalsData.dailyUsageTotal += usageTotalsData[getTotal];
    }
  });

  usageTotalsData.weeklyUsageTotal = usageTotalsData.dailyUsageTotal * 7;
  usageTotalsData.monthlyUsageTotal = usageTotalsData.weeklyUsageTotal * 4;
  usageTotalsData.yearlyUsageTotal = usageTotalsData.monthlyUsageTotal * 12;


  currentValue = parseInt($('#runningDailyUsageTotal').html());
  if(isNaN(currentValue)) {
    currentValue = 0;
  }
  newValue = usageTotalsData.dailyUsageTotal;
  if(debug) {
    console.log('currentValue: ' + currentValue);
    console.log('newValue: ' + newValue);
  }
  $({value: Number(currentValue)}).animate({value: Number(newValue)}, {
    duration: 1000,
    easing: 'swing',
    step: function() {
      $('#runningDailyUsageTotal').text(Math.round(this.value));
    }
  });
  
  // Write the Daily usage total to the txt file
  var waterUsageValue = usageTotalsData.dailyUsageTotal;
  writeValueToTxt(Math.round(waterUsageValue));

  // Update the gauge
  
  gaugePercentage = waterUsageValue / 200;
  setGauge('.gauge-cont');
  
  //$('#runningDailyUsageTotal').html(usageTotalsData.dailyUsageTotal);
  if(debug) {
    console.log('DAILY TOTAL: ' + usageTotalsData.dailyUsageTotal);
  }
} // usageTotals


// Function to post daily usage value to txt file
// Called above in usageTotals()

function writeValueToTxt(value) {
  $.ajax({
    type: "POST",
    url: 'value.php',
    data: {data: value},
    success: function(result) {
      console.log("Posting the data was a success");
    }
  });
}


// Reset values when loading and unloading page

$(document).ready(function() {
  writeValueToTxt(0);
});

$(window).unload(function() {
  writeValueToTxt(0);
})


// CALCULATIONS FUNCTION
// This calculates all of the values based on user input

var showerTotal = 0,
    bathTotal = 0,
    toiletTotal = 0,
    bathSinkTotal = 0,
    bathroomTotal = 0,
    kitchenSinkTotal = 0,
    dishwasherTotal = 0,
    laundryTotal = 0,
    kitchenTotal = 0,
    lawnTotal = 0,
    hoseTotal = 0,
    poolTotal = 0,
    outsideTotal = 0;

var usageCategories = [ 'shower', 'bath', 'toilet', 'bathSink', 'bathroom', 'kitchenSink', 'dishwasher', 'kitchen', 'laundry', 'lawn', 'hose', 'pool', 'outside'];
var totalCategories = [ 'bathroom', 'kitchen', 'laundry', 'outside'];
var usageData = {};


function calculateUsage(type) {
  var output = '';
  
  if(type === 'all') {
    $.each(usageCategories, function() {
      calculateUsage(this);
    });
  }
  
  // Calculate Shower Usage
  if(type === 'shower') {
    // Get Values
    showerCount = $('input[name=shower_count]:checked').val();
    showerMinutes = $('input[name=shower_minutes]:checked').val();
    showerLowFlow = $('input[name=shower_low_flow]:checked').val();
    
    if(showerLowFlow > 0) {
      actualGallons = showerGallonsLow;
    } else {
      actualGallons = showerGallons;
    }
    
    // Calculate
    if(showerCount && showerMinutes) {
      showerTotal = showerCount * showerMinutes * actualGallons;
    }
    
    // Output
    usageOutput('showerTotal', showerTotal);
    
    // Debug
    if(debug) {
      output += '[---Shower---]';
      output += '\n Shower Count: ' + showerCount;
      output += '\n Shower Minutes: ' + showerMinutes;
      output += '\n Shower Low Flow: ' + showerLowFlow;
      output += '\n Gallons: ' + actualGallons;
      output += '\n Shower Total: ' + showerTotal + ' gallons'; 
      console.log(output);
    }
  } 
  
  // Calculate Bath Usage
  else if(type === 'bath') {
    // Get Values
    bathCount = $('input[name=bath_count]:checked').val();
    
    // Calculate
    bathTotal = (bathCount * bathGallons) / 7;
    
    // Output
    usageOutput('bathTotal', bathTotal);
    
    // Debug
    if(debug) {
      output += '[---Baths---]';
      output += '\n Bath Count: ' + bathCount;
      output += '\n Gallons per Bath: ' + bathGallons;
      output += '\n Bath Total: ' + bathTotal;
      console.log(output);
    }

  }
  
  // Calculate Toilet Usage 
  else if(type === 'toilet') {
    // Get Values
    toiletCount = $('input[name=toilet_count]:checked').val();
    toiletLowFlow = $('input[name=toilet_low_flow]:checked').val();
          
    if(toiletLowFlow > 0) {
      actualGallons = toiletGallonsLow;
    } else {
      actualGallons = toiletGallons;
    }
    
    //Calculate
    toiletTotal = toiletCount * actualGallons;
    
    // Output
    usageOutput('toiletTotal', toiletTotal);
 
    // Debug
    if(debug) {
      output += '[---Toilet---]';
      output += '\n Toilet Count: ' + toiletCount;
      output += '\n Toilet Low Flow: ' + toiletLowFlow;
      output += '\n GPF: ' + actualGallons;
      output += '\n Toilet Total: ' + toiletTotal;
      console.log(output);
    }
  }
  
  // Calculate Bathroom Sink Usage
  else if(type === 'bathSink') {
    // Get Values
    bathSinkMinutes = $('input[name=bath_sink_minutes]:checked').val();
    bathSinkLowFlow = $('input[name=bath_sink_low_flow]:checked').val();
    
    if(bathSinkLowFlow > 0) {
      actualGallons = sinkGallonsLow;
    } else {
      actualGallons = sinkGallons;
    }
    
    // Calculate
    bathSinkTotal = actualGallons * bathSinkMinutes;
    
    // Output
    usageOutput('bathSinkTotal', bathSinkTotal);
    
    // Debug
    if(debug) {
      output += '[---Bathroom Sink---]';
      output += '\n Bathroom Sink Minutes: ' + bathSinkMinutes;
      output += '\n Low Flow: ' + bathSinkLowFlow;
      output += '\n GPM: ' + actualGallons;
      output += '\n Bath Sink Total: ' + bathSinkTotal;
      console.log(output);
    } 
  }
  
  // Calculate Total Bathroom Usage
  else if(type === 'bathroom') {
    // Calculate
    bathroomTotal = showerTotal + bathTotal + toiletTotal + bathSinkTotal;
    
    // Output
    usageOutput('bathroomTotal', bathroomTotal);
    
    // Debug
    if(debug) {
      output += '[---Bathroom Total--] ' + bathroomTotal;
      console.log(output);
    }
  }
  
  // Calculate Kitchen Sink Usage
  else if(type === 'kitchenSink') {
    // Get Values
    kitchenSinkMinutes = $('input[name=kitchen_sink_minutes]:checked').val();
    kitchenSinkLowFlow =  $('input[name=kitchen_sink_low_flow]:checked').val();
    
    if(kitchenSinkLowFlow > 0) {
      actualGallons = sinkGallonsLow;
    } else {
      actualGallons = sinkGallons;
    }
    
    // Calculate
    kitchenSinkTotal = kitchenSinkMinutes * actualGallons;
    
    // Output
    usageOutput('kitchenSinkTotal', kitchenSinkTotal);
    
    // Debug
    if(debug) {
      output += '[---Kitchen Sink---]';
      output += '\n Kitchen Sink Minutes: ' + kitchenSinkMinutes;
      output += '\n Low Flow: ' + kitchenSinkLowFlow;
      output += '\n GPM: ' + actualGallons;
      output += '\n Kitchen Sink Total: ' + kitchenSinkTotal;
      console.log(output);
    }
  }
  
  // Calculate Dishwasher Usage
  else if(type === 'dishwasher') {
    // Get Values
    dishwasherWeekly = $('input[name=dishwasher_weekly]:checked').val();
    dishwasherSaving = $('input[name=dishwasher_saving]:checked').val();
    
    if(dishwasherSaving > 0) {
      actualGallons = dishwasherGallonsLow;
    } else {
      actualGallons = dishwasherGallons;
    }
    
    // Calculate
    dishwasherTotal = ((dishwasherWeekly * actualGallons) / householdCount) / 7;
    
    // Output
    usageOutput('dishwasherTotal', dishwasherTotal);
  
    //Debug
    if(debug) {
      output += '[--- Dishwasher ---]';
      output += '\n Uses per week: ' + dishwasherWeekly;
      output += '\n EnergyStar: ' + dishwasherSaving;
      output += '\n Gallons per use: ' + actualGallons;
      output += '\n Total: ' + dishwasherTotal;
      console.log(output);
    }
  }
  
  // Calculate Total Kitchen
  else if(type === 'kitchen') {
    // Calculate
    kitchenTotal = kitchenSinkTotal + dishwasherTotal;
    
    // Output
    usageOutput('kitchenTotal', kitchenTotal);
    
    // Debug 
    if(debug) {
      output += '[---Kitchen & Laundry---] ' + kitchenTotal;
      console.log(output);
    }
  }
  
  // Calculate Washing Machine Usage
  else if(type === 'laundry') {
    // Get Values
    laundryWeekly = $('input[name=laundry_weekly]:checked').val(); 
    laundrySaving = $('input[name=laundry_saving]:checked').val();
    
    if(laundrySaving > 0) {
      actualGallons = laundryGallonsLow;
    } else {
      actualGallons = laundryGallons;
    }
    
    // Calculate
    laundryTotal = ((laundryWeekly * actualGallons) / householdCount) / 7;
    
    // Output
    usageOutput('laundryTotal', laundryTotal);

    // Debug
    if(debug) {
      output += '[---Laundry---]';
      output += '\n Loads per week: ' + laundryWeekly;
      output += '\n EnergyStar: ' + laundrySaving;
      output += '\n Gallons per load: ' + actualGallons;
      output += '\n Total: ' + laundryTotal;
      console.log(output);
    }
  }
  
  // Calculate Lawn Usage
  else if(type === 'lawn') {
    // Get Values
    lawnWeekly = $('input[name=lawn_weekly]:checked').val();
    lawnMinutes = $('input[name=lawn_minutes]:checked').val();
    rainSensor = $('input[name=rain_sensor]:checked').val();
    
    if(rainSensor > 0) {
      actualGallons = lawnGallons * 0.67;
    } else {
      actualGallons = lawnGallons;
    }
    
    // Calculate
    lawnTotal = ((lawnWeekly * lawnMinutes * actualGallons) / householdCount) / 7;

    // Output
    usageOutput('lawnTotal', lawnTotal);
  
    // Debug 
    if(debug) {
      output += '[---Lawn---]';
      output += '\n Times weekly: ' + lawnWeekly;
      output += '\n Minutes each time: ' + lawnMinutes;
      output += '\n Sprinkler System w/ Sensor: ' + rainSensor;
      output += '\n GPM: ' + actualGallons;
      output += '\n Total: ' + lawnTotal;
      console.log(output);
    }
  }
  
  // Calculate Hose Usage
  else if(type === 'hose') {
    // Get Values
    hoseMinutes = $('input[name=hose_minutes]:checked').val();
    
    // Calculate
    // should this be daily or weekly, and divided by the householdCount
    hoseTotal = ((hoseMinutes * hoseGallons) / householdCount ) / 7;
 
    // Output
    usageOutput('hoseTotal', hoseTotal);
  
    // Debug
    if(debug) {
      output += '[---Hose---]';
      output += '\n Minutes: ' + hoseMinutes;
      output += '\n GPM: ' + hoseGallons;
      output += '\n Total: ' + hoseTotal;
      console.log(output);
    }
  }
  
  // Calculate Pool Usage
  else if(type === 'pool') {
    // Get Values
    poolMinutes = $('input[name=pool_minutes]:checked').val();
    
    // Calculate
    poolTotal = ((poolMinutes * hoseGallons) / householdCount ) / 7;
    
    // Output
    usageOutput('poolTotal', poolTotal);
    
    // Debug
    if(debug) {
      output += '[---Pool---]';
      output += '\n Minutes per week filling: ' + poolMinutes;
      output += '\n GPM (hose): ' + hoseGallons;
      output += '\n Total: ' + poolTotal;
      console.log(output); 
    }
  }
  
  // Calculate Total Outside Usage
  else if(type === 'outside') {
    // Calculate
    outsideTotal = lawnTotal + hoseTotal + poolTotal;
    
    // Output
    usageOutput('outsideTotal', outsideTotal);
    
    // Debug
    if(debug) {
      output += '[---Outside Total---] ' + outsideTotal;
      console.log(output);
    }
  }

  
} // calculateUsage

