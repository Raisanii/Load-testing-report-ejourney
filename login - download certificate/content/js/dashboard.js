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

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9976190476190476, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Submit score (retake quiz)"], "isController": false}, {"data": [1.0, 500, 1500, "Submit subjourney quiz"], "isController": false}, {"data": [1.0, 500, 1500, "Play subjourney video"], "isController": false}, {"data": [1.0, 500, 1500, "view data my collection"], "isController": false}, {"data": [1.0, 500, 1500, "Submit score quiz"], "isController": false}, {"data": [1.0, 500, 1500, "Play subjourney quiz"], "isController": false}, {"data": [0.95, 500, 1500, "login"], "isController": false}, {"data": [1.0, 500, 1500, "Play subjourney interactive learning"], "isController": false}, {"data": [1.0, 500, 1500, "view detail course"], "isController": false}, {"data": [1.0, 500, 1500, "Submit score interactive learning"], "isController": false}, {"data": [1.0, 500, 1500, "Submit score (video)"], "isController": false}, {"data": [1.0, 500, 1500, "Submit score (retake interactive learning)"], "isController": false}, {"data": [1.0, 500, 1500, "Download certificate"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 210, 0, 0.0, 100.08571428571433, 77, 573, 83.0, 98.0, 250.44999999999862, 388.1199999999999, 19.083969465648856, 10.724704510859688, 4.849887682888041], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Submit score (retake quiz)", 50, 0, 0.0, 84.53999999999999, 78, 102, 83.0, 93.0, 98.0, 102.0, 5.6066382596994835, 1.5878174758914556, 1.4837880550571878], "isController": false}, {"data": ["Submit subjourney quiz", 10, 0, 0.0, 83.9, 79, 95, 81.0, 94.7, 95.0, 95.0, 1.1715089034676662, 0.502124275128866, 0.28601291588566075], "isController": false}, {"data": ["Play subjourney video", 10, 0, 0.0, 85.6, 79, 97, 82.5, 96.7, 97.0, 97.0, 1.1475786091347258, 1.0691308526509065, 0.23646395168694054], "isController": false}, {"data": ["view data my collection", 10, 0, 0.0, 84.80000000000001, 78, 101, 81.0, 100.5, 101.0, 101.0, 1.1335298118340513, 0.9885176972341874, 0.22028557866696896], "isController": false}, {"data": ["Submit score quiz", 50, 0, 0.0, 84.48000000000002, 78, 97, 83.0, 92.0, 94.44999999999999, 97.0, 5.561735261401558, 1.5751008064516128, 1.471904546718576], "isController": false}, {"data": ["Play subjourney quiz", 10, 0, 0.0, 96.9, 79, 196, 82.5, 186.20000000000005, 196.0, 196.0, 1.150483202945237, 2.020086717671422, 0.23706245685687988], "isController": false}, {"data": ["login", 10, 0, 0.0, 371.4, 317, 573, 353.5, 554.6000000000001, 573.0, 573.0, 1.073652566029633, 1.220860398325102, 0.4350180172321237], "isController": false}, {"data": ["Play subjourney interactive learning", 10, 0, 0.0, 84.9, 80, 93, 83.0, 92.8, 93.0, 93.0, 1.172745396974317, 0.937967265744107, 0.24164968629060632], "isController": false}, {"data": ["view detail course", 10, 0, 0.0, 94.7, 80, 177, 84.5, 169.10000000000002, 177.0, 177.0, 1.1354604292040424, 1.7519799591234244, 0.2339669439082548], "isController": false}, {"data": ["Submit score interactive learning", 10, 0, 0.0, 82.4, 77, 93, 80.0, 92.6, 93.0, 93.0, 1.1741223435481978, 0.5055376379593755, 0.31990247446283904], "isController": false}, {"data": ["Submit score (video)", 10, 0, 0.0, 83.30000000000001, 77, 94, 81.0, 94.0, 94.0, 94.0, 1.149029070435482, 0.49596762610594053, 0.31418763644720216], "isController": false}, {"data": ["Submit score (retake interactive learning)", 10, 0, 0.0, 83.0, 77, 96, 80.5, 95.6, 96.0, 96.0, 1.1750881316098707, 0.5066420020564042, 0.321313160987074], "isController": false}, {"data": ["Download certificate", 10, 0, 0.0, 105.80000000000001, 93, 141, 100.5, 139.8, 141.0, 141.0, 1.1746740279572419, 0.24434137495594974, 0.23860566192881474], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 210, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
