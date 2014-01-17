alert("CRAWLER!!!!!!")

/**
 * Created by molant on 8/7/13.
 */
function getHtml() {
    var node = document.doctype;
    var doctype = "<!DOCTYPE "
        + node.name
        + (node.publicId ? ' PUBLIC "' + node.publicId + '"' : '')
        + (!node.publicId && node.systemId ? ' SYSTEM' : '')
        + (node.systemId ? ' "' + node.systemId + '"' : '')
        + '>';
    return doctype + document.documentElement.innerHTML;
}

function getFile(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            callback({url: url, content: xhr.responseText, code: xhr.responseText});
        }
    };
    xhr.open("GET", url, true);
    xhr.send(null);
}

function getFiles(selector, callback) {
    console.log('loading ' + selector);
    var nodes = document.querySelectorAll(selector);
    var contents = [];
    if (nodes.length === 0) {
        setTimeout(callback.bind(null, contents), 0);
        return;
    }
    Array.prototype.forEach.call(nodes, function (node) {
        var url = node.getAttribute('href');
        if (!url) {
            url = node.getAttribute('src');
        }

        if (!url) {
            contents.push({
                url: "embeded",
                content: node.innerText
            });
            if (contents.length === nodes.length) {
                callback(contents);
            }
        } else {
            getFile(url, function (file) {
                contents.push(file);
                if (contents.length === nodes.length) {
                    callback(contents);
                }
            });
        }
    });
}

//function getXml(analisysData, callback){
//    var xmlURL = chrome.extension.getURL("modernIE-locales.xml"),
//        xhr = new XMLHttpRequest();
//
//    xhr.onreadystatechange = function () {
//        if (xhr.readyState === 4) {
//            callback(analisysData, xhr.responseXML);
//        }
//    };
//
//    xhr.open("GET", xmlURL, true);
//    xhr.send(null);
//}

function Item(heading, flagged, solution, cleared, passed) {
    this.heading = heading;
    this.flagged = flagged;
    this.solution = solution;
    this.passed = passed;
    this.cleared = cleared;

    return this;
}

function createJSLibsTable(test) {
    var resultText,
        t,
        i,
        li;

    resultText =
        "<table border='0' cellpadding='0' cellspacing='0' class='skinnie-table-layout jslibs-table table-striped table-bordered table-hover'>" +
            "<thead>" +
            "<th>Framework</th>" +
            "<th>Version detected</th>" +
            "<th>Source line #</th>" +
            "<th>Nearest compatible update</th>" +
            "<th>Latest version released</th>" +
            "</thead>";

    for (i = 0, li = test.data.length; i < li; i += 1) {
        t = test.data[i];
        resultText = resultText + "<tr>" +
            "<td>" + t.name + "</td>" +
            "<td>" + t.version + "</td>" +
            "<td>" + t.lineNumber + "</td>" +
            "<td><a href='" + t.url + "' title='" + t.name + " version " + t.minVersion + "'>" + t.minVersion + "</a>" +
            "</td>" +
            "<td>" +
            "<a href='" + t.url + "' title='" + t.name + "latest version'>latest</a>" +
            "</td>" +
            "</tr>";
    }

    resultText = resultText + "</table>";

    return resultText;
}

function createJSListItems(test) {
    "use strict";
    var resultText = "",
        i,
        li,
        t;

    for (i = 0, li = test.data.length; i < li; i += 1) {
        t = test.data[i];
        resultText = resultText +
            "<li>" +
            "<a href=" + t.url + "' title='" + t.name + "' class='cta'>Update " + t.name +
            "<span class='icon-right light-foreground' aria-role='hidden'></span>" +
            "</a>" +
            "</li>";
    }

    return resultText;
}

