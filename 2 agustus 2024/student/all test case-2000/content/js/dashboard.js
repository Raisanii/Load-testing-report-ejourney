/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 77.00166666666667, "KoPercent": 22.998333333333335};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.08465, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0445, 500, 1500, "Submit score (retake quiz)"], "isController": false}, {"data": [0.14675, 500, 1500, "view data in market place"], "isController": false}, {"data": [0.10925, 500, 1500, "add to cart"], "isController": false}, {"data": [0.0, 500, 1500, "Submit subjourney quiz"], "isController": false}, {"data": [0.1315, 500, 1500, "Play subjourney video"], "isController": false}, {"data": [0.1975, 500, 1500, "view data my collection"], "isController": false}, {"data": [0.0562, 500, 1500, "Submit score quiz"], "isController": false}, {"data": [0.1055, 500, 1500, "Play subjourney quiz"], "isController": false}, {"data": [0.004, 500, 1500, "login"], "isController": false}, {"data": [5.0E-4, 500, 1500, "reedem-coupon"], "isController": false}, {"data": [0.121, 500, 1500, "Play subjourney interactive learning"], "isController": false}, {"data": [0.17675, 500, 1500, "view detail course"], "isController": false}, {"data": [0.00375, 500, 1500, "edit profile"], "isController": false}, {"data": [0.1735, 500, 1500, "Submit score interactive learning"], "isController": false}, {"data": [2.5E-4, 500, 1500, "payment success"], "isController": false}, {"data": [0.2215, 500, 1500, "get cart"], "isController": false}, {"data": [0.1075, 500, 1500, "Submit score (video)"], "isController": false}, {"data": [0.21, 500, 1500, "Submit score (retake interactive learning)"], "isController": false}, {"data": [0.12775, 500, 1500, "market place - searching course"], "isController": false}, {"data": [0.0, 500, 1500, "register"], "isController": false}, {"data": [5.0E-4, 500, 1500, "cekout cart"], "isController": false}, {"data": [0.1985, 500, 1500, "add to interest"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 60000, 13799, 22.998333333333335, 5186.412899999936, 19, 92363, 2223.0, 3548.0, 3912.9500000000007, 4647.0, 337.05782226941034, 125.89276435164119, 94.15208299100898], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Submit score (retake quiz)", 10000, 0, 0.0, 2590.035899999995, 117, 6695, 2482.0, 3833.0, 4320.949999999999, 5237.959999999999, 130.73091655445594, 37.27873792373158, 33.576397513497966], "isController": false}, {"data": ["view data in market place", 2000, 0, 0.0, 1969.4950000000003, 22, 4251, 2067.0, 2815.0, 2992.8999999999996, 3255.9700000000003, 101.30685847431872, 40.81736431212643, 19.584030477535205], "isController": false}, {"data": ["add to cart", 2000, 0, 0.0, 2043.6964999999987, 60, 3970, 2039.5, 2833.0, 3067.8999999999996, 3469.0, 84.5058520302531, 30.369290573372204, 19.47212066115266], "isController": false}, {"data": ["Submit subjourney quiz", 2000, 2000, 100.0, 2285.7644999999998, 43, 5464, 2191.5, 3575.3000000000006, 4012.749999999999, 4833.83, 28.415952715854683, 8.324986147223052, 6.687738871602518], "isController": false}, {"data": ["Play subjourney video", 2000, 0, 0.0, 2405.6630000000005, 82, 6711, 2285.5, 3984.0, 4495.949999999996, 5476.9400000000005, 30.41038818860523, 19.065887907309136, 5.998924232517829], "isController": false}, {"data": ["view data my collection", 2000, 0, 0.0, 1915.3424999999988, 30, 8400, 1757.0, 3249.9, 3459.0, 3877.99, 30.368829433469486, 13.04910639719392, 5.634841398788284], "isController": false}, {"data": ["Submit score quiz", 10000, 0, 0.0, 2677.5654999999906, 41, 6708, 2602.0, 4002.0, 4423.0, 5293.0, 125.13295376337358, 35.682443846587, 32.138639491960205], "isController": false}, {"data": ["Play subjourney quiz", 2000, 0, 0.0, 2600.195999999999, 59, 6990, 2464.0, 4219.200000000002, 4782.799999999996, 5647.93, 28.825504806652926, 18.072240318233575, 5.686281221624894], "isController": false}, {"data": ["login", 2000, 1990, 99.5, 2308.6985000000036, 128, 6219, 2376.5, 3687.9, 4149.0, 5912.89, 116.8019622729662, 47.133755128336155, 46.81734043756935], "isController": false}, {"data": ["reedem-coupon", 2000, 1999, 99.95, 1875.9369999999988, 55, 5430, 1734.5, 3228.8, 3633.95, 3928.0, 31.517405487180294, 11.70002115113384, 8.58583063629702], "isController": false}, {"data": ["Play subjourney interactive learning", 2000, 0, 0.0, 2353.249000000004, 56, 6660, 2255.0, 3771.3000000000015, 4283.349999999998, 5169.55, 29.57486136783734, 18.542051756007393, 5.834103512014788], "isController": false}, {"data": ["view detail course", 2000, 0, 0.0, 1969.2969999999998, 25, 5079, 1836.0, 3373.9, 3568.899999999996, 4038.95, 32.61791375823602, 8.727840204840499, 6.434393143714527], "isController": false}, {"data": ["edit profile", 2000, 1907, 95.35, 1496.0424999999989, 19, 5450, 1458.5, 2674.6000000000004, 2998.0, 4093.9300000000003, 32.439621754010346, 5.467264239980212, 17.556678101633334], "isController": false}, {"data": ["Submit score interactive learning", 2000, 0, 0.0, 2058.852499999999, 26, 5781, 1965.5, 3447.4000000000005, 3866.3499999999976, 4819.9400000000005, 30.21284952490294, 12.713280884141275, 7.966278683324018], "isController": false}, {"data": ["payment success", 2000, 1998, 99.9, 11636.804999999995, 222, 32876, 11379.5, 22183.800000000003, 30868.499999999993, 32341.9, 35.57326313542741, 12.985005313756181, 34.07798757047953], "isController": false}, {"data": ["get cart", 2000, 0, 0.0, 1574.8889999999983, 39, 3340, 1571.0, 2201.9, 2348.0, 2840.75, 80.57368463459834, 35.90045498952542, 14.55311033307147], "isController": false}, {"data": ["Submit score (video)", 2000, 0, 0.0, 2414.7894999999994, 79, 5627, 2358.5, 3809.3000000000006, 4255.799999999999, 4893.89, 29.721215003269336, 12.53518364924508, 7.865673111216786], "isController": false}, {"data": ["Submit score (retake interactive learning)", 2000, 0, 0.0, 1880.9704999999985, 24, 5480, 1857.5, 3119.9, 3632.95, 4637.570000000001, 30.996698851572308, 13.073084767253539, 8.203227918726656], "isController": false}, {"data": ["market place - searching course", 2000, 0, 0.0, 1925.6950000000006, 51, 3745, 1970.0, 2768.8, 2816.95, 3190.92, 91.80207472688882, 34.51247002088497, 21.153340663155237], "isController": false}, {"data": ["register", 2000, 1907, 95.35, 81044.26549999995, 70212, 92363, 81395.0, 88432.2, 89283.34999999999, 90800.94, 21.63003979927323, 11.3343837703052, 7.264081324894013], "isController": false}, {"data": ["cekout cart", 2000, 1998, 99.9, 1600.6225000000004, 272, 3196, 1583.0, 2201.9, 2330.0, 2735.98, 76.38835841417769, 27.837514203460394, 17.601884464995035], "isController": false}, {"data": ["add to interest", 2000, 0, 0.0, 1894.1090000000006, 38, 5171, 1766.5, 3104.7000000000003, 3644.3499999999976, 4246.95, 33.08191081116845, 14.478214269468705, 7.784377145155154], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400/Bad Request", 7694, 55.75766359881151, 12.823333333333334], "isController": false}, {"data": ["500/Internal Server Error", 2116, 15.334444524965578, 3.526666666666667], "isController": false}, {"data": ["401/Unauthorized", 1990, 14.421334879339083, 3.316666666666667], "isController": false}, {"data": ["404/Not Found", 1999, 14.486556996883833, 3.3316666666666666], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 60000, 13799, "400/Bad Request", 7694, "500/Internal Server Error", 2116, "404/Not Found", 1999, "401/Unauthorized", 1990, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Submit subjourney quiz", 2000, 2000, "400/Bad Request", 2000, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["login", 2000, 1990, "401/Unauthorized", 1990, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["reedem-coupon", 2000, 1999, "404/Not Found", 1999, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["edit profile", 2000, 1907, "400/Bad Request", 1907, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["payment success", 2000, 1998, "400/Bad Request", 1880, "500/Internal Server Error", 118, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["register", 2000, 1907, "400/Bad Request", 1907, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["cekout cart", 2000, 1998, "500/Internal Server Error", 1998, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
