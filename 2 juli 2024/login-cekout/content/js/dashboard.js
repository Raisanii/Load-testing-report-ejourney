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

    var data = {"OkPercent": 88.23809523809524, "KoPercent": 11.761904761904763};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.23761904761904762, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.165, 500, 1500, "view data in market place"], "isController": false}, {"data": [0.325, 500, 1500, "add to cart"], "isController": false}, {"data": [0.005, 500, 1500, "payment success"], "isController": false}, {"data": [0.7316666666666667, 500, 1500, "get cart"], "isController": false}, {"data": [0.013333333333333334, 500, 1500, "login"], "isController": false}, {"data": [0.42333333333333334, 500, 1500, "market place - searching course"], "isController": false}, {"data": [0.0, 500, 1500, "cekout cart"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2100, 247, 11.761904761904763, 15949.023809523802, 76, 136684, 2364.5, 47969.200000000084, 69572.54999999999, 135747.79, 10.436545801526716, 27.071387409860545, 3.9666736398944415], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["view data in market place", 300, 0, 0.0, 35679.67333333333, 164, 135929, 19704.0, 132930.5, 134668.95, 135856.99, 1.8381451889613254, 23.39229431346809, 0.42415559248014806], "isController": false}, {"data": ["add to cart", 300, 0, 0.0, 3222.180000000001, 707, 136062, 1371.0, 2483.400000000001, 4404.349999999993, 69899.28, 1.8473361412842682, 0.6638864257740339, 0.4948299122977167], "isController": false}, {"data": ["payment success", 300, 31, 10.333333333333334, 18753.28, 214, 80518, 11127.5, 48875.20000000003, 60167.99999999999, 75920.53, 1.8116598427479256, 0.3175358482191384, 1.7548272714440136], "isController": false}, {"data": ["get cart", 300, 0, 0.0, 1428.123333333333, 77, 134863, 418.0, 821.2000000000013, 1763.3999999999999, 35692.140000000145, 1.8477343697070108, 1.2168822485079547, 0.4029107494256626], "isController": false}, {"data": ["login", 300, 185, 61.666666666666664, 40461.06, 826, 136684, 21831.5, 134106.1, 135575.05, 136511.31, 2.086651689144542, 1.4305382996223162, 0.9118436937038764], "isController": false}, {"data": ["market place - searching course", 300, 0, 0.0, 8377.696666666667, 145, 136091, 1021.0, 12557.00000000001, 68310.7, 135198.2, 1.8348399407958311, 5.58106705116757, 0.4914826634383677], "isController": false}, {"data": ["cekout cart", 300, 31, 10.333333333333334, 3721.1533333333336, 76, 41331, 2572.0, 4860.900000000007, 8462.499999999996, 32241.330000000016, 1.8381339264378802, 0.9388723775955983, 0.496990247167742], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400/Bad Request", 31, 12.550607287449393, 1.4761904761904763], "isController": false}, {"data": ["500/Internal Server Error", 163, 65.9919028340081, 7.761904761904762], "isController": false}, {"data": ["401/Unauthorized", 53, 21.45748987854251, 2.5238095238095237], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2100, 247, "500/Internal Server Error", 163, "401/Unauthorized", 53, "400/Bad Request", 31, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["payment success", 300, 31, "400/Bad Request", 31, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["login", 300, 185, "500/Internal Server Error", 132, "401/Unauthorized", 53, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["cekout cart", 300, 31, "500/Internal Server Error", 31, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
