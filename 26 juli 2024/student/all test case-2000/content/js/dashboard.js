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

    var data = {"OkPercent": 90.92662487737559, "KoPercent": 9.073375122624412};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.4015679297673877, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5961438249088067, 500, 1500, "Submit score (retake quiz)"], "isController": false}, {"data": [0.0795, 500, 1500, "view data in market place"], "isController": false}, {"data": [0.0755, 500, 1500, "add to cart"], "isController": false}, {"data": [0.43903074517978113, 500, 1500, "Submit subjourney quiz"], "isController": false}, {"data": [0.37005208333333334, 500, 1500, "Play subjourney video"], "isController": false}, {"data": [0.4004160166406656, 500, 1500, "view data my collection"], "isController": false}, {"data": [0.5552604166666667, 500, 1500, "Submit score quiz"], "isController": false}, {"data": [0.30572916666666666, 500, 1500, "Play subjourney quiz"], "isController": false}, {"data": [0.0385, 500, 1500, "login"], "isController": false}, {"data": [0.2709308372334893, 500, 1500, "reedem-coupon"], "isController": false}, {"data": [0.4306930693069307, 500, 1500, "Play subjourney interactive learning"], "isController": false}, {"data": [0.13806552262090482, 500, 1500, "view detail course"], "isController": false}, {"data": [0.3160500260552371, 500, 1500, "edit profile"], "isController": false}, {"data": [0.7107868681605003, 500, 1500, "Submit score interactive learning"], "isController": false}, {"data": [0.0, 500, 1500, "payment success"], "isController": false}, {"data": [0.4625, 500, 1500, "get cart"], "isController": false}, {"data": [0.6213541666666667, 500, 1500, "Submit score (video)"], "isController": false}, {"data": [0.6386138613861386, 500, 1500, "Submit score (retake interactive learning)"], "isController": false}, {"data": [0.9963522668056279, 500, 1500, "Download certificate"], "isController": false}, {"data": [0.1085, 500, 1500, "market place - searching course"], "isController": false}, {"data": [0.0, 500, 1500, "register"], "isController": false}, {"data": [0.0, 500, 1500, "cekout cart"], "isController": false}, {"data": [0.3889755590223609, 500, 1500, "add to interest"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 60143, 5457, 9.073375122624412, 81103.82539946493, 25, 4978774, 690.0, 138247.3000000006, 282778.0, 519962.7500000008, 11.191829441603206, 10.136725695551274, 3.083936890472086], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Submit score (retake quiz)", 9595, 0, 0.0, 22305.31776967164, 343, 1372159, 646.0, 6160.999999999998, 136074.19999999998, 567257.0799999998, 2.368055852059567, 0.6752659265638609, 0.6082018448160802], "isController": false}, {"data": ["view data in market place", 2000, 0, 0.0, 90831.47449999998, 477, 994896, 134158.5, 135584.0, 136442.94999999998, 172489.97, 0.9414418464310645, 7.568039546794603, 0.18203660702475663], "isController": false}, {"data": ["add to cart", 2000, 0, 0.0, 522778.4045000003, 657, 2317968, 136680.5, 1636645.4, 1654799.85, 1757447.3500000003, 0.7369118016056571, 0.26482767870203305, 0.1698351417763038], "isController": false}, {"data": ["Submit subjourney quiz", 1919, 68, 3.543512245961438, 15980.844710786867, 354, 1036184, 686.0, 4985.0, 97911.0, 294502.7999999989, 0.4747350179540875, 0.2020917161336927, 0.11172962824896004], "isController": false}, {"data": ["Play subjourney video", 1920, 0, 0.0, 59767.611458333355, 309, 1040067, 921.0, 262084.4, 346219.95, 689367.6699999999, 0.6201432207848753, 0.4421220453163198, 0.12233294003764139], "isController": false}, {"data": ["view data my collection", 1923, 0, 0.0, 25916.796671866912, 316, 1150772, 834.0, 12185.2, 37211.8, 778342.6, 0.6312420499774322, 0.919402158302901, 0.11712498974190637], "isController": false}, {"data": ["Submit score quiz", 9600, 1, 0.010416666666666666, 30309.182291666588, 342, 4196092, 681.0, 17785.59999999947, 253947.95, 602578.4299999996, 1.8214068812372515, 0.5198315323737998, 0.46775401445902987], "isController": false}, {"data": ["Play subjourney quiz", 1920, 0, 0.0, 55228.11562500004, 410, 1153314, 1221.0, 198510.70000000042, 408012.9499999966, 807710.5199999986, 0.6199926311292487, 0.9686227546861916, 0.12230323387510571], "isController": false}, {"data": ["login", 2000, 1147, 57.35, 43762.71249999999, 203, 1007824, 11975.5, 134244.7, 134936.85, 135841.91, 1.7614503077253687, 1.2681100485896066, 0.7060362438767583], "isController": false}, {"data": ["reedem-coupon", 1923, 451, 23.452938117524702, 65829.32657306286, 639, 1147961, 1339.0, 136180.4, 274593.0, 716633.96, 0.6312167712622071, 0.35934393973635953, 0.1682833774947095], "isController": false}, {"data": ["Play subjourney interactive learning", 1919, 0, 0.0, 35042.48566961958, 307, 1594731, 901.0, 20525.0, 253750.0, 774906.3999999998, 0.47473572261382213, 0.33070766654280825, 0.09364903903124226], "isController": false}, {"data": ["view detail course", 1923, 3, 0.15600624024961, 92601.07592303681, 687, 4798067, 3563.0, 316312.40000000014, 421591.599999999, 1032349.2, 0.36460381425265315, 0.6299488008814766, 0.07181159368080728], "isController": false}, {"data": ["edit profile", 1919, 667, 34.75768629494529, 9269.742574257436, 76, 1133680, 732.0, 1284.0, 1459.0, 404735.5999999848, 0.4747966835983601, 0.13043102636432913, 0.24986254725699145], "isController": false}, {"data": ["Submit score interactive learning", 1919, 0, 0.0, 18235.537780093797, 185, 1034254, 305.0, 4675.0, 100523.0, 563628.1999999998, 0.4747758916768743, 0.20599540212392317, 0.12518504956323834], "isController": false}, {"data": ["payment success", 1982, 1335, 67.35620585267407, 392812.3037336022, 103, 4978774, 30118.0, 1480670.2, 1621907.8499999999, 4847938.0600000005, 0.3750812092451652, 0.13000439110665798, 0.34927493426616646], "isController": false}, {"data": ["get cart", 2000, 0, 0.0, 130147.10400000005, 98, 1145670, 811.0, 770411.4, 774541.4, 1036525.98, 0.7370666002323971, 0.8455481920170896, 0.13316144633104832], "isController": false}, {"data": ["Submit score (video)", 1920, 0, 0.0, 32503.19062499999, 184, 1035756, 342.0, 134872.5, 163347.499999995, 597034.7999999982, 0.6201700622592601, 0.2690955399032599, 0.1641270379611909], "isController": false}, {"data": ["Submit score (retake interactive learning)", 1919, 0, 0.0, 24316.88014590932, 184, 1144116, 493.0, 7806.0, 134640.0, 776758.7999999999, 0.4747784758843955, 0.20642369100370248, 0.1256493818014367], "isController": false}, {"data": ["Download certificate", 1919, 0, 0.0, 162.2428348097969, 25, 169650, 35.0, 72.0, 121.0, 259.5999999999999, 0.4748152451570824, 0.09969265401247336, 0.09227366580689395], "isController": false}, {"data": ["market place - searching course", 2000, 0, 0.0, 96422.51749999997, 306, 559093, 135081.0, 135294.9, 136045.0, 193501.67000000016, 0.885138654757421, 2.954163658347765, 0.2039967993386244], "isController": false}, {"data": ["register", 2000, 722, 36.1, 213464.78049999982, 72723, 342469, 214906.5, 339193.9, 339880.0, 341236.79, 5.76601510695958, 6.10914649912789, 1.9364181964625498], "isController": false}, {"data": ["cekout cart", 2000, 1063, 53.15, 226413.5995000002, 78, 4797126, 10460.0, 854046.7000000001, 1083161.7999999998, 1984725.5500000017, 0.37832951252053143, 0.17713247380493746, 0.08714565391844388], "isController": false}, {"data": ["add to interest", 1923, 0, 0.0, 57865.36557462291, 188, 1128852, 1854.0, 133762.4, 136279.8, 767226.52, 0.6521500263844369, 0.2980334019382387, 0.15348452769399343], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400/Bad Request", 1587, 29.081913139087412, 2.638711071945197], "isController": false}, {"data": ["500/Internal Server Error", 2195, 40.2235660619388, 3.6496350364963503], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 81, 1.4843320505772402, 0.1346790150142161], "isController": false}, {"data": ["401/Unauthorized", 1143, 20.945574491478833, 1.9004705452006052], "isController": false}, {"data": ["404/Not Found", 451, 8.26461425691772, 0.7498794539680428], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 60143, 5457, "500/Internal Server Error", 2195, "400/Bad Request", 1587, "401/Unauthorized", 1143, "404/Not Found", 451, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 81], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Submit subjourney quiz", 1919, 68, "400/Bad Request", 68, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Submit score quiz", 9600, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["login", 2000, 1147, "401/Unauthorized", 1143, "500/Internal Server Error", 4, "", "", "", "", "", ""], "isController": false}, {"data": ["reedem-coupon", 1923, 451, "404/Not Found", 451, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["view detail course", 1923, 3, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["edit profile", 1919, 667, "400/Bad Request", 667, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["payment success", 1982, 1335, "500/Internal Server Error", 1146, "400/Bad Request", 130, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 59, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["register", 2000, 722, "400/Bad Request", 722, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["cekout cart", 2000, 1063, "500/Internal Server Error", 1045, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 18, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