function createCSSPrefixesTable(test) {
    "use strict";

    var resultText,
        selector,
        i,
        li,
        j,
        lj,
        k,
        lk,
        t;

    resultText = '<div id="css_prefixes_list" class="css-prefixes-list">' +
        '<div class="header"><h4 class="selectors-list-header">List of selectors</h4>' +
        '</div>' +
        '<div class="content">' +
        '<p>The following is a list of missing selectors and their properties that may be causing compatibility problems. For example there may be a <em>-webkit-box-shadow</em> property but no <em>box-shadow</em> property, preventing non-WebKit browsers from rendering box shadows.</p>';

    for (i = 0, li = test.data.length; i < li; i += 1) {
        t = test.data[i];
        resultText = resultText +
            '<p class="css-location break"><strong>Location: ' + (t.cssFile === "embeded" ? t.cssFile : '<a href="' + t.cssFile + '", title="' + t.cssFile + '">' + t.cssFile + '</a>') + '</strong></p>' +
            '<table border="0" cellpadding="0" cellspacing="0" class="skinnie-table-layout css-prefixes-table table-striped table-bordered table-hover tcol-4">' +
            '<thead>' +
            '<th colspan="4">Selector</th>' +
            '<th colspan="2">Property</th>' + '<th>Source line #</th></thead>';
        for (j = 0, lj = t.selectors.length; j < lj; j += 1) {
            selector = t.selectors[j];
            resultText = resultText +
                '<tr>' +
                '<td colspan="4">' +
                selector.selector +
                '</td>' +
                '<td colspan="2">';
            for (k = 0, lk = selector.styles.length; k < lk; k += 1) {
                resultText = resultText +
                    selector.styles[k];
                if (k !== lk - 1) {
                    resultText = resultText + ", ";
                }
            }
            resultText = resultText +
                '</td>' +
                '<td>' +
                selector.lineNumber +
                '</td>' +
                '</tr>';
        }
        resultText = resultText + '</table>';
    }
    resultText = resultText +
        '</div>' +
        '</div>';

    return resultText;
}

function createBrowserDetectionTable(test) {
    "use strict";
    var resultText = "",
        i,
        li,
        t;


    if (!test.data.javascript.passed) {
        resultText = resultText +
            '<div class="css-prefixes-list">' +
            '<div class="header">' +
            '<h4 class="selectors-list-header">Browser Detection Techniques Found</h4>' +
            '</div>' +
            '<div class="content">';

        for (i = 0, li = test.data.javascript.data.length; i < li; i = i + 1) {
            t = test.data.javascript.data[i];
            resultText = resultText +
                '<p class="css-location break">' +
                '<strong>Location: ' + (t.url === "embeded" ? t.url : '<a href="' + t.url + '" title="' + t.url + '">' + t.url + '</a>') + '</strong>' +
                '</p>' +
                '<table border="0" cellpadding="0" cellspacing="0" class="table-striped table-bordered table-hover tcol-2">' +
                '<thead>' +
                '<th>Browser detection type</th>' +
                '<th>Source line #</th>' +
                '</thead>';

            if (!t.passed) {
                resultText = resultText +
                    '<tr>' +
                    '<td>' +
                    t.pattern +
                    '</td>' +
                    '<td>' +
                    t.lineNumber +
                    '</td>' +
                    '</tr>';

            }

            resultText = resultText +
                '</table>';
        }
        resultText = resultText +
            '</div>' +
            '</div>' +
            '<p>We suggest that you implement feature detection – a practice that first determines if a browser or device supports a specific feature and then chooses the best experience to render based on this information. You may implement feature detection as an alternative to browser detection through a framework like <a href="http://modernizr.com/" title="Modernizr: the feature detection library for HTML5/CSS3">Modernizr</a> or through feature detection code.</p>' +
            '<p>Feature detection is an emerging best practice that helps you support many versions of browsers across many different devices. This can help you build this webpage with web standards like HTML5 and CSS3 to work in Internet Explorer 9 and 10 while providing a fallback experience for older versions of IE. It can also decrease additional testing needed when new versions of browsers are released.</p>';
    }
    if (!test.data.comments.passed) {
        resultText = resultText +
            '<p>You are targeting all versions of IE indiscriminately, from IE6 to IE9. Are you sure your website is rendering as it should in IE9?</p>';
    }
    return resultText;
}

