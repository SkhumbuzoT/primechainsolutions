// ==========================================
// PRIME CHAIN SOLUTIONS
// Route Profitability Calculator
// ==========================================

let revenueChart;
let costChart;

function money(value) {
    return "R " + value.toLocaleString('en-ZA', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function calculateRoute() {

    // =============================
    // INPUTS
    // =============================

    const distance = Number(document.getElementById("distance").value);

    const rate = Number(document.getElementById("rate").value);

    const payload = Number(document.getElementById("payload").value);

    const loads = Number(document.getElementById("loads").value);

    const days = Number(document.getElementById("days").value);

    const costPerKm = Number(document.getElementById("costkm").value);

    const fuelPrice = Number(document.getElementById("fuelprice").value);

    const fuelConsumption = Number(document.getElementById("fuelcons").value);

    const maintenance = Number(document.getElementById("maintenance").value);

    const insurance = Number(document.getElementById("insurance").value);

    const driverCost = Number(document.getElementById("driver").value);

    // =============================
    // REVENUE
    // =============================

    const revenuePerLoad = payload * rate;

    const revenuePerDay = revenuePerLoad * loads;

    const revenuePerMonth = revenuePerDay * days;

    // =============================
    // DISTANCE
    // =============================

    const roundTrip = distance * 2;

    const monthlyKm = roundTrip * loads * days;

    // =============================
    // COSTS
    // =============================

    const tripOperatingCost = roundTrip * costPerKm;

    const dailyOperatingCost =
        (tripOperatingCost * loads) + driverCost;

    const monthlyOperatingCost =
        dailyOperatingCost * days;

    // =============================
    // PROFIT
    // =============================

    const profitLoad =
        revenuePerLoad - tripOperatingCost;

    const dailyProfit =
        revenuePerDay - dailyOperatingCost;

    const monthlyProfit =
        revenuePerMonth - monthlyOperatingCost;

    const margin =
        (monthlyProfit / revenuePerMonth) * 100;

    // =============================
    // BREAK EVEN
    // =============================

    const breakEvenRate =
        tripOperatingCost / payload;

    const breakEvenLoads =
        Math.ceil(driverCost / profitLoad);

    // =============================
    // FUEL
    // =============================

    const litresTrip =
        (roundTrip / 100) * fuelConsumption;

    const fuelCostTrip =
        litresTrip * fuelPrice;

    // =============================
    // UPDATE KPI CARDS
    // =============================

    document.getElementById("revLoad").innerHTML =
        money(revenuePerLoad);

    document.getElementById("costLoad").innerHTML =
        money(tripOperatingCost);

    document.getElementById("profitLoad").innerHTML =
        money(profitLoad);

    document.getElementById("margin").innerHTML =
        margin.toFixed(1) + "%";

    document.getElementById("dailyRevenue").innerHTML =
        money(revenuePerDay);

    document.getElementById("dailyCost").innerHTML =
        money(dailyOperatingCost);

    document.getElementById("monthlyRevenue").innerHTML =
        money(revenuePerMonth);

    document.getElementById("monthlyProfit").innerHTML =
        money(monthlyProfit);

    // =============================
    // SCORE
    // =============================

    let recommendation = "";

    let stars = "";

    if (margin >= 35) {

        recommendation = "★★★★★ Highly Profitable";

        stars = "★★★★★";

    }

    else if (margin >= 25) {

        recommendation = "★★★★ Good Contract";

        stars = "★★★★";

    }

    else if (margin >= 15) {

        recommendation = "★★★ Accept with Caution";

        stars = "★★★";

    }

    else if (margin >= 5) {

        recommendation = "★★ Negotiate Rate";

        stars = "★★";

    }

    else {

        recommendation = "★ Reject Contract";

        stars = "★";

    }

    document.getElementById("recommendation").innerHTML =
        recommendation;

    document.getElementById("routeScore").innerHTML =
        stars;

    // =============================
    // AI INSIGHTS
    // =============================

    let html = "";

    html += `<div class="insight good">
    Revenue per Load:
    <strong>${money(revenuePerLoad)}</strong>
    </div>`;

    html += `<div class="insight">
    Operating Cost per Load:
    <strong>${money(tripOperatingCost)}</strong>
    </div>`;

    html += `<div class="insight">
    Break-even Rate:
    <strong>R ${breakEvenRate.toFixed(2)} / ton</strong>
    </div>`;

    html += `<div class="insight">
    Estimated Fuel Cost / Trip:
    <strong>${money(fuelCostTrip)}</strong>
    </div>`;

    html += `<div class="insight">
    Estimated Monthly Distance:
    <strong>${monthlyKm.toLocaleString()} km</strong>
    </div>`;

    if (margin > 35) {

        html += `<div class="insight good">

        Excellent contract.

        Margin exceeds industry target.

        </div>`;

    }

    if (margin < 25) {

        html += `<div class="insight warning">

        Consider negotiating a higher rate per ton.

        </div>`;

    }

    if (fuelCostTrip > (tripOperatingCost * .50)) {

        html += `<div class="insight warning">

        Fuel exceeds 50% of trip cost.

        </div>`;

    }

    if (breakEvenRate > rate) {

        html += `<div class="insight danger">

        WARNING:

        Contract is below break-even.

        </div>`;

    }

    document.getElementById("insights").innerHTML =
        html;
    let decision = "";

    let colour = "";
    
    if(margin>=35){
    
    decision="Highly Recommended";
    
    colour="#16a34a";
    
    }
    
    else if(margin>=20){
    
    decision="Recommended";
    
    colour="#f59e0b";
    
    }
    
    else{
    
    decision="Not Recommended";
    
    colour="#dc2626";
    
    }
    
    document.getElementById("decisionCard").innerHTML=`
    
    <h1 style="color:${colour}">
    
    ${decision}
    
    </h1>
    
    <p>
    
    Expected Monthly Revenue
    
    <strong>${money(revenuePerMonth)}</strong>
    
    </p>
    
    <p>
    
    Expected Monthly Profit
    
    <strong>${money(monthlyProfit)}</strong>
    
    </p>
    
    <p>
    
    Estimated Margin
    
    <strong>${margin.toFixed(1)}%</strong>
    
    </p>
    
    `;

    // =============================
    // CHARTS
    // =============================

    drawRevenueChart(
        revenuePerMonth,
        monthlyOperatingCost
    );

    drawCostChart(
        fuelCostTrip,
        maintenance * roundTrip,
        insurance * roundTrip,
        driverCost
    );

}

// ==========================================
// REVENUE CHART
// ==========================================

function drawRevenueChart(revenue, cost) {

    if (revenueChart)
        revenueChart.destroy();

    const ctx =
        document.getElementById("revenueChart");

    revenueChart =
        new Chart(ctx, {

        type: "bar",

        data: {

            labels: ["Revenue", "Cost"],

            datasets: [{

                label: "Monthly",

                data: [revenue, cost]

            }]

        }

    });

}

// ==========================================
// COST BREAKDOWN
// ==========================================

function drawCostChart(fuel, maintenance, insurance, driver) {

    if (costChart)
        costChart.destroy();

    const ctx =
        document.getElementById("costChart");

    costChart =
        new Chart(ctx, {

        type: "doughnut",

        data: {

            labels: [

                "Fuel",

                "Maintenance",

                "Insurance",

                "Driver"

            ],

            datasets: [{

                data: [

                    fuel,

                    maintenance,

                    insurance,

                    driver

                ]

            }]

        }

    });

}

// ==========================================
// AUTO LOAD
// ==========================================

window.onload = calculateRoute;

function resetCalculator(){

document.querySelectorAll("input").forEach(input=>{

input.value="";

});

location.reload();

}
