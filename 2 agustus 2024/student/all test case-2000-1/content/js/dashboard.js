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

    var data = {"OkPercent": 94.04781753309547, "KoPercent": 5.952182466904532};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.2928490446497049, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.27673836918459227, 500, 1500, "Submit score (retake quiz)"], "isController": false}, {"data": [0.14525, 500, 1500, "view data in market place"], "isController": false}, {"data": [0.14725, 500, 1500, "add to cart"], "isController": false}, {"data": [0.6320660330165082, 500, 1500, "Submit subjourney quiz"], "isController": false}, {"data": [0.26163081540770383, 500, 1500, "Play subjourney video"], "isController": false}, {"data": [0.6615807903951976, 500, 1500, "view data my collection"], "isController": false}, {"data": [0.2829414707353677, 500, 1500, "Submit score quiz"], "isController": false}, {"data": [0.20860430215107553, 500, 1500, "Play subjourney quiz"], "isController": false}, {"data": [0.005, 500, 1500, "login"], "isController": false}, {"data": [0.18534267133566784, 500, 1500, "reedem-coupon"], "isController": false}, {"data": [0.4817408704352176, 500, 1500, "Play subjourney interactive learning"], "isController": false}, {"data": [0.17783891945972988, 500, 1500, "view detail course"], "isController": false}, {"data": [0.6165582791395697, 500, 1500, "edit profile"], "isController": false}, {"data": [0.724112056028014, 500, 1500, "Submit score interactive learning"], "isController": false}, {"data": [0.0125, 500, 1500, "payment success"], "isController": false}, {"data": [0.19875, 500, 1500, "get cart"], "isController": false}, {"data": [0.3876938469234617, 500, 1500, "Submit score (video)"], "isController": false}, {"data": [0.7128564282141071, 500, 1500, "Submit score (retake interactive learning)"], "isController": false}, {"data": [0.21175, 500, 1500, "market place - searching course"], "isController": false}, {"data": [0.0, 500, 1500, "register"], "isController": false}, {"data": [0.05475, 500, 1500, "cekout cart"], "isController": false}, {"data": [0.16258129064532267, 500, 1500, "add to interest"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 59978, 3570, 5.952182466904532, 22609.753392910607, 18, 1538199, 3052.0, 18973.700000000033, 27721.800000000017, 47324.41000000009, 32.94091801568014, 33.47742065106205, 9.2090856100081], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Submit score (retake quiz)", 9995, 0, 0.0, 7276.431115557798, 24, 78669, 4077.0, 18771.6, 26299.399999999994, 42690.95999999979, 13.632544614360615, 3.8874053001887687, 3.501327376539884], "isController": false}, {"data": ["view data in market place", 2000, 0, 0.0, 7927.5810000000065, 37, 24719, 5504.0, 16609.4, 17660.95, 22527.090000000004, 16.654176034640685, 193.38097338454492, 3.220241069198101], "isController": false}, {"data": ["add to cart", 2000, 0, 0.0, 12855.031999999992, 37, 38276, 12023.0, 27326.5, 29618.849999999995, 35042.54, 13.385805691644581, 4.810523920434771, 3.0850099054962117], "isController": false}, {"data": ["Submit subjourney quiz", 1999, 0, 0.0, 1552.8534267133577, 25, 19885, 438.0, 4917.0, 6414.0, 8880.0, 2.7276250150094423, 1.1743955842561866, 0.6419508091965582], "isController": false}, {"data": ["Play subjourney video", 1999, 0, 0.0, 8136.985492746379, 36, 41724, 7560.0, 18808.0, 22157.0, 29197.0, 3.2302946371291585, 2.2145183938131536, 0.6372260905274317], "isController": false}, {"data": ["view data my collection", 1999, 0, 0.0, 2052.3261630815446, 18, 14087, 92.0, 7741.0, 9821.0, 12973.0, 3.434613481416318, 1.4758104802960745, 0.6372817983096685], "isController": false}, {"data": ["Submit score quiz", 9995, 0, 0.0, 9976.889344672329, 24, 100963, 5481.0, 27029.6, 35174.99999999998, 52874.35999999987, 13.765549079450425, 3.9253323546870353, 3.535487703022912], "isController": false}, {"data": ["Play subjourney quiz", 1999, 0, 0.0, 8147.176588294151, 33, 36370, 7540.0, 17824.0, 20139.0, 25764.0, 3.2237203894267132, 2.1218628344468797, 0.6359292174455039], "isController": false}, {"data": ["login", 2000, 1085, 54.25, 81229.34449999993, 234, 93549, 86174.5, 89051.9, 89556.8, 91838.90000000001, 20.766275568476793, 17.407300075926695, 8.343956445981725], "isController": false}, {"data": ["reedem-coupon", 1999, 0, 0.0, 12824.473736868424, 33, 47793, 6019.0, 39570.0, 41513.0, 42752.0, 3.4540493934246923, 2.1846401418121406, 0.9208549652392003], "isController": false}, {"data": ["Play subjourney interactive learning", 1999, 0, 0.0, 2152.8844422211105, 39, 16977, 821.0, 6030.0, 7641.0, 10397.0, 2.7270296521843522, 1.885485345455587, 0.5379492087316788], "isController": false}, {"data": ["view detail course", 1999, 0, 0.0, 12071.943471735867, 42, 52157, 10372.0, 26372.0, 31904.0, 40292.0, 3.2354550192444025, 4.929013505880144, 0.6382440565306341], "isController": false}, {"data": ["edit profile", 1999, 0, 0.0, 1374.7458729364662, 26, 11377, 402.0, 4249.0, 6353.0, 6892.0, 2.72770317567964, 0.9030189224173809, 1.4846234944074579], "isController": false}, {"data": ["Submit score interactive learning", 1999, 0, 0.0, 933.8529264632326, 22, 12343, 197.0, 3316.0, 4275.0, 5017.0, 2.7273868386871434, 1.1846950675945784, 0.7191352016069615], "isController": false}, {"data": ["payment success", 2000, 1653, 82.65, 294500.06350000005, 522, 1538199, 356892.0, 417798.5, 434514.5, 449775.4, 1.1561823091388697, 0.2526997895675936, 1.1103747951028164], "isController": false}, {"data": ["get cart", 2000, 0, 0.0, 5686.639500000001, 23, 19262, 6236.0, 10124.900000000003, 11854.349999999999, 14215.91, 12.877636696113528, 8.9466689276309, 2.3265261609189483], "isController": false}, {"data": ["Submit score (video)", 1999, 0, 0.0, 4620.945472736364, 21, 18639, 2985.0, 12051.0, 13719.0, 16539.0, 3.2258376850136523, 1.4042628480806347, 0.8537129029674803], "isController": false}, {"data": ["Submit score (retake interactive learning)", 1999, 0, 0.0, 960.0725362681325, 20, 10468, 255.0, 3505.0, 4117.0, 4854.0, 2.7274389362033067, 1.1872826124403415, 0.7218124528428673], "isController": false}, {"data": ["market place - searching course", 2000, 0, 0.0, 5202.285500000007, 22, 25340, 4274.0, 11763.300000000003, 14088.9, 17525.72, 15.875409784015051, 77.64450529742581, 3.658785848659719], "isController": false}, {"data": ["register", 2000, 0, 0.0, 78382.99000000003, 65667, 89868, 78614.5, 84205.5, 85576.09999999999, 87206.99, 21.545223423966906, 29.376827977549876, 7.277677700963071], "isController": false}, {"data": ["cekout cart", 2000, 832, 41.6, 45828.668999999994, 255, 412579, 31696.5, 57748.500000000015, 74310.29999999999, 388354.14, 3.7118491504505258, 1.8633754599213086, 0.8693012965953063], "isController": false}, {"data": ["add to interest", 1999, 0, 0.0, 5409.6793396698495, 21, 12297, 6858.0, 8387.0, 8594.0, 9262.0, 3.712763250515868, 1.7250458465434526, 0.8738046322014884], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400/Bad Request", 12, 0.33613445378151263, 0.02000733602320851], "isController": false}, {"data": ["500/Internal Server Error", 3557, 99.63585434173669, 5.930507852879389], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, 0.028011204481792718, 0.0016672780019340425], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 59978, 3570, "500/Internal Server Error", 3557, "400/Bad Request", 12, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["login", 2000, 1085, "500/Internal Server Error", 1085, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["payment success", 2000, 1653, "500/Internal Server Error", 1640, "400/Bad Request", 12, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["cekout cart", 2000, 832, "500/Internal Server Error", 832, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
