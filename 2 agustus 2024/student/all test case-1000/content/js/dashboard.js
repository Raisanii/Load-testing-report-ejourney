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

    var data = {"OkPercent": 96.08, "KoPercent": 3.92};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5104333333333333, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.6271, 500, 1500, "Submit score (retake quiz)"], "isController": false}, {"data": [0.152, 500, 1500, "view data in market place"], "isController": false}, {"data": [0.272, 500, 1500, "add to cart"], "isController": false}, {"data": [0.6285, 500, 1500, "Submit subjourney quiz"], "isController": false}, {"data": [0.5735, 500, 1500, "Play subjourney video"], "isController": false}, {"data": [0.814, 500, 1500, "view data my collection"], "isController": false}, {"data": [0.6344, 500, 1500, "Submit score quiz"], "isController": false}, {"data": [0.5495, 500, 1500, "Play subjourney quiz"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": false}, {"data": [0.9135, 500, 1500, "reedem-coupon"], "isController": false}, {"data": [0.5105, 500, 1500, "Play subjourney interactive learning"], "isController": false}, {"data": [0.3665, 500, 1500, "view detail course"], "isController": false}, {"data": [0.6415, 500, 1500, "edit profile"], "isController": false}, {"data": [0.6635, 500, 1500, "Submit score interactive learning"], "isController": false}, {"data": [0.084, 500, 1500, "payment success"], "isController": false}, {"data": [0.398, 500, 1500, "get cart"], "isController": false}, {"data": [0.714, 500, 1500, "Submit score (video)"], "isController": false}, {"data": [0.652, 500, 1500, "Submit score (retake interactive learning)"], "isController": false}, {"data": [0.2795, 500, 1500, "market place - searching course"], "isController": false}, {"data": [0.0, 500, 1500, "register"], "isController": false}, {"data": [0.083, 500, 1500, "cekout cart"], "isController": false}, {"data": [0.71, 500, 1500, "add to interest"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 30000, 1176, 3.92, 6784.741566666681, 16, 150037, 782.5, 2129.7000000000044, 18102.100000000028, 104902.97000000032, 106.81288163352501, 108.92371209811652, 29.812747839264414], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Submit score (retake quiz)", 5000, 402, 8.04, 717.4963999999986, 17, 8714, 438.5, 1503.0, 1871.8499999999995, 4395.769999999995, 22.257141203755225, 6.439382189056609, 5.716433727136352], "isController": false}, {"data": ["view data in market place", 1000, 0, 0.0, 5669.540000000003, 43, 19018, 5319.5, 9768.6, 13719.149999999983, 16485.9, 17.345151162992387, 201.64259936603472, 3.336908963974121], "isController": false}, {"data": ["add to cart", 1000, 0, 0.0, 8417.474000000002, 44, 32027, 8572.5, 17789.0, 23914.7, 28777.77, 11.285662694113398, 4.0557850306970025, 2.589971419059227], "isController": false}, {"data": ["Submit subjourney quiz", 1000, 91, 9.1, 680.1489999999993, 18, 11006, 400.0, 1457.9, 1726.9499999999998, 3120.71, 4.452102059987623, 1.878882719944972, 1.0478091762275559], "isController": false}, {"data": ["Play subjourney video", 1000, 18, 1.8, 1159.306999999999, 17, 13441, 881.0, 2135.3999999999996, 3443.849999999989, 8111.99, 4.574335234732012, 3.1076979343445665, 0.9023590990389322], "isController": false}, {"data": ["view data my collection", 1000, 0, 0.0, 395.014, 18, 8541, 47.0, 999.6999999999999, 1168.9499999999998, 1736.8300000000002, 4.641663572224285, 1.9944648161901226, 0.8612461706275529], "isController": false}, {"data": ["Submit score quiz", 5000, 264, 5.28, 816.862799999997, 17, 11181, 608.0, 1597.7000000000016, 2112.0, 5830.889999999998, 22.402437385187508, 6.449416696536583, 5.753751008109682], "isController": false}, {"data": ["Play subjourney quiz", 1000, 29, 2.9, 1182.2659999999998, 17, 10032, 965.5, 2211.5999999999995, 3795.8499999999985, 7879.700000000001, 4.529170120158883, 2.939683519991757, 0.8934495744844673], "isController": false}, {"data": ["login", 1000, 5, 0.5, 42570.19199999998, 7827, 46325, 44078.5, 45136.7, 45346.95, 45652.42, 21.479047189466677, 22.088808812316085, 8.597764735968813], "isController": false}, {"data": ["reedem-coupon", 1000, 0, 0.0, 344.60000000000014, 38, 8671, 125.5, 888.6999999999999, 1110.4499999999994, 6656.020000000002, 4.674448064544778, 2.947517963027453, 1.269039611272899], "isController": false}, {"data": ["Play subjourney interactive learning", 1000, 98, 9.8, 960.449000000001, 17, 9319, 893.5, 1818.5999999999995, 2323.049999999999, 4670.9, 4.449883190566248, 2.9246422711091333, 0.877808988764045], "isController": false}, {"data": ["view detail course", 1000, 13, 1.3, 1919.0400000000006, 17, 17804, 1380.5, 3982.3999999999996, 6107.999999999998, 10030.080000000002, 4.582363399747054, 6.910611228565995, 0.9039427800282274], "isController": false}, {"data": ["edit profile", 1000, 0, 0.0, 834.3260000000002, 31, 5026, 654.5, 2046.5, 3119.8999999999887, 3700.9300000000003, 4.450774434751646, 1.4734497396296955, 2.3891574614451665], "isController": false}, {"data": ["Submit score interactive learning", 1000, 103, 10.3, 537.0269999999997, 16, 8212, 215.0, 1232.9, 1478.0, 1912.92, 4.45105178353645, 1.888167463034015, 1.1736171694871498], "isController": false}, {"data": ["payment success", 1000, 10, 1.0, 61192.694999999985, 169, 150037, 60702.5, 117556.5, 127124.79999999999, 139430.63, 4.740369938469998, 0.7690139200963243, 4.555014067047792], "isController": false}, {"data": ["get cart", 1000, 0, 0.0, 4648.59, 22, 17462, 6699.5, 8662.0, 9104.85, 9719.67, 10.992876615952863, 7.6220140598891915, 1.97528251692903], "isController": false}, {"data": ["Submit score (video)", 1000, 22, 2.2, 707.3990000000007, 17, 8413, 383.5, 1366.8, 1589.8999999999999, 7335.150000000001, 4.558196777354878, 1.9745316096702146, 1.206319654944504], "isController": false}, {"data": ["Submit score (retake interactive learning)", 1000, 105, 10.5, 542.2439999999999, 16, 7251, 322.0, 1226.3999999999999, 1401.85, 2028.780000000001, 4.450833863724369, 1.8903786741633546, 1.1779062276067422], "isController": false}, {"data": ["market place - searching course", 1000, 0, 0.0, 6063.820999999995, 26, 18968, 7714.0, 9570.2, 10230.8, 17188.15, 14.358326393475576, 70.34877440466789, 3.2951237328776957], "isController": false}, {"data": ["register", 1000, 0, 0.0, 42295.69299999997, 36475, 49073, 42283.5, 45833.5, 46398.85, 47727.9, 20.12112919777058, 27.38493543632669, 6.735587298034166], "isController": false}, {"data": ["cekout cart", 1000, 10, 1.0, 14838.853000000001, 251, 39264, 15414.0, 26292.7, 28823.399999999998, 34254.11, 9.973072703700009, 5.251446095542037, 2.317960257305276], "isController": false}, {"data": ["add to interest", 1000, 6, 0.6, 911.7719999999994, 19, 9758, 435.5, 1470.7999999999995, 4581.299999999992, 8216.66, 4.7054616293131435, 2.1734453742959454, 1.1028425693702681], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400/Bad Request", 10, 0.8503401360544217, 0.03333333333333333], "isController": false}, {"data": ["500/Internal Server Error", 1166, 99.14965986394557, 3.8866666666666667], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 30000, 1176, "500/Internal Server Error", 1166, "400/Bad Request", 10, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Submit score (retake quiz)", 5000, 402, "500/Internal Server Error", 402, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Submit subjourney quiz", 1000, 91, "500/Internal Server Error", 91, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Play subjourney video", 1000, 18, "500/Internal Server Error", 18, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Submit score quiz", 5000, 264, "500/Internal Server Error", 264, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Play subjourney quiz", 1000, 29, "500/Internal Server Error", 29, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["login", 1000, 5, "500/Internal Server Error", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Play subjourney interactive learning", 1000, 98, "500/Internal Server Error", 98, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["view detail course", 1000, 13, "500/Internal Server Error", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Submit score interactive learning", 1000, 103, "500/Internal Server Error", 103, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["payment success", 1000, 10, "400/Bad Request", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Submit score (video)", 1000, 22, "500/Internal Server Error", 22, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Submit score (retake interactive learning)", 1000, 105, "500/Internal Server Error", 105, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["cekout cart", 1000, 10, "500/Internal Server Error", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["add to interest", 1000, 6, "500/Internal Server Error", 6, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
