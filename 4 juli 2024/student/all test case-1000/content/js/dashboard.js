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

    var data = {"OkPercent": 96.53870967741935, "KoPercent": 3.4612903225806453};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5062258064516129, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.7085, 500, 1500, "Submit score (retake quiz)"], "isController": false}, {"data": [0.0675, 500, 1500, "view data in market place"], "isController": false}, {"data": [0.1405, 500, 1500, "add to cart"], "isController": false}, {"data": [0.508, 500, 1500, "Submit subjourney quiz"], "isController": false}, {"data": [0.543, 500, 1500, "Play subjourney video"], "isController": false}, {"data": [0.554, 500, 1500, "view data my collection"], "isController": false}, {"data": [0.6873, 500, 1500, "Submit score quiz"], "isController": false}, {"data": [0.4205, 500, 1500, "Play subjourney quiz"], "isController": false}, {"data": [0.0045, 500, 1500, "login"], "isController": false}, {"data": [0.4745, 500, 1500, "reedem-coupon"], "isController": false}, {"data": [0.5125, 500, 1500, "Play subjourney interactive learning"], "isController": false}, {"data": [0.241, 500, 1500, "view detail course"], "isController": false}, {"data": [0.5155, 500, 1500, "edit profile"], "isController": false}, {"data": [0.834, 500, 1500, "Submit score interactive learning"], "isController": false}, {"data": [0.0, 500, 1500, "payment success"], "isController": false}, {"data": [0.5535, 500, 1500, "get cart"], "isController": false}, {"data": [0.8205, 500, 1500, "Submit score (video)"], "isController": false}, {"data": [0.722, 500, 1500, "Submit score (retake interactive learning)"], "isController": false}, {"data": [1.0, 500, 1500, "Download certificate"], "isController": false}, {"data": [0.1015, 500, 1500, "market place - searching course"], "isController": false}, {"data": [0.0, 500, 1500, "register"], "isController": false}, {"data": [0.0, 500, 1500, "cekout cart"], "isController": false}, {"data": [0.701, 500, 1500, "add to interest"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 31000, 1073, 3.4612903225806453, 15713.428129032258, 23, 1004107, 654.0, 15602.800000000032, 135120.0, 156052.82000000004, 17.863903562581, 14.217354900263233, 5.6054637865540125], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Submit score (retake quiz)", 5000, 0, 0.0, 1304.9591999999982, 328, 145776, 519.0, 1021.0, 1985.9499999999998, 12181.899999999998, 3.0611613923876266, 0.8729093032980341, 0.9057928729428231], "isController": false}, {"data": ["view data in market place", 1000, 0, 0.0, 96620.6200000001, 463, 139183, 135068.5, 135259.0, 135626.05, 136366.88, 3.036661615686179, 21.655038941389392, 0.7028210965992426], "isController": false}, {"data": ["add to cart", 1000, 0, 0.0, 44013.67599999996, 734, 307401, 3764.0, 147939.9, 204707.95, 271201.98, 1.4971314960535613, 0.5380316313942487, 0.4020616810690717], "isController": false}, {"data": ["Submit subjourney quiz", 1000, 7, 0.7, 2010.5779999999993, 331, 135894, 630.0, 1047.9, 2044.6499999999983, 36765.18000000022, 0.6133264804321252, 0.2634734363318047, 0.16830541113420627], "isController": false}, {"data": ["Play subjourney video", 1000, 0, 0.0, 2650.883999999998, 290, 137235, 638.5, 1963.8999999999996, 4462.0499999999765, 69156.05, 0.6113493335680915, 0.4425452750032707, 0.1444790417221466], "isController": false}, {"data": ["view data my collection", 1000, 0, 0.0, 612.6999999999994, 188, 2099, 625.0, 708.9, 755.0, 1096.7000000000003, 0.8775324489561313, 0.7669839275544311, 0.19710201490225604], "isController": false}, {"data": ["Submit score quiz", 5000, 0, 0.0, 1654.1946000000007, 329, 143010, 563.0, 1058.0, 2166.349999999994, 20226.689999999995, 3.0584481678672093, 0.8721356103683839, 0.904990034046645], "isController": false}, {"data": ["Play subjourney quiz", 1000, 0, 0.0, 3515.3329999999996, 395, 138014, 1098.5, 3815.8999999999937, 8382.5, 133143.0100000006, 0.6115527201253438, 1.006311792624613, 0.14452710768587226], "isController": false}, {"data": ["login", 1000, 789, 78.9, 84722.38600000007, 694, 151171, 132846.0, 135401.7, 136356.85, 141309.27000000002, 3.7349807088246387, 2.1037716535506594, 1.6409586680031674], "isController": false}, {"data": ["reedem-coupon", 1000, 0, 0.0, 912.7660000000001, 597, 3397, 719.5, 1373.6999999999998, 1508.5999999999995, 2562.5700000000015, 0.8771937519243438, 0.5539221553045222, 0.26641333676608486], "isController": false}, {"data": ["Play subjourney interactive learning", 1000, 0, 0.0, 1931.0300000000032, 293, 137149, 865.0, 2030.6999999999998, 4077.8499999999985, 20458.260000000002, 0.6134506414546632, 0.4288247631467073, 0.14497563987502782], "isController": false}, {"data": ["view detail course", 1000, 0, 0.0, 8207.665999999997, 628, 1004107, 1513.0, 6975.899999999997, 21489.749999999996, 144427.14, 0.6097940237746494, 0.9656767238724604, 0.1441114782748683], "isController": false}, {"data": ["edit profile", 1000, 0, 0.0, 880.946, 457, 2141, 873.0, 1184.8, 1342.9499999999998, 1499.93, 0.6135033310163357, 0.20310315352982208, 0.344967411086496], "isController": false}, {"data": ["Submit score interactive learning", 1000, 0, 0.0, 754.724000000001, 175, 135013, 271.0, 567.0, 1563.0, 5699.52, 0.6136211625666547, 0.26640566514232944, 0.18576421913638957], "isController": false}, {"data": ["payment success", 1000, 146, 14.6, 62863.035999999986, 210, 305054, 33233.5, 162268.0, 226524.64999999982, 300327.99, 0.8754459302707316, 0.16412217395110634, 0.848487496169924], "isController": false}, {"data": ["get cart", 1000, 0, 0.0, 4709.148999999996, 104, 999533, 687.5, 4821.2, 11879.449999999999, 135003.99, 0.8582806921175501, 0.5873255008067839, 0.1877489014007141], "isController": false}, {"data": ["Submit score (video)", 1000, 0, 0.0, 1630.719, 173, 135044, 274.0, 730.5999999999997, 2582.95, 36019.210000000145, 0.6115171925001085, 0.26603207457360434, 0.18572445983157593], "isController": false}, {"data": ["Submit score (retake interactive learning)", 1000, 0, 0.0, 1426.090999999998, 175, 134908, 479.5, 1562.8, 3611.7999999999997, 36056.02000000015, 0.6136426255804293, 0.2670118467160608, 0.18636997710499364], "isController": false}, {"data": ["Download certificate", 1000, 0, 0.0, 35.645999999999965, 23, 269, 30.0, 46.0, 61.899999999999864, 159.7900000000002, 0.6137281159897041, 0.12885893060330703, 0.1432431833218157], "isController": false}, {"data": ["market place - searching course", 1000, 0, 0.0, 79781.67600000006, 390, 148128, 135074.0, 135173.9, 135192.95, 135414.62, 2.324521845856307, 4.9310781088736295, 0.6242612379008637], "isController": false}, {"data": ["register", 1000, 0, 0.0, 61106.15299999999, 34338, 170599, 46582.5, 103085.3, 166254.0, 169734.68, 5.647930598228809, 7.6869990109061535, 2.1112780878648563], "isController": false}, {"data": ["cekout cart", 1000, 131, 13.1, 10505.79899999999, 83, 211788, 3161.5, 13706.599999999999, 38414.2, 137547.51, 0.8569721972510046, 0.4436011131318992, 0.23259430550544652], "isController": false}, {"data": ["add to interest", 1000, 0, 0.0, 3428.9249999999975, 183, 136513, 487.5, 1616.2999999999997, 5659.95, 135285.84, 0.8774924074969441, 0.4057296949902203, 0.23993933017494565], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400/Bad Request", 138, 12.861136999068034, 0.44516129032258067], "isController": false}, {"data": ["502/Proxy Error", 15, 1.3979496738117427, 0.04838709677419355], "isController": false}, {"data": ["500/Internal Server Error", 386, 35.973904939422184, 1.2451612903225806], "isController": false}, {"data": ["401/Unauthorized", 534, 49.76700838769804, 1.7225806451612904], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 31000, 1073, "401/Unauthorized", 534, "500/Internal Server Error", 386, "400/Bad Request", 138, "502/Proxy Error", 15, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Submit subjourney quiz", 1000, 7, "400/Bad Request", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["login", 1000, 789, "401/Unauthorized", 534, "500/Internal Server Error", 255, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["payment success", 1000, 146, "400/Bad Request", 131, "502/Proxy Error", 15, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["cekout cart", 1000, 131, "500/Internal Server Error", 131, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