function createBrowserDetectionSolution(test, solution) {
    "use strict";
    var resultText,
        item1 = "",
        item2 = "";

    if (!test.data.comments.passed) {
        item1 = item1 +
            '<li>' +
            '<p>Just make sure the conditional comments in your html are targeting the right versions of IE and not all of them.</p>' +
            '</li>';
    }

    if (!test.data.javascript.passed) {
        item2 = item2 +
            '<li>' +
            '<a href="http://msdn.microsoft.com/en-us/hh561717" title="Browser and feature detection: Make your website look great everywhere" class="cta">Learn feature detection<span class="icon-right light-foreground" aria-role="hidden"></span></a>' +
            '</li>' +
            '<li>' +
            '<a href="http://modernizr.com/" title="Modernizr: the feature detection library for HTML5/CSS3" class="cta">Use Modernizr<span class="icon-right light-foreground" aria-role="hidden"></span></a>' +
            '</li>';
    }

    resultText = solution.replace("{{item1}}", item1).replace("{{item2}}", item2);

    return resultText;
}

function createImageCompressionFlagged(test, flagged) {
    "use strict";
    var resultText = flagged;
    if (test.data) {
        resultText = resultText
            .replace("{{data.total_savings}}", test.data.total_saving)
            .replace("{{data.image_count}}", test.data.image_count)
            .replace("{{data.total_savings}}", test.data.total_saving)
            .replace("{{data.image_count}}", test.data.image_count)
            .replace("{{data.total_size}}", test.data.total_size)
            .replace("{{data.total_kraked_size}}", test.data.total_kraked_size)
            .replace("{{data.total_savings}}", test.data.total_saving);
    }
    return resultText;
}

function createBugListTable(test) {
    "use strict";
    var resultText = "",
        bug,
        i,
        li;

    if (test.data.bug_list) {
        resultText = '<p>There is(are) currently <strong>{{bug_count}} known issue(s)</strong> to investigate:</p>' +
            '<ul>';

        for (i = 0, li = test.data.bug_list; i < li; i = i + 1) {
            bug = test.data.bug_list[i];
            resultText = resultText +
                '<li>' +
                bug.id +
                '</li>';
        }

        resultText = resultText + '</ul>';
    }

    return resultText;
}

function createItem(result, locale) {
    var testName = result.testName,
        passed = result.passed,
        table,
        items,
        baseQuery = "report" + testName.toLowerCase(),
        heading,
        flagged,
        solution,
        cleared;

    if(result.testName === "touch"){
        baseQuery = "reportbrowser" + testName.toLowerCase();
    }

    heading = locale[baseQuery + "heading"];
    flagged = locale[baseQuery + "flagged"];
    solution = locale[baseQuery + "solution"];
    cleared = locale[baseQuery + "cleared"];

    switch (testName) {
        case "jslibs":
            if (!passed)
                table = createJSLibsTable(result);
            flagged = flagged.replace("{{table}}", table);
                items = createJSListItems(result);
                solution = solution.replace("{{items}}", items);
                break;
            case "cssprefixes":
                if (!passed) {
                    table = createCSSPrefixesTable(result);
                    flagged = flagged.replace("{{table}}", table);
                }
                break;
            case "pluginfree":
                if (!passed) {
                    if (result.data.cvlist) {
                        flagged = locale[baseQuery + "onlist"];
                        solution = locale[baseQuery + "solutiononlist"];
                    }
                    if (result.data.activex) {
                        flagged = locale[baseQuery + "offlist"];
                        solution = locale[baseQuery + "solutionofflist"];
                    }
            }
            break;
        case "browserDetection":
            if (!passed) {
                table = createBrowserDetectionTable(result);
                flagged = flagged.replace("{{table}}", table);
                solution = createBrowserDetectionSolution(result, solution);
            }
            break;
        case "imageCompression":
            if (!passed) {
                flagged = createImageCompressionFlagged(result, flagged);
            }
            break;
        case "prefetch":
            if (passed) {
                cleared = cleared.replace("{{prefetchUsed}}", result.data.prefetchUsed);
            }
            break;
        case "buglist":
            if (!passed) {
                table = createBugListTable(result);
                flagged = flagged.replace("{{table}}", table);
            }
            break;
    }


    return new Item(heading, flagged, solution, cleared, passed);
}

