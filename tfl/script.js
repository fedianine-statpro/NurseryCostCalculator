const stationZoneMap = {
    "Acton Town": 3,
    "Aldgate": 1,
    "Aldgate East": 1,
    "Angel": 1,
    "Baker Street": 1,
    "Balham": 3,
    "Bank": 1,
    "Barbican": 1,
    "Barking": 4,
    "Barkingside": 4,
    "Barons Court": 2,
    "Bayswater": 1,
    "Beckton": 3,
    "Beckton Park": 3,
    "Becontree": 5,
    "Belsize Park": 2,
    "Bethnal Green": 2,
    "Blackfriars": 1,
    "Blackhorse Road": 3,
    "Bond Street": 1,
    "Borough": 1,
    "Boston Manor": 4,
    "Bounds Green": 3,
    "Bow Church": 2,
    "Bow Road": 2,
    "Brent Cross": 3,
    "Brixton": 2,
    "Bromley-by-Bow": 2,
    "Brondesbury": 2,
    "Brondesbury Park": 2,
    "Buckhurst Hill": 5,
    "Burnt Oak": 4,
    "Caledonian Road": 2,
    "Camden Town": 2,
    "Canada Water": 2,
    "Canary Wharf": 2,
    "Canning Town": 3,
    "Cannon Street": 1,
    "Canons Park": 5,
    "Chalk Farm": 2,
    "Chancery Lane": 1,
    "Charing Cross": 1,
    "Chesham": 9,
    "Chigwell": 4,
    "Chiswick Park": 3,
    "Chorleywood": 7,
    "Clapham Common": 2,
    "Clapham North": 2,
    "Clapham South": 2,
    "Cockfosters": 5,
    "Colindale": 4,
    "Colliers Wood": 3,
    "Covent Garden": 1,
    "Crossharbour": 2,
    "Custom House": 3,
    "Cutty Sark": 2,
    "Cyprus": 3,
    "Dagenham East": 5,
    "Dagenham Heathway": 5,
    "Debden": 6,
    "Deptford Bridge": 2,
    "Devons Road": 2,
    "Dollis Hill": 3,
    "Ealing Broadway": 3,
    "Ealing Common": 3,
    "Earl's Court": 1,
    "East Acton": 2,
    "East Finchley": 3,
    "East Ham": 3,
    "East India": 2,
    "East Putney": 2,
    "Eastcote": 5,
    "Edgware": 5,
    "Edgware Road": 1,
    "Elephant & Castle": 1,
    "Elm Park": 6,
    "Embankment": 1,
    "Epping": 6,
    "Euston": 1,
    "Euston Square": 1,
    "Fairlop": 4,
    "Farringdon": 1,
    "Finchley Central": 4,
    "Finchley Road": 2,
    "Finsbury Park": 2,
    "Fulham Broadway": 2,
    "Gallions Reach": 3,
    "Gants Hill": 4,
    "Gloucester Road": 1,
    "Golders Green": 3,
    "Goldhawk Road": 2,
    "Goodge Street": 1,
    "Grange Hill": 4,
    "Great Portland Street": 1,
    "Greenford": 4,
    "Greenwich": 2,
    "Gunnersbury": 3,
    "Hainault": 4,
    "Hammersmith": 2,
    "Hampstead": 2,
    "Hanger Lane": 3,
    "Harlesden": 3,
    "Harrow & Wealdstone": 5,
    "Harrow-on-the-Hill": 5,
    "Hatton Cross": 5,
    "Heathrow Terminals 2 & 3": 6,
    "Heathrow Terminal 4": 6,
    "Heathrow Terminal 5": 6,
    "Hendon Central": 3,
    "Heron Quays": 2,
    "High Barnet": 5,
    "High Street Kensington": 1,
    "Highbury & Islington": 2,
    "Highgate": 3,
    "Hillingdon": 6,
    "Holborn": 1,
    "Holland Park": 2,
    "Holloway Road": 2,
    "Hornchurch": 6,
    "Hounslow Central": 4,
    "Hounslow East": 4,
    "Hounslow West": 5,
    "Hyde Park Corner": 1,
    "Ickenham": 6,
    "Island Gardens": 2,
    "Kennington": 2,
    "Kensal Green": 2,
    "Kensington (Olympia)": 2,
    "Kentish Town": 2,
    "Kenton": 4,
    "Kew Gardens": 3,
    "Kilburn": 2,
    "Kilburn Park": 2,
    "King's Cross St. Pancras": 1,
    "Kingsbury": 4,
    "Knightsbridge": 1,
    "Ladbroke Grove": 2,
    "Lambeth North": 1,
    "Lancaster Gate": 1,
    "Latimer Road": 2,
    "Leicester Square": 1,
    "Lewisham": 2,
    "Leyton": 3,
    "Leytonstone": 3,
    "Limehouse": 2,
    "Liverpool Street": 1,
    "London Bridge": 1,
    "Loughton": 6,
    "Maida Vale": 2,
    "Manor House": 2,
    "Mansion House": 1,
    "Marble Arch": 1,
    "Marylebone": 1,
    "Mile End": 2,
    "Mill Hill East": 4,
    "Monument": 1,
    "Moor Park": 6,
    "Moorgate": 1,
    "Morden": 4,
    "Mornington Crescent": 2,
    "Mudchute": 2,
    "Neasden": 3,
    "Newbury Park": 4,
    "North Acton": 2,
    "North Ealing": 3,
    "North Greenwich": 2,
    "North Harrow": 5,
    "North Wembley": 4,
    "Northfields": 3,
    "Northolt": 5,
    "Northwick Park": 4,
    "Northwood": 6,
    "Northwood Hills": 6,
    "Notting Hill Gate": 1,
    "Oakwood": 5,
    "Old Street": 1,
    "Osterley": 4,
    "Oval": 2,
    "Oxford Circus": 1,
    "Paddington": 1,
    "Park Royal": 3,
    "Parsons Green": 2,
    "Perivale": 4,
    "Piccadilly Circus": 1,
    "Pimlico": 1,
    "Pinner": 5,
    "Plaistow": 3,
    "Poplar": 2,
    "Preston Road": 4,
    "Putney Bridge": 2,
    "Queen's Park": 2,
    "Queensbury": 4,
    "Queensway": 1,
    "Ravenscourt Park": 2,
    "Rayners Lane": 5,
    "Redbridge": 4,
    "Regent's Park": 1,
    "Richmond": 4,
    "Rickmansworth": 7,
    "Roding Valley": 4,
    "Royal Oak": 2,
    "Royal Victoria": 3,
    "Ruislip": 6,
    "Ruislip Gardens": 5,
    "Ruislip Manor": 6,
    "Russell Square": 1,
    "Seven Sisters": 3,
    "Shadwell": 2,
    "Shepherd's Bush": 2,
    "Shoreditch High Street": 1,
    "Sloane Square": 1,
    "Snaresbrook": 4,
    "South Acton": 3,
    "South Ealing": 3,
    "South Harrow": 5,
    "South Kensington": 1,
    "South Kenton": 4,
    "South Quay": 2,
    "South Ruislip": 5,
    "South Wimbledon": 3,
    "South Woodford": 4,
    "Southfields": 3,
    "St. James's Park": 1,
    "St. John's Wood": 2,
    "St. Paul's": 1,
    "Stamford Brook": 2,
    "Stanmore": 5,
    "Stepney Green": 2,
    "Stockwell": 2,
    "Stonebridge Park": 3,
    "Stratford": 3,
    "Sudbury Hill": 4,
    "Sudbury Town": 4,
    "Surrey Quays": 2,
    "Swiss Cottage": 2,
    "Temple": 1,
    "Theydon Bois": 6,
    "Tooting Bec": 3,
    "Tooting Broadway": 3,
    "Tottenham Court Road": 1,
    "Tottenham Hale": 3,
    "Totteridge & Whetstone": 4,
    "Tower Gateway": 1,
    "Tower Hill": 1,
    "Tufnell Park": 2,
    "Turnham Green": 2,
    "Turnpike Lane": 3,
    "Upminster": 6,
    "Upminster Bridge": 6,
    "Upney": 4,
    "Upton Park": 3,
    "Uxbridge": 6,
    "Vauxhall": 1,
    "Victoria": 1,
    "Walthamstow Central": 3,
    "Wanstead": 4,
    "Wapping": 2,
    "Warren Street": 1,
    "Warwick Avenue": 2,
    "Waterloo": 1,
    "Watford": 7,
    "Wembley Central": 4,
    "Wembley Park": 4,
    "West Acton": 3,
    "West Brompton": 2,
    "West Finchley": 4,
    "West Ham": 3,
    "West Hampstead": 2,
    "West Harrow": 5,
    "West Kensington": 2,
    "West Ruislip": 6,
    "Westbourne Park": 2,
    "Westminster": 1,
    "White City": 2,
    "Whitechapel": 2,
    "Willesden Green": 2,
    "Willesden Junction": 3,
    "Wimbledon": 3,
    "Wimbledon Park": 3,
    "Wood Green": 3,
    "Woodford": 4,
    "Woodside Park": 4,
    "Woolwich Arsenal": 4
};

