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

    var data = {"OkPercent": 79.25333333333333, "KoPercent": 20.746666666666666};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.12214166666666666, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.1691, 500, 1500, "Submit score (retake quiz)"], "isController": false}, {"data": [0.073, 500, 1500, "view data in market place"], "isController": false}, {"data": [0.0175, 500, 1500, "add to cart"], "isController": false}, {"data": [0.0, 500, 1500, "Submit subjourney quiz"], "isController": false}, {"data": [0.1545, 500, 1500, "Play subjourney video"], "isController": false}, {"data": [0.22475, 500, 1500, "view data my collection"], "isController": false}, {"data": [0.15585, 500, 1500, "Submit score quiz"], "isController": false}, {"data": [0.12675, 500, 1500, "Play subjourney quiz"], "isController": false}, {"data": [0.00825, 500, 1500, "login"], "isController": false}, {"data": [0.0, 500, 1500, "reedem-coupon"], "isController": false}, {"data": [0.13675, 500, 1500, "Play subjourney interactive learning"], "isController": false}, {"data": [0.22725, 500, 1500, "view detail course"], "isController": false}, {"data": [0.11375, 500, 1500, "edit profile"], "isController": false}, {"data": [0.17325, 500, 1500, "Submit score interactive learning"], "isController": false}, {"data": [0.0, 500, 1500, "payment success"], "isController": false}, {"data": [0.15125, 500, 1500, "get cart"], "isController": false}, {"data": [0.162, 500, 1500, "Submit score (video)"], "isController": false}, {"data": [0.2315, 500, 1500, "Submit score (retake interactive learning)"], "isController": false}, {"data": [0.05475, 500, 1500, "market place - searching course"], "isController": false}, {"data": [0.0, 500, 1500, "register"], "isController": false}, {"data": [0.0, 500, 1500, "cekout cart"], "isController": false}, {"data": [0.18425, 500, 1500, "add to interest"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 60000, 12448, 20.746666666666666, 5029.811866666693, 23, 91248, 1720.0, 2925.0, 3266.0, 3873.0, 336.802398033074, 129.42608454757615, 94.04021797781034], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Submit score (retake quiz)", 10000, 0, 0.0, 1839.3923000000023, 364, 5502, 1709.0, 2744.8999999999996, 3289.0, 4375.0, 154.4998068752414, 44.05658555426806, 39.68110274237158], "isController": false}, {"data": ["view data in market place", 2000, 0, 0.0, 2236.665499999996, 60, 4085, 2290.5, 3098.0, 3287.0, 3396.96, 111.42061281337047, 47.39875304665738, 21.502654944289695], "isController": false}, {"data": ["add to cart", 2000, 0, 0.0, 2236.349999999997, 324, 4079, 2164.5, 2856.0, 3055.0, 3761.0, 117.08916339792752, 42.0789180961302, 26.94171338036415], "isController": false}, {"data": ["Submit subjourney quiz", 2000, 2000, 100.0, 1880.084499999999, 488, 5487, 1684.5, 2929.9, 3660.0, 4915.88, 34.11921252857484, 9.99586304548091, 8.030009979869664], "isController": false}, {"data": ["Play subjourney video", 2000, 0, 0.0, 2104.2755000000006, 111, 5480, 1930.5, 3335.2000000000007, 3819.5499999999984, 4892.370000000001, 37.2904741483788, 23.3793793000578, 7.356128689426286], "isController": false}, {"data": ["view data my collection", 2000, 0, 0.0, 1645.3215, 129, 3600, 1562.5, 2826.9, 2917.0, 3299.91, 40.38853773299138, 17.354449807144732, 7.493966962176135], "isController": false}, {"data": ["Submit score quiz", 10000, 0, 0.0, 1851.1996000000001, 244, 5491, 1799.0, 2634.0, 2905.949999999999, 3852.9699999999993, 159.36508948349777, 45.44395129802865, 40.93068216226553], "isController": false}, {"data": ["Play subjourney quiz", 2000, 0, 0.0, 2207.7660000000024, 360, 5266, 2060.0, 3447.9, 3781.7999999999993, 4280.9400000000005, 35.46476575522219, 22.234745717629536, 6.995979182182502], "isController": false}, {"data": ["login", 2000, 1978, 98.9, 2615.429000000003, 216, 4174, 2851.5, 3772.0, 3940.0, 4085.0, 136.49082099228826, 55.594150941786665, 54.70915992032348], "isController": false}, {"data": ["reedem-coupon", 2000, 2000, 100.0, 1771.4040000000002, 238, 3997, 1769.5, 2693.4000000000005, 2893.8499999999995, 3284.0, 40.08578357685447, 14.875583749223338, 10.9068562974766], "isController": false}, {"data": ["Play subjourney interactive learning", 2000, 0, 0.0, 2116.409, 446, 5849, 1974.0, 3450.9, 3873.0, 4960.82, 34.265350877192986, 21.48276881167763, 6.759375856633771], "isController": false}, {"data": ["view detail course", 2000, 0, 0.0, 1758.0755000000004, 141, 4339, 1614.0, 2821.0, 2983.699999999999, 3534.8500000000004, 38.6884611664571, 10.352185898055906, 7.631903472289389], "isController": false}, {"data": ["edit profile", 2000, 1236, 61.8, 1439.202000000002, 23, 4668, 1266.0, 2742.0, 3063.699999999999, 3806.9700000000003, 36.783638637534025, 6.090925131501508, 19.87155253968035], "isController": false}, {"data": ["Submit score interactive learning", 2000, 0, 0.0, 1945.838500000001, 190, 5496, 1756.0, 3067.5000000000005, 3752.399999999994, 4445.0, 34.994400895856664, 14.725790846120871, 9.227039298712207], "isController": false}, {"data": ["payment success", 2000, 1999, 99.95, 16648.338000000014, 407, 32758, 13410.0, 31921.8, 32130.85, 32355.87, 41.569670768207516, 14.667781199336963, 39.808582220911624], "isController": false}, {"data": ["get cart", 2000, 0, 0.0, 1755.4845000000016, 54, 3947, 1737.0, 2393.0, 2687.0, 3332.99, 112.17049915872126, 49.96483717750982, 20.223333216489067], "isController": false}, {"data": ["Submit score (video)", 2000, 0, 0.0, 1996.6550000000002, 257, 5611, 1879.0, 3076.8, 3387.7999999999993, 4341.0, 36.639431356025355, 15.453020091003188, 9.696568259260616], "isController": false}, {"data": ["Submit score (retake interactive learning)", 2000, 0, 0.0, 1843.2314999999965, 125, 5167, 1607.0, 3026.7000000000003, 3663.0, 4365.98, 35.98869954834182, 15.178497623621183, 9.524353103125618], "isController": false}, {"data": ["market place - searching course", 2000, 0, 0.0, 2286.6144999999988, 69, 4125, 2263.0, 3079.0, 3257.0, 3675.95, 104.87127051544229, 39.66243740496041, 24.130428726862775], "isController": false}, {"data": ["register", 2000, 1236, 61.8, 80173.94200000007, 68078, 91248, 80466.0, 87119.9, 88336.25, 89960.3, 21.838352514686292, 18.19525039718504, 7.334039610676771], "isController": false}, {"data": ["cekout cart", 2000, 1999, 99.95, 1745.4620000000002, 338, 4516, 1678.0, 2372.0, 2598.8999999999996, 3242.63, 105.84250635055038, 38.56243550222269, 24.354060961976078], "isController": false}, {"data": ["add to interest", 2000, 0, 0.0, 2034.847999999999, 138, 5028, 1765.5, 3660.6000000000004, 3998.8999999999996, 4666.96, 41.0719786425711, 18.014955975972892, 9.65103257521306], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400/Bad Request", 5638, 45.29241645244216, 9.396666666666667], "isController": false}, {"data": ["500/Internal Server Error", 2832, 22.750642673521853, 4.72], "isController": false}, {"data": ["401/Unauthorized", 1978, 15.890102827763496, 3.296666666666667], "isController": false}, {"data": ["404/Not Found", 2000, 16.066838046272494, 3.3333333333333335], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 60000, 12448, "400/Bad Request", 5638, "500/Internal Server Error", 2832, "404/Not Found", 2000, "401/Unauthorized", 1978, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Submit subjourney quiz", 2000, 2000, "400/Bad Request", 2000, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["login", 2000, 1978, "401/Unauthorized", 1978, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["reedem-coupon", 2000, 2000, "404/Not Found", 2000, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["edit profile", 2000, 1236, "400/Bad Request", 1236, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["payment success", 2000, 1999, "400/Bad Request", 1166, "500/Internal Server Error", 833, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["register", 2000, 1236, "400/Bad Request", 1236, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["cekout cart", 2000, 1999, "500/Internal Server Error", 1999, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