//function xmlToObject(xml)
//{
//    var i, li,
//        j, lj,
//        child,
//        subChild,
//        childObject;
//    var result = {};
//
//    for(i = 0, li = xml.children.length; i < li; i += 1){
//        child = xml.children[i];
//
//
//
//        childObject = {};
//        for(j = 0, lj = child.children.length; j < lj; j = j + 1){
//            subChild = child.children[j];
//            childObject[subChild.nodeName.toLowerCase()] = subChild.textContent;
//        }
//
//        result[child.nodeName.toLowerCase()] = childObject;
//    }
//
//    return result;
//}

function getItems(analisysData, locale) {
    var results = analisysData.results,
        result,
        testName,
        passed,
        items = [];

    for (result in results) {
        if (results.hasOwnProperty(result)) {
            testName = results[result].testName;
            passed = results[result].passed;
            if(locale["report" + (testName === "touch" ? "browsertouch" : testName.toLowerCase())+ "heading"] !== undefined) {
                items[items.length] = createItem(results[result], locale);
            }
        }
    }

    return items;
}

function createHeader() {
    var headerHtml = '<header class="main-header">' +
                        '<div class="header-button close"></div>' +
                        '<div class="header-button more"></div>' +
                        '<h4 class="header-title">Analisys result</h4>' +
                        '</header>';

    return headerHtml;
}

function createColumnLeft() {
    var html =  '<div class="column left">' +
                    '<div class="button-section coding-issue"></div>' +
                    '<div class="button-section screenshots"></div>' +
                    '<div class="button-section code-not-supported"></div>' +
                '</div>';

    return html;
}

function createColumnRight() {
    var html =  '<div class="column right">' +
                    '<a href="http://www.modern.ie" target="_blank">' +
                        //'<img src="chrome-extension://nkdmolgobedhjehchdjjimhbddgehebf/images/banner-example.png">' +
                    '</a>' +
                '</div>';

    return html;
}

function createTestItem(item) {
    var html =  '<li class="test-item">' +
                    '<a title="' + item.heading + '" href="#" class="padding-list test-item-title collapsed ' + (item.passed ? 'ok' : 'warning') + '">' +
                        '<div class="test-item-title-column">' +
                            '<h3 class="test-item-description correct">' + item.heading + '</h3>' +
                        '</div>' +
                        '<div class="test-item-title-column">' +
                            '<span class="test-item-warning">' +
                                (item.passed ? "" : "We found something") +
                            '</span>' +
                        '</div> ' +
                        '<div class="test-item-title-column">' +
                            '<span class="test-item-show-detail expand">View details</span>' +
                            '<span class="test-item-show-detail contract">Hide details</span>' +
                        '</div>' +
                        '<div class="clear"></div>' +
                    '</a>' +
                    '<div class="test-item-detail">' +
                        '<div class="test-item-content padding-list">' +
                            (item.passed ? item.cleared :   ('<div class="detail-section issue-found">' +
                                                                '<h4 class="detail-section-header">What did we find?</h4>' +
                                                                '<div>' +
                                                                    item.flagged +
                                                                '</div>' +
                                                            '</div>' +
                                                            '<div class="detail-section fix-or-implement">' +
                                                                '<h4 class="detail-section-header">Solutions</h4>' +
                                                                item.solution +
                                                            '</div>' +
                                                            '<div class="clear"></div>')) +
                        '</div>' +
                    '</div>';

    html += '</li>';

    return html;
}

function createSectionTestList(items) {
    var html = '<ul class="section-tests-list">';

    for (i = 0, li = items.length; i < li; i += 1) {
        html += createTestItem(items[i]);
    }

    html += '</ul>'

    return html;
}