const dailyFareCap = 13.10;  // Example value
const weeklyFareCap = 40.00;
const monthlyFareCap = 150.00;
const annualFareCap = 1600.00;

document.getElementById('addDayBtn').addEventListener('click', addDay);

let dayCount = 0;

function showTravelDetails() {
    const passengerType = document.getElementById('passengerType').value;
    if (passengerType) {
        document.getElementById('travelDetails').classList.remove('hidden');
        if (dayCount === 0) {
            addDay();
        }
    } else {
        document.getElementById('travelDetails').classList.add('hidden');
    }
}

function addDay() {
    dayCount++;
    const daysContainer = document.getElementById('daysContainer');

    const dayDiv = document.createElement('div');
    dayDiv.classList.add('day');
    dayDiv.innerHTML = `
        <h3>Day ${dayCount}</h3>
        <div id="tripsContainer${dayCount}"></div>
        <button onclick="addTrip(${dayCount}); calculateCosts();">Add Trip</button>
    `;
    daysContainer.appendChild(dayDiv);
    addTrip(dayCount);
}

function addTrip(dayId) {
    const tripsContainer = document.getElementById(`tripsContainer${dayId}`);
    const tripCount = tripsContainer.children.length + 1;

    const tripDiv = document.createElement('div');
    tripDiv.classList.add('trip');
    tripDiv.innerHTML = `
        <h4>Trip ${tripCount}</h4>
        <label for="tripType${dayId}-${tripCount}">Transport Type:</label>
        <select id="tripType${dayId}-${tripCount}" onchange="updateTripFields(${dayId}, ${tripCount}); calculateCosts();">
            <option value="tube">Tube</option>
            <option value="bus">Bus</option>
            <option value="tram">Tram</option>
            <option value="dlr">DLR</option>
            <option value="overground">Overground</option>
            <option value="national-rail">National Rail</option>
            <option value="river-bus">River Bus</option>
            <option value="cable-car">Cable Car</option>
        </select>
        <div id="zoneFields${dayId}-${tripCount}">
            <label for="startStation${dayId}-${tripCount}">Start Station:</label>
            <select id="startStation${dayId}-${tripCount}" onchange="calculateCosts()">
                ${generateStationOptions()}
            </select>
            <label for="endStation${dayId}-${tripCount}">End Station:</label>
            <select id="endStation${dayId}-${tripCount}" onchange="calculateCosts()">
                ${generateStationOptions()}
            </select>
        </div>
        <label for="time${dayId}-${tripCount}">Time of Travel:</label>
        <select id="time${dayId}-${tripCount}" onchange="calculateCosts()">
            <option value="peak">Peak</option>
            <option value="off-peak">Off-Peak</option>
        </select>
        <p class="time-explanation" id="timeExplanation${dayId}-${tripCount}">Peak: £2.10 Monday to Thursday from 06:30 to 09:30 and from 16:00 to 19:00. Off-Peak: £1.90 at all other times including public holidays.</p>
        <button class="removeBtn" onclick="removeTrip(this, ${dayId}); calculateCosts();">Remove Trip</button>
    `;
    tripsContainer.appendChild(tripDiv);
    updateTripFields(dayId, tripCount);
    calculateCosts(); // Immediately calculate costs when trip is added
}

