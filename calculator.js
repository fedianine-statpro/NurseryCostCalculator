document.addEventListener('DOMContentLoaded', function() {
    // Existing event listeners and functions here

    // Toggle between hourly and monthly rate inputs
    document.querySelectorAll('input[name="rateType"]').forEach(function(radio) {
        radio.addEventListener('change', function() {
            if (this.value === 'hourly') {
                document.getElementById('hourlyRateGroup').classList.remove('d-none');
                document.getElementById('monthlyRateGroup').classList.add('d-none');
            } else if (this.value === 'monthly') {
                document.getElementById('monthlyRateGroup').classList.remove('d-none');
                document.getElementById('hourlyRateGroup').classList.add('d-none');
            }
        });
    });
});

// Function to calculate various cost metrics related to government funding.
function calculateCost() {
    // Constants representing weeks per year and months per year.
    const fundedWeeksPerYear = 38;
    const totalWeeksPerYear = 52;
    const totalMonthsPerYear = 12;

    // Calculating the average number of weeks in a month.
    const weeksInMonth = totalWeeksPerYear / totalMonthsPerYear;

    // Retrieving user input for the rate type (monthly or hourly).
    var rateType = document.querySelector('input[name="rateType"]:checked').value;

    // Parsing user input for government rate, weekly funded hours, and weekly hours.
    var governmentRate = parseFloat(document.getElementById('governmentRate').value);
    var weeklyFundedHours = parseInt(document.getElementById('weeklyFundedHours').value);
    var weeklyHours = parseFloat(document.getElementById('weeklyHours').value);

    // Determining the hourly rate based on the selected rate type.
    var hourlyRate = rateType === 'monthly' 
        ? parseFloat(document.getElementById('monthlyRate').value) / (weeklyHours * weeksInMonth) 
        : parseFloat(document.getElementById('hourlyRate').value); 

    // Adjusting the weekly funded hours to a yearly scale and then averaging it.
    const adjustedWeeklyFundedHours = weeklyFundedHours * fundedWeeksPerYear / totalWeeksPerYear;

    // Calculating weekly government funding, ensuring it doesn't exceed the actual weekly hours.
    const weeklyGovernmentFunding = Math.min(adjustedWeeklyFundedHours, weeklyHours) * governmentRate;

    // Calculating total annual and average monthly government funding.
    const totalAnnualGovernmentFunding = weeklyGovernmentFunding * totalWeeksPerYear;
    const averageMonthlyGovernmentFunding = totalAnnualGovernmentFunding / totalMonthsPerYear;

    // Calculating total weekly and monthly costs without government funding.
    const totalWeeklyCostWithoutFunding = weeklyHours * hourlyRate;
    const totalMonthlyCostWithoutFunding = totalWeeklyCostWithoutFunding * weeksInMonth;

    // Calculating total monthly cost after applying government funding.
    const totalMonthlyCostWithFunding = Math.max(totalMonthlyCostWithoutFunding - averageMonthlyGovernmentFunding, 0);

    // Determining total monthly savings due to government funding.
    const totalMonthlySavings = totalMonthlyCostWithoutFunding < averageMonthlyGovernmentFunding 
                                ? totalMonthlyCostWithoutFunding 
                                : averageMonthlyGovernmentFunding;

    // Displaying the calculated costs and savings in the HTML document.
	document.getElementById('result').innerHTML = `<h4>Total Monthly Cost without Funding: £${totalMonthlyCostWithoutFunding.toFixed(2)}</h4><h4>Total Monthly Cost with Funding: £${totalMonthlyCostWithFunding.toFixed(2)}</h4><h4>Total Monthly Savings: £${totalMonthlySavings.toFixed(2)}</h4>`;
}


$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})