function createColumnCenter(sections) {
    var html = "",
        i,
        li;

    for(i = 0, li = sections.length; i < li; i += 1) {
         html += '<ul class="section-list">' +
                    '<li class="section-item">' +
                        '<h3 class="padding-list section-item-description">' +
                            sections[i].title +
                        '</h3>' +
                        createSectionTestList(sections[i].items) +
                    '</li>' +
                 '</ul>';
    }
    return html;
}

function getSections(locale, analisysData) {
    var i = 1,
        sections = [],
        section;

    section = locale["reportsection" + i + "heading"];

    while (section) {
        sections[sections.length] = {
            title: section.title,
            items : getItems(analisysData, section.items)
        };
        i += 1;

        section = locale["reportsection" + i + "heading"];
    }

    return sections;
}

function generateHTML(analisysData, locale) {
    var sections = getSections(locale, analisysData),
        pluginModernIe,
        columnCenter,
        html;

    pluginModernIe = document.querySelector(".plugin-modern-ie");
    if (pluginModernIe) {
        columnCenter = pluginModernIe.querySelector(".column.center");

        html = createColumnCenter(sections);

        columnCenter.innerHTML = html;

        RegisterEvents();
    }
}

function sendData(data, sendResponse) {
    if (!data.css || !data.js) {
        return;
    }

    if (data.css.length === 0 && data.js.length === 0) {
        return;
    }

    var xhr = new XMLHttpRequest(),
        analisysData,
        jsonUrl = chrome.extension.getURL("locale.json");

    chrome.storage.sync.get("server_url", function (item){
        if (!item.server_url) {
            //TODO: default server url;
            item.server_url = "http://localhost:1337/package";
        }

        xhr.open("POST", item.server_url);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.onreadystatechange = function () {//Call a function when the state changes.
            if (xhr.readyState == 4 && xhr.status == 200) {
                console.log(xhr.responseText);
                analisysData = JSON.parse(xhr.responseText);

                getFile(jsonUrl, function (response) {
                    var locale = JSON.parse((response.content));
                    generateHTML(analisysData, locale.moderncontentv4);
                });
                sendResponse({status: "ok"});
            }
        };

        var serializedData = {
            css: JSON.stringify(data.css),
            js: JSON.stringify(data.js),
            html: data.html,
            url: data.url
        };

        xhr.send(JSON.stringify(serializedData));
    });
//
//    var form = document.createElement("form");
//    form.setAttribute("method", "post");
//    form.setAttribute("action", "http://localhost:1337/package");
//
//    for (var key in data) {
//        if (data.hasOwnProperty(key)) {
//            var hiddenField = document.createElement("input");
//            hiddenField.setAttribute("type", "hidden");
//            hiddenField.setAttribute("name", key);
//            hiddenField.setAttribute("value", JSON.stringify(data[key]));
//
//            form.appendChild(hiddenField);
//        }
//    }
//
//    document.body.appendChild(form);
//    form.submit();
}

function collect(sendResponse) {
    if (window.parent === self) {
        var results = {
            url: "http://privatewebs.ite",
            html: getHtml()
        };

        getFiles('link[rel="stylesheet"], style', function (files) {
            results.css = files || [];
            sendData(results, sendResponse);
            console.log(results.css.length + ' css files downloaded');
        });

        getFiles('script', function (files) {
            results.js = files || [];
            sendData(results, sendResponse);
            console.log(results.js.length + ' JS files downloaded');
        });
    }
}

function hasClass(item, className) {
    var result = false;

    if (item) {
        if (item.classList) {
            result = item.classList.contains(className);
        } else {
            result = item.className.indexOf(className) !== -1;
        }
    }

    return result;
}

function addClass(item, className) {
    if (item) {
        if (item.classList) {
            item.classList.add(className);
        } else {
            if (item.className !== undefined && item.className.indexOf(className) === -1) {
                item.className = item.className + " " + className;
            }
        }
    }

    return item;
}

function removeClass(item, className) {
    if (item) {
        if (item.classList) {
            item.classList.remove(className);
        } else {
            item.className = item.className.replace(className, "");
        }
    }
}

