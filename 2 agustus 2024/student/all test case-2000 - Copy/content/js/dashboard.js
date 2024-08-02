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

    var data = {"OkPercent": 77.605, "KoPercent": 22.395};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.4360583333333333, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5856, 500, 1500, "Submit score (retake quiz)"], "isController": false}, {"data": [0.27375, 500, 1500, "view data in market place"], "isController": false}, {"data": [0.34525, 500, 1500, "add to cart"], "isController": false}, {"data": [0.59725, 500, 1500, "Submit subjourney quiz"], "isController": false}, {"data": [0.57, 500, 1500, "Play subjourney video"], "isController": false}, {"data": [0.579, 500, 1500, "view data my collection"], "isController": false}, {"data": [0.5555, 500, 1500, "Submit score quiz"], "isController": false}, {"data": [0.516, 500, 1500, "Play subjourney quiz"], "isController": false}, {"data": [0.058, 500, 1500, "login"], "isController": false}, {"data": [0.0, 500, 1500, "reedem-coupon"], "isController": false}, {"data": [0.593, 500, 1500, "Play subjourney interactive learning"], "isController": false}, {"data": [0.38175, 500, 1500, "view detail course"], "isController": false}, {"data": [0.27475, 500, 1500, "edit profile"], "isController": false}, {"data": [0.661, 500, 1500, "Submit score interactive learning"], "isController": false}, {"data": [0.0, 500, 1500, "payment success"], "isController": false}, {"data": [0.6915, 500, 1500, "get cart"], "isController": false}, {"data": [0.61225, 500, 1500, "Submit score (video)"], "isController": false}, {"data": [0.6475, 500, 1500, "Submit score (retake interactive learning)"], "isController": false}, {"data": [0.29525, 500, 1500, "market place - searching course"], "isController": false}, {"data": [0.0, 500, 1500, "register"], "isController": false}, {"data": [0.003, 500, 1500, "cekout cart"], "isController": false}, {"data": [0.277, 500, 1500, "add to interest"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 60000, 13437, 22.395, 8753.525399999946, 16, 229426, 960.5, 4296.0, 11967.550000000196, 112885.97, 129.43084941152108, 101.2120992598443, 36.11256786356047], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Submit score (retake quiz)", 10000, 711, 7.11, 1752.1305000000004, 16, 223359, 243.0, 3552.7999999999993, 5550.54999999999, 23851.959999999803, 27.09535125058594, 7.802966352484779, 6.9590599403360365], "isController": false}, {"data": ["view data in market place", 2000, 563, 28.15, 3710.0535000000104, 16, 26276, 1124.0, 13591.100000000017, 22159.649999999987, 24316.95, 15.476402355508439, 110.16855857624836, 2.980356092672697], "isController": false}, {"data": ["add to cart", 2000, 0, 0.0, 2231.281999999998, 38, 32770, 1600.0, 4670.5, 5984.899999999989, 11331.09, 15.508684863523573, 5.573433622828784, 3.5620904737903225], "isController": false}, {"data": ["Submit subjourney quiz", 2000, 337, 16.85, 1258.2675000000002, 17, 60371, 215.5, 2506.4000000000005, 3875.8999999999996, 10214.02, 5.473288981448287, 2.241416065574107, 1.288147113797888], "isController": false}, {"data": ["Play subjourney video", 2000, 67, 3.35, 2557.0510000000013, 17, 116714, 373.5, 4813.400000000005, 7123.449999999998, 56799.79, 6.767777258914855, 4.53511463874451, 1.3350498108406257], "isController": false}, {"data": ["view data my collection", 2000, 0, 0.0, 4912.2339999999995, 18, 110847, 536.0, 6143.5, 13536.899999999847, 110608.0, 7.7883136353900975, 3.3465410152066823, 1.4450972565665219], "isController": false}, {"data": ["Submit score quiz", 10000, 617, 6.17, 2082.435699999993, 17, 229426, 295.5, 4235.0, 6466.599999999991, 30636.829999999994, 26.807279784898384, 7.713085307633641, 6.885072835379176], "isController": false}, {"data": ["Play subjourney quiz", 2000, 98, 4.9, 2363.991500000003, 17, 113074, 1042.5, 5144.200000000003, 8218.749999999993, 29129.62000000002, 6.799228967435093, 4.344617671918504, 1.3412541517791883], "isController": false}, {"data": ["login", 2000, 1473, 73.65, 8132.7329999999865, 38, 113081, 2815.0, 15348.7, 54560.7, 111859.99, 15.530844256693793, 8.78979809174458, 6.22517643281745], "isController": false}, {"data": ["reedem-coupon", 2000, 2000, 100.0, 9226.534499999994, 18, 114926, 399.0, 9168.400000000001, 111054.0, 111824.0, 7.9575069130841305, 2.952981081027314, 2.138548898879981], "isController": false}, {"data": ["Play subjourney interactive learning", 2000, 156, 7.8, 1561.2214999999999, 16, 59745, 254.5, 3229.6000000000013, 5094.399999999998, 17154.350000000002, 5.4959247717817235, 3.621285763871714, 1.0841570350585041], "isController": false}, {"data": ["view detail course", 2000, 54, 2.7, 6560.2705000000005, 17, 166810, 1599.0, 11477.900000000003, 28881.099999999773, 115141.56, 6.71686403052143, 11.626196336454436, 1.325006381020829], "isController": false}, {"data": ["edit profile", 2000, 1241, 62.05, 527.929, 17, 6622, 66.0, 1770.1000000000017, 2230.0, 4172.250000000001, 5.543037529135591, 1.2566401692150782, 2.9876512166620937], "isController": false}, {"data": ["Submit score interactive learning", 2000, 162, 8.1, 896.8439999999999, 17, 58784, 113.0, 2203.2000000000007, 3297.849999999996, 8174.400000000001, 5.504804317968507, 2.3328355427668246, 1.4514620760268524], "isController": false}, {"data": ["payment success", 2000, 1995, 99.75, 51273.04500000006, 213, 130095, 33164.5, 105167.90000000001, 108554.65, 118537.68, 12.058580584479401, 3.721655976609368, 11.546950554543974], "isController": false}, {"data": ["get cart", 2000, 0, 0.0, 882.818499999998, 20, 35824, 362.0, 2156.1000000000017, 3501.949999999989, 6684.34, 15.508684863523573, 16.36739498924085, 2.789685270626551], "isController": false}, {"data": ["Submit score (video)", 2000, 83, 4.15, 1777.9119999999991, 17, 114212, 195.5, 3392.6000000000004, 5510.9499999999925, 20355.840000000004, 6.799136509663272, 2.9103292163145285, 1.799380853631589], "isController": false}, {"data": ["Submit score (retake interactive learning)", 2000, 164, 8.2, 959.8459999999992, 18, 58005, 145.0, 2148.2000000000007, 3365.6499999999987, 7679.070000000002, 5.505213437124957, 2.3379550101915267, 1.4569461342391246], "isController": false}, {"data": ["market place - searching course", 2000, 691, 34.55, 1901.6329999999991, 16, 24566, 966.5, 3738.2000000000016, 8078.849999999999, 21552.530000000002, 15.5956363409518, 47.22206382904063, 3.5820618016079098], "isController": false}, {"data": ["register", 2000, 1241, 62.05, 110333.80199999992, 70116, 192406, 80177.0, 188540.5, 189530.9, 190654.82, 10.214400261488647, 8.624509908287454, 3.4303327628165188], "isController": false}, {"data": ["cekout cart", 2000, 1755, 87.75, 15856.193499999998, 21, 125097, 10337.5, 26440.200000000023, 103047.19999999972, 120787.76, 14.663079099980205, 6.418855952202028, 3.382345629852563], "isController": false}, {"data": ["add to interest", 2000, 29, 1.45, 16509.268999999997, 18, 117672, 2008.5, 112672.0, 113170.5, 113771.51, 8.104384471999351, 3.651745418490153, 1.9010163404651916], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400/Bad Request", 3081, 22.92922527349855, 5.135], "isController": false}, {"data": ["500/Internal Server Error", 6883, 51.224231599315324, 11.471666666666666], "isController": false}, {"data": ["401/Unauthorized", 1473, 10.96226836347399, 2.455], "isController": false}, {"data": ["404/Not Found", 2000, 14.884274763712138, 3.3333333333333335], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 60000, 13437, "500/Internal Server Error", 6883, "400/Bad Request", 3081, "404/Not Found", 2000, "401/Unauthorized", 1473, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Submit score (retake quiz)", 10000, 711, "500/Internal Server Error", 711, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["view data in market place", 2000, 563, "500/Internal Server Error", 563, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Submit subjourney quiz", 2000, 337, "400/Bad Request", 185, "500/Internal Server Error", 152, "", "", "", "", "", ""], "isController": false}, {"data": ["Play subjourney video", 2000, 67, "500/Internal Server Error", 67, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Submit score quiz", 10000, 617, "500/Internal Server Error", 617, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Play subjourney quiz", 2000, 98, "500/Internal Server Error", 98, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["login", 2000, 1473, "401/Unauthorized", 1473, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["reedem-coupon", 2000, 2000, "404/Not Found", 2000, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Play subjourney interactive learning", 2000, 156, "500/Internal Server Error", 156, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["view detail course", 2000, 54, "500/Internal Server Error", 54, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["edit profile", 2000, 1241, "400/Bad Request", 1241, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Submit score interactive learning", 2000, 162, "500/Internal Server Error", 162, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["payment success", 2000, 1995, "500/Internal Server Error", 1581, "400/Bad Request", 414, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Submit score (video)", 2000, 83, "500/Internal Server Error", 83, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Submit score (retake interactive learning)", 2000, 164, "500/Internal Server Error", 164, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["market place - searching course", 2000, 691, "500/Internal Server Error", 691, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["register", 2000, 1241, "400/Bad Request", 1241, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["cekout cart", 2000, 1755, "500/Internal Server Error", 1755, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["add to interest", 2000, 29, "500/Internal Server Error", 29, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