function generateStationOptions() {
    let options = '';
    for (const station in stationZoneMap) {
        options += `<option value="${station}">${station}</option>`;
    }
    return options;
}

function updateTripFields(dayId, tripCount) {
    const tripType = document.getElementById(`tripType${dayId}-${tripCount}`).value;
    const zoneFields = document.getElementById(`zoneFields${dayId}-${tripCount}`);
    const timeExplanation = document.getElementById(`timeExplanation${dayId}-${tripCount}`);
    
    if (tripType === 'bus' || tripType === 'tram') {
        zoneFields.classList.add('hidden');
        timeExplanation.textContent = "Bus/Tram: Peak: £2.10 Monday to Thursday from 06:30 to 09:30 and from 16:00 to 19:00. Off-Peak: £1.90 at all other times including public holidays.";
    } else {
        zoneFields.classList.remove('hidden');
        timeExplanation.textContent = "Tube/DLR/Overground/National Rail: Peak: £2.50 Monday to Thursday from 06:30 to 09:30 and from 16:00 to 19:00. Off-Peak: £2.40 at all other times including public holidays.";
    }
}

function removeTrip(button, dayId) {
    const tripDiv = button.parentElement;
    const tripsContainer = document.getElementById(`tripsContainer${dayId}`);
    tripsContainer.removeChild(tripDiv);
    calculateCosts();
}