function ondetailtransitionend(evt) {
    var element;

    element = evt.currentTarget;
    element.style.transition = "";
    element.style.height = "auto";
    element.removeEventListener("transitionend", ondetailtransitionend, false);
}

function onExpandCollapse(evt) {
    var element,
        detail,
        height;
    evt.preventDefault();
    element = evt.currentTarget;

    if (hasClass(element, "collapsed")) {
        removeClass(element, "collapsed");
        addClass(element, "expanded");
        if (element.parentElement) {
            detail = element.parentElement.querySelector(".test-item-detail");
            detail.removeEventListener("transitionend", ondetailtransitionend, false);
            detail.addEventListener("transitionend", ondetailtransitionend, false);
            if (detail) {
                detail.style.transition = "height 0.25s linear";
                detail.style.height = detail.scrollHeight + "px";
            }
        }
    } else if (hasClass(element, "expanded")) {
        removeClass(element, "expanded");
        addClass(element, "collapsed");
        if (element.parentElement) {
            detail = element.parentElement.querySelector(".test-item-detail");
            detail.removeEventListener("transitionend", ondetailtransitionend, false);
            if (detail) {

                detail.style.height = detail.clientHeight + "px";
                setTimeout(function () {
                    detail.style.transition = "height 0.25s linear";
                    detail.style.height = 0;
                }, 0);
            }
        }
    }
}

function RegisterExpandCollapseEvents() {
    var i,
        li,
        elements;

    elements = document.querySelectorAll(".test-item-title");

    if (elements) {
        for (i = 0, li = elements.length; i < li; i += 1) {
            elements[i].addEventListener("click", onExpandCollapse, true);
        }
    }
}

function RegisterCloseEvent(){
    "use strict";
    var buttonElement = document.querySelector(".plugin-modern-ie .header-button.close");

    if(buttonElement){
        buttonElement.addEventListener("click", function (){
            var pluginElement = document.querySelector(".plugin-modern-ie");

            if(pluginElement && pluginElement.parentNode){
                pluginElement.parentNode.removeChild(pluginElement);
            }
        }, false);
    }
}

function RegisterMinMaxPlugin(){
    "use strict";
    var buttonElement = document.querySelector(".header-button.more");

    if(buttonElement){
        buttonElement.addEventListener("click", function (){
            var pluginElement = document.querySelector(".plugin-modern-ie");

            if(pluginElement){
                if(pluginElement.classList.contains("plugin-modern-ie-minimize")){
                    pluginElement.classList.remove("plugin-modern-ie-minimize");
                }else{
                    pluginElement.classList.add("plugin-modern-ie-minimize");
                }
            }
        }, false);
    }
}

function RegisterEvents() {
    RegisterExpandCollapseEvents();
    RegisterCloseEvent();
    RegisterMinMaxPlugin();
}

function createBodySchema(){
    "use strict";
        var html;

    html =  '<section class="scan-code">' +
                createColumnLeft() +
                createColumnRight() +
                '<div class="column center">' +
                    '<img id="modern-ie-loader"/>' +
                '</div>'
            '</section>';
    return html;
}

function CreateHTMLSchema(){
    "use strict";
    if (window.parent === self){
        var pluginModernIe,
            loader,
            html;

        pluginModernIe = document.querySelector(".plugin-modern-ie");
        if (pluginModernIe) {
            pluginModernIe.parentNode.removeChild(pluginModernIe);
        }

        pluginModernIe = document.createElement("div");

        pluginModernIe.classList.add("plugin-modern-ie");

        html = createHeader();
        html += createBodySchema();

        pluginModernIe.innerHTML = html;

        loader = pluginModernIe.querySelector("#modern-ie-loader");

        loader.src = chrome.extension.getURL("images/loader.gif");

        document.querySelector("body").appendChild(pluginModernIe);
    }
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log(sender.tab ?
        "from a content script:" + sender.tab.url :
        "from the extension");

    if (request.scan) {

        CreateHTMLSchema();

        collect(sendResponse);
    }
    return true;
});