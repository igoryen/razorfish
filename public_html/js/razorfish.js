var Razorfish = (function (name) {
    return name;
}(Razorfish || {}));

Razorfish.A = (function () {

    var tabLinks = new Array(); // to hold the tab link elements 
    var contentDivs = new Array(); // to hold the content divs:

    // showTab() is an onclick event handler 
    var showTab = function () {
        // Extract the ID of the selected element from the clicked link's href="..." attribute and store it in selectedId.
        var selectedId = getHash(this.getAttribute('href'));

        // Highlight the selected tab, and dim all others.
        for (var id in contentDivs) {
            if (id == selectedId) {
                tabLinks[id].parentNode.className = 'selected';
                // show the content <div>, i.e. do: class="tabContent"
                contentDivs[id].className = 'tabContent';
            } 
            else {
                tabLinks[id].parentNode.className = '';
                contentDivs[id].className = 'tabContent hide';
            }
        }

        // Stop the browser following the link
        return false;
    };

    // a helper function 
    // retrieves the first child of a given element that has a given tag name.
    // returns the first child of a specified element that matches a specified tag name
    var getFirstChildWithTagName = function (element, tagName) {
        // loop through the child nodes of element 
        for (var i = 0; i < element.childNodes.length; i++) {
            // until/when you find a node that matches tagName. 
            if (element.childNodes[i].nodeName == tagName)
                // return the node.
                return element.childNodes[i];
        }
    };

    // a helper function 
    // takes a URL and returns the part of the URL that appears after the hash (#) symbol.
    // returns the portion of a URL after any hash symbol
    var getHash = function (url) {
        var hashPos = url.lastIndexOf('#');
        return url.substring(hashPos + 1);
    };

    // format the string e.g. 1,000
    function addCommas(nStr) {
        nStr += '';
        x = nStr.split('.');
        x1 = x[0];
        x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
        return x1 + x2;
    }


    // 2
    var pieChart = function (data, width, height, cx, cy, r, colors, lx, ly, files) {

        var svgns = "http://www.w3.org/2000/svg"; // 1

        // 4
        var chart = document.createElementNS(svgns, "svg:svg");
        chart.setAttribute("width", width);
        chart.setAttribute("height", height);
        chart.setAttribute("viewBox", "0 0 " + width + " " + height);
        // 5
        var total = 0;
        for (var i = 0; i < data.length; i++) {
            total += data[i];
        }
        console.log("total: " + total + " files");


        var angles = []; // 6
        for (var i = 0; i < data.length; i++) {
            angles[i] = data[i] / total * Math.PI * 2;
            console.log(angles[i] + " radians.");
        }

        // 7
        startangle = 0;
        for (var i = 0; i < data.length; i++) {
            console.log("Next wedge.");
            var endangle = startangle + angles[i]; // 8
            // 9
            var x1 = cx + r * Math.sin(startangle);
            console.log("x1: " + x1);
            var y1 = cy - r * Math.cos(startangle);
            console.log("y1: " + y1);
            var x2 = cx + r * Math.sin(endangle);
            console.log("x2: " + x2);
            var y2 = cy - r * Math.cos(endangle);
            console.log("y2: " + y2);


            // 10
            var big = 0;
            if (endangle - startangle > Math.PI) {
                big = 1;
                console.log("this angle is larger than half a circle");
            }

            var path = document.createElementNS(svgns, "path"); // 11
            // 12
            var d = "M " + cx + "," + cy + // M[ove to] or start at circle center
                    " L " + x1 + "," + y1 + // L[ine to] draw line to (x1,y1)
                    " A " + r + "," + r + // A[rc elliptical] Draw an ark of radius r
                    " 0 " + big + " 1 " + // Arc details...
                    x2 + ", " + y2 + // Arc goes to (x2,y2)
                    " Z"; // Z = close path back to (cx, cy)

            // 13
            path.setAttribute("d", d); // 14
            path.setAttribute("fill", colors[i]); // 15
            path.setAttribute("stroke-width", "2"); // 17
            chart.appendChild(path); // 18

            startangle = endangle;

            console.log("Wedge ends.");
        }

        var innerCircle = document.createElementNS(svgns, "circle"); // 11
        innerCircle.setAttribute("cx", cx);
        innerCircle.setAttribute("cy", cy);
        innerCircle.setAttribute("r", 80);
        innerCircle.setAttribute("fill", "white"); // 15
        chart.appendChild(innerCircle); // 18

        // Total files
        var totalFiles = document.createElementNS(svgns, "text"); // 11
        totalFiles.setAttribute("x", cx - 40);
        totalFiles.setAttribute("y", cy - 20);
        totalFiles.setAttribute("fill", "red");
        totalFiles.setAttribute("font-size", "15");

        var totalFilesNum = document.createTextNode(addCommas(files) + " files");
        totalFiles.appendChild(totalFilesNum);
        chart.appendChild(totalFiles);

        // Todal GB
        var totalGB = document.createElementNS(svgns, "text"); // 11
        totalGB.setAttribute("x", cx - 50);
        totalGB.setAttribute("y", cy + 20);

        totalGB.setAttribute("fill", "#c09b75");
        totalGB.setAttribute("font-size", "40");

        var totalGBNumber = document.createTextNode("47GB");
        totalGB.appendChild(totalGBNumber);
        chart.appendChild(totalGB); // 18

        return chart;
    };

    var personData = function (views, messages, likes) {
        document.getElementById("views").innerHTML = views;
        document.getElementById("msg").innerHTML = messages;
        document.getElementById("likes").innerHTML = likes;
    };

    var init = function (total, audio, video, photo, files) {
        audio = (audio / total) * 100;
        video = (video / total) * 100;
        photo = (photo / total) * 100;
        var rest = 100 - (audio + video + photo);

        document.getElementById("audio-percent").innerHTML = Math.round(audio);
        document.getElementById("video-percent").innerHTML = Math.round(video);
        document.getElementById("photo-percent").innerHTML = Math.round(photo);

        var graph = document.getElementById("data-graph");

        var chart = pieChart(
                [audio, video, photo, rest],
                400, 360, 200, 200, 150,
                ['#4DAF7C', '#E35935', '#EAC85D', '#F4EDE7'],
                400, 100, files);
        graph.appendChild(chart);
    };

    var tabListItems = document.getElementById('tabs').childNodes;
    // loop through all the elements in the tabs list. 
    console.log("tabs: " + tabListItems.length);
    for (var i = 0; i < tabListItems.length; i++) {

        // For each link element, 
        if (tabListItems[i].nodeName === "DIV") {
            // retrieve the <a> link element inside
            var tabLink = getFirstChildWithTagName(tabListItems[i], 'A');
            // extract the part of the link's URL after the hash; this is the ID of the corresponding content <div>
            var id = getHash(tabLink.getAttribute('href'));
            // store the <a> by ID in the 'tabLinks' array
            tabLinks[id] = tabLink;
            // store the content <div> by ID in the 'contentDivs' array.
            contentDivs[id] = document.getElementById(id);
        }
    };

    // Assign onclick events to the tab links, and
    // highlight the first tab
    var i = 0;

    for (var id in tabLinks) {
        // assign showTab() to each tab link (an onclick event handler function) 
        tabLinks[id].onclick = showTab;

        tabLinks[id].onfocus = function () {
            this.blur();
        };
        // set tab 1 CSS class to 'selected' (highlight it) 
        if (i === 0) {
            tabLinks[id].parentNode.className = 'selected';
        }

        i++;
    };

    var i = 0;
    // set each div's CSS class (the first) to 'tabContent hide'.
    // i.e. hide all content divs except 
    for (var id in contentDivs) {
        if (i !== 0) {
            // if ( i === 4 ) {
            contentDivs[id].className = 'tabContent hide';
        }
        i++;
    };

    return {
        // expose the 2 funcions
        init: init,
        personData: personData
    };

})();


window.onload = function () {
    Razorfish.A.init(50, 27.5, 11.5, 8.5, 2435);
    Razorfish.A.personData(172,34,210);
};