function calculateCosts() {
    const passengerType = document.getElementById('passengerType').value;
    const days = document.querySelectorAll('.day');
    let totalCost = 0;
    let totalCostPerDay = {};
    const costDetails = [];

    days.forEach(day => {
        const dayId = day.querySelector('h3').innerText.split(' ')[1];
        const trips = day.querySelectorAll('.trip');
        let dayCost = 0;

        trips.forEach((trip, index) => {
            const tripType = trip.querySelector(`#tripType${dayId}-${index + 1}`).value;
            const startStation = trip.querySelector(`#startStation${dayId}-${index + 1}`)?.value || 'N/A';
            const endStation = trip.querySelector(`#endStation${dayId}-${index + 1}`)?.value || 'N/A';
            const time = trip.querySelector(`#time${dayId}-${index + 1}`).value;

            const startZone = stationZoneMap[startStation] || 0;
            const endZone = stationZoneMap[endStation] || 0;

            const tripCost = calculateTripCost(passengerType, tripType, startZone, endZone, time);
            dayCost += tripCost;

            let detail = `Trip ${index + 1} (${capitalizeFirstLetter(tripType)}): `;
            if (tripType !== 'bus' && tripType !== 'tram') {
                detail += `Start Station: ${startStation}, End Station: ${endStation}, `;
            }
            detail += `${capitalizeFirstLetter(time)}. Cost: £${tripCost.toFixed(2)}`;

            costDetails.push(detail);
        });

        totalCostPerDay[dayId] = dayCost > dailyFareCap ? dailyFareCap : dayCost;
    });

    totalCost = Object.values(totalCostPerDay).reduce((a, b) => a + b, 0);

    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `
        <h3>Total Cost: £${totalCost.toFixed(2)}</h3>
        <h3>Cost Details:</h3>
        <ul>${costDetails.map(detail => `<li>${detail}</li>`).join('')}</ul>
    `;

    compareWithPasses(totalCost);
}

function calculateTripCost(passengerType, tripType, startZone, endZone, time) {
    let tripCost;
    if (tripType === 'bus' || tripType === 'tram') {
        tripCost = time === 'peak' ? 2.10 : 1.90;
    } else {
        tripCost = time === 'peak' ? 2.50 : 2.40;
    }
    return tripCost;
}

function compareWithPasses(totalCost) {
    const dailyPassCost = 13.10;  // Example values
    const weeklyPassCost = 40.00;
    const monthlyPassCost = 150.00;
    const annualPassCost = 1600.00;

    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML += `
        <h3>Pass Comparison:</h3>
        <p>Daily Pass: £${dailyPassCost.toFixed(2)} (Cheaper: ${totalCost > dailyPassCost})</p>
        <p>Weekly Pass: £${weeklyPassCost.toFixed(2)} (Cheaper: ${totalCost > weeklyPassCost})</p>
        <p>Monthly Pass: £${monthlyPassCost.toFixed(2)} (Cheaper: ${totalCost > monthlyPassCost})</p>
        <p>Annual Pass: £${annualPassCost.toFixed(2)} (Cheaper: ${totalCost > annualPassCost})</p>
    `;

    displayPricingAssumptions();
}

function displayPricingAssumptions() {
    const assumptionsDiv = document.getElementById('assumptions');
    assumptionsDiv.innerHTML = `
        <p>Assumptions are made based on the following fare structure:</p>
        <ul>
            <li>Bus/Tram Peak: £2.10</li>
            <li>Bus/Tram Off-Peak: £1.90</li>
            <li>Tube/DLR/Overground/National Rail Peak: £2.50</li>
            <li>Tube/DLR/Overground/National Rail Off-Peak: £2.40</li>
            <li>Daily fare cap: £13.10</li>
            <li>Weekly fare cap: £40.00</li>
            <li>Monthly fare cap: £150.00</li>
            <li>Annual fare cap: £1600.00</li>
        </ul>
    `;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
