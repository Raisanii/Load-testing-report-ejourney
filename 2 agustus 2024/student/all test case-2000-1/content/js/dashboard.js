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

    var data = {"OkPercent": 85.74, "KoPercent": 14.26};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.2620166666666667, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.25705, 500, 1500, "Submit score (retake quiz)"], "isController": false}, {"data": [0.1995, 500, 1500, "view data in market place"], "isController": false}, {"data": [0.0, 500, 1500, "add to cart"], "isController": false}, {"data": [0.581, 500, 1500, "Submit subjourney quiz"], "isController": false}, {"data": [0.2055, 500, 1500, "Play subjourney video"], "isController": false}, {"data": [0.50525, 500, 1500, "view data my collection"], "isController": false}, {"data": [0.24825, 500, 1500, "Submit score quiz"], "isController": false}, {"data": [0.18325, 500, 1500, "Play subjourney quiz"], "isController": false}, {"data": [0.003, 500, 1500, "login"], "isController": false}, {"data": [0.3595, 500, 1500, "reedem-coupon"], "isController": false}, {"data": [0.4285, 500, 1500, "Play subjourney interactive learning"], "isController": false}, {"data": [0.137, 500, 1500, "view detail course"], "isController": false}, {"data": [0.59025, 500, 1500, "edit profile"], "isController": false}, {"data": [0.68625, 500, 1500, "Submit score interactive learning"], "isController": false}, {"data": [0.0, 500, 1500, "payment success"], "isController": false}, {"data": [0.0, 500, 1500, "get cart"], "isController": false}, {"data": [0.32725, 500, 1500, "Submit score (video)"], "isController": false}, {"data": [0.66725, 500, 1500, "Submit score (retake interactive learning)"], "isController": false}, {"data": [0.2235, 500, 1500, "market place - searching course"], "isController": false}, {"data": [0.0, 500, 1500, "register"], "isController": false}, {"data": [0.0, 500, 1500, "cekout cart"], "isController": false}, {"data": [0.237, 500, 1500, "add to interest"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 60000, 8556, 14.26, 10563.360400000083, 17, 104068, 2988.5, 18906.800000000003, 27202.75000000002, 46806.720000000045, 150.1655575271737, 150.8130902796896, 41.997860258122074], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Submit score (retake quiz)", 10000, 0, 0.0, 7060.728999999993, 24, 83111, 3906.0, 18632.09999999999, 25055.44999999999, 39840.63999999999, 32.48535722523073, 9.2634026462572, 8.343407177964533], "isController": false}, {"data": ["view data in market place", 2000, 0, 0.0, 9887.2115, 37, 31349, 10803.5, 20574.9, 21585.949999999997, 24925.0, 15.694521827156231, 182.34239542789152, 3.0346829314227866], "isController": false}, {"data": ["add to cart", 2000, 2000, 100.0, 784.4815000000012, 17, 3062, 497.0, 2014.8000000000002, 2235.0, 2621.7700000000004, 15.020314976005048, 4.869867746126636, 3.4617132171261633], "isController": false}, {"data": ["Submit subjourney quiz", 2000, 0, 0.0, 1648.2689999999998, 26, 23977, 573.5, 4619.800000000002, 5823.099999999997, 11839.040000000003, 6.499626271489389, 2.798387432566378, 1.529697198661077], "isController": false}, {"data": ["Play subjourney video", 2000, 0, 0.0, 8185.599000000002, 36, 31343, 8249.0, 16960.600000000002, 19349.75, 24209.760000000002, 10.153882082967371, 6.960962131096772, 2.00301189527286], "isController": false}, {"data": ["view data my collection", 2000, 0, 0.0, 1871.860000000001, 18, 10233, 868.5, 5203.100000000002, 5846.9, 8490.67, 12.712860965796047, 5.462557446240489, 2.3588316245129386], "isController": false}, {"data": ["Submit score quiz", 10000, 0, 0.0, 9917.608399999988, 24, 104068, 5432.0, 26347.399999999998, 34661.949999999975, 54108.44999999999, 32.909134588487724, 9.384245409998453, 8.452248434347922], "isController": false}, {"data": ["Play subjourney quiz", 2000, 0, 0.0, 7545.1214999999975, 34, 30403, 7236.5, 15262.600000000002, 19002.9, 23683.48, 10.210332856851133, 6.720472993669594, 2.0141476924647743], "isController": false}, {"data": ["login", 2000, 556, 27.8, 82487.6035000001, 173, 94015, 88172.0, 91093.7, 91529.85, 92456.8, 20.70993662759392, 18.68006958215114, 8.321319277973947], "isController": false}, {"data": ["reedem-coupon", 2000, 0, 0.0, 3433.8445000000024, 32, 17616, 2258.0, 10066.200000000003, 11052.799999999992, 12056.92, 12.689872212986815, 8.02623883886083, 3.4574944799055873], "isController": false}, {"data": ["Play subjourney interactive learning", 2000, 0, 0.0, 2249.6679999999983, 38, 21545, 1051.5, 5636.300000000001, 7296.849999999999, 13416.95, 6.497261404318079, 4.492247142829298, 1.2816863317111837], "isController": false}, {"data": ["view detail course", 2000, 0, 0.0, 12555.443000000005, 41, 43401, 12217.0, 25962.40000000001, 30371.799999999974, 35139.26, 10.180292988832218, 15.509040100174083, 2.0082218591251055], "isController": false}, {"data": ["edit profile", 2000, 0, 0.0, 1218.7555000000023, 25, 13533, 531.0, 3527.4000000000005, 4301.999999999996, 5790.96, 6.499056012114241, 2.151542957135476, 3.537285769788813], "isController": false}, {"data": ["Submit score interactive learning", 2000, 0, 0.0, 1004.6105000000005, 21, 13626, 294.0, 3421.100000000001, 3753.0, 7443.18, 6.4982113673211455, 2.822571719946585, 1.71339557536788], "isController": false}, {"data": ["payment success", 2000, 2000, 100.0, 1879.7340000000017, 79, 5627, 1476.5, 4371.0, 4618.95, 5101.91, 14.4368891391283, 5.301045230773673, 13.830652583481312], "isController": false}, {"data": ["get cart", 2000, 2000, 100.0, 864.9675000000002, 17, 3189, 551.5, 2105.9, 2235.8999999999996, 2629.99, 14.936742893844569, 4.828185447131399, 2.698532651719966], "isController": false}, {"data": ["Submit score (video)", 2000, 0, 0.0, 4205.977000000002, 22, 15782, 3357.0, 10443.2, 11244.699999999999, 13315.2, 10.23698623125352, 4.456518001100476, 2.7092024108102573], "isController": false}, {"data": ["Submit score (retake interactive learning)", 2000, 0, 0.0, 1046.1140000000007, 21, 12446, 366.0, 3330.8, 3750.95, 6704.79, 6.498781478472786, 2.829276883631194, 1.7198923639317627], "isController": false}, {"data": ["market place - searching course", 2000, 0, 0.0, 8090.760000000006, 23, 22633, 9241.5, 15715.6, 17335.59999999999, 19642.95, 15.212017493820118, 74.50196983742157, 3.5058946567788554], "isController": false}, {"data": ["register", 2000, 0, 0.0, 77983.33749999986, 66720, 90519, 78107.5, 84273.3, 85890.65, 88248.92, 21.89908899789769, 29.85956824235174, 7.397208584716625], "isController": false}, {"data": ["cekout cart", 2000, 2000, 100.0, 887.823999999999, 17, 3021, 633.0, 2079.0, 2173.0, 2490.99, 14.78633742422002, 4.880646532603874, 3.4655478338015677], "isController": false}, {"data": ["add to interest", 2000, 0, 0.0, 4177.943499999996, 21, 14162, 4713.0, 7525.200000000001, 8476.349999999999, 11016.95, 13.51342220660671, 6.275150273477882, 3.1804050310470875], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400/Bad Request", 2000, 23.37540906965872, 3.3333333333333335], "isController": false}, {"data": ["500/Internal Server Error", 6556, 76.62459093034128, 10.926666666666666], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 60000, 8556, "500/Internal Server Error", 6556, "400/Bad Request", 2000, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["add to cart", 2000, 2000, "500/Internal Server Error", 2000, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["login", 2000, 556, "500/Internal Server Error", 556, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["payment success", 2000, 2000, "400/Bad Request", 2000, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["get cart", 2000, 2000, "500/Internal Server Error", 2000, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["cekout cart", 2000, 2000, "500/Internal Server Error", 2000, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
