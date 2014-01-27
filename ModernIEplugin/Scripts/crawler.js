/* global chrome */
var modernIE = modernIE || {};

(function () {
    "use strict";

    var isNotIFrame = window.parent === window.self || typeof XPCNativeWrapper !== 'undefined';

    /**
     *  Helper functions for css class manipulation
     *  */
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

    function toggleClass(item, className) {
        if (item.classList.contains(className)) {
            item.classList.remove(className);
        } else {
            item.classList.add(className);
        }
    }

    /**
     * Gets the HTML of the current page
     * */
    function getHtml() {
        var node = document.doctype;
        var doctype = "<!DOCTYPE " +
            node.name +
            (node.publicId ? ' PUBLIC "' + node.publicId + '"' : '') +
            (!node.publicId && node.systemId ? ' SYSTEM' : '') +
            (node.systemId ? ' "' + node.systemId + '"' : '') +
            '>';
        return doctype + document.documentElement.innerHTML;
    }

    /**
     * Downloads all the resources in a page that match the selector passed via the parameters "selector"
     * Ex.: To download all the JS files use getFiles('script', callback)
     *
     * @param {String} selector
     * @param {Function} callback
     * */
    function getFiles(selector, callback) {
        var nodes = document.querySelectorAll(selector),
            failedFiles = 0,
            contents = [];

        if (nodes.length === 0) {
            setTimeout(callback.bind(null, contents), 0);
            return;
        }

        function getFilesCallback(file) {
            if (file) {
                contents.push(file);
            } else {
                failedFiles++;
            }

            if ((contents.length + failedFiles) === nodes.length) {
                callback(contents);
            }
        }

        Array.prototype.forEach.call(nodes, function (node) {
            var url = node.getAttribute('href');
            if (!url) {
                url = node.getAttribute('src');
            }

            if (!url) {
                var file = {
                    url: "embeded",
                    content: node.textContent
                };

                setTimeout(getFilesCallback.bind(null, file), 0);
            } else {
                modernIE.getFile(url, getFilesCallback);
            }
        });
    }

    /**
     * Creates a new Item of result
     * @constructor
     * @param {string} heading
     * @param {string} flagged
     * @param {string} solution
     * @param {string} cleared
     * @param {string} passed
     * */
    function Item(heading, flagged, solution, cleared, passed) {
        this.heading = heading;
        this.flagged = flagged;
        this.solution = solution;
        this.passed = passed;
        this.cleared = cleared;

        return this;
    }

    /**
     * Generates the JavaScript libraries HTML table for that specific test
     *
     * @param {Object} test
     * */
    function createJSLibsTable(test) {
        var resultText =
            "<table border='0' cellpadding='0' cellspacing='0' class='skinnie-table-layout jslibs-table table-striped table-bordered table-hover'>" +
                "<thead>" +
                "<th>Framework</th>" +
                "<th>Version detected</th>" +
                "<th>Source line #</th>" +
                "<th>Nearest compatible update</th>" +
                "<th>Latest version released</th>" +
                "</thead>";

        for (var i = 0, li = test.data.length; i < li; i += 1) {
            var t = test.data[i];
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
        var resultText = "";

        for (var i = 0, li = test.data.length; i < li; i += 1) {
            var t = test.data[i];
            resultText = resultText +
                "<li>" +
                "<a href=" + t.url + "' title='" + t.name + "' class='cta'>Update " + t.name +
                "<span class='icon-right light-foreground' aria-role='hidden'></span>" +
                "</a>" +
                "</li>";
        }

        return resultText;
    }

    /**
     * Creates the HTML table for the CSS Prefixes test using the data of "test"
     *
     * @param {Object} test
     * */
    function createCSSPrefixesTable(test) {
        var resultText,
            selectorElement;

        resultText = '<div id="css_prefixes_list" class="css-prefixes-list">' +
            '<div class="header"><h4 class="selectors-list-header">List of selectors</h4>' +
            '</div>' +
            '<div class="content">' +
            '<p>The following is a list of missing selectors and their properties that may be causing compatibility problems. For example there may be a <em>-webkit-box-shadow</em> property but no <em>box-shadow</em> property, preventing non-WebKit browsers from rendering box shadows.</p>';

        for (var i = 0, li = test.data.length; i < li; i += 1) {
            var t = test.data[i];
            resultText = resultText +
                '<p class="css-location break"><strong>Location: ' + (t.cssFile === "embeded" ? t.cssFile : '<a href="' + t.cssFile + '", title="' + t.cssFile + '">' + t.cssFile + '</a>') + '</strong></p>' +
                '<table border="0" cellpadding="0" cellspacing="0" class="skinnie-table-layout css-prefixes-table table-striped table-bordered table-hover tcol-4">' +
                '<thead>' +
                '<th colspan="4">Selector</th>' +
                '<th colspan="2">Property</th>' + '<th>Source line #</th></thead>';
            for (var j = 0, lj = t.selectors.length; j < lj; j += 1) {
                selectorElement = t.selectors[j];
                resultText = resultText +
                    '<tr>' +
                    '<td colspan="4">' +
                    selectorElement.selector +
                    '</td>' +
                    '<td colspan="2">';
                for (var k = 0, lk = selectorElement.styles.length; k < lk; k += 1) {
                    resultText = resultText +
                        selectorElement.styles[k];
                    if (k !== lk - 1) {
                        resultText = resultText + ", ";
                    }
                }
                resultText = resultText +
                    '</td>' +
                    '<td>' +
                    selectorElement.lineNumber +
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

    /**
     * Creates the HTML table for the Browser Detection test using the data of "test"
     *
     * @param {Object} test
     * */
    function createBrowserDetectionTable(test) {
        var resultText = "";

        if (!test.data.javascript.passed) {
            resultText = resultText +
                '<div class="css-prefixes-list">' +
                '<div class="header">' +
                '<h4 class="selectors-list-header">Browser Detection Techniques Found</h4>' +
                '</div>' +
                '<div class="content">';

            for (var i = 0, li = test.data.javascript.data.length; i < li; i = i + 1) {
                var t = test.data.javascript.data[i];
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


    /**
     * Creates the HTML portion of the solution for the Browser Detection test
     *
     * @param {Object} test
     * @param {Object} solution
     * */
    function createBrowserDetectionSolution(test, solution) {
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

    /**
     * Creates the HTML table for the CSS Prefixes test using the data of "test"
     *
     * @param {Object} test
     * @param {bool} flagged
     * */
    function createImageCompressionFlagged(test, flagged) {
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
        var resultText = "";


        if (test.data.bug_list) {
            resultText = '<p>There is(are) currently <strong>{{bug_count}} known issue(s)</strong> to investigate:</p>' +
                '<ul>';

            for (var i = 0, li = test.data.bug_list; i < li; i = i + 1) {
                var bug = test.data.bug_list[i];
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
            baseQuery = (result.testName === 'touch' ? "reportbrowser" : "report") + testName.toLowerCase(),
            heading = locale[baseQuery + "heading"],
            flagged = locale[baseQuery + "flagged"],
            solution = locale[baseQuery + "solution"],
            cleared = locale[baseQuery + "cleared"],
            table,
            items;


        switch (testName) {
            case "jslibs":
                if (!passed) {
                    table = createJSLibsTable(result);
                }
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

    function getItems(analisysData, locale) {
        var results = analisysData.results,
            items = [],
            result,
            testName,
            passed;

        for (result in results) {
            if (results.hasOwnProperty(result)) {
                testName = results[result].testName;
                passed = results[result].passed;
                if (locale["report" + (testName === "touch" ? "browsertouch" : testName.toLowerCase()) + "heading"] !== undefined) {
                    //ERRROR?
                    //                    items[items.length] = createItem(results[result], locale);
                    items.push(createItem(results[result], locale));
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

    function createLeftColumn() {
        var html = '<div class="column left">' +
            '<div class="button-section coding-issue"></div>' +
            '<div class="button-section screenshots"></div>' +
            '<div class="button-section code-not-supported"></div>' +
            '</div>';

        return html;
    }

    function createRightColumn() {
        var html = '<div class="column right">' +
            '<a href="http://www.modern.ie" target="_blank">' +
            '</a>' +
            '</div>';

        return html;
    }

    function createTestItem(item) {
        var html = '<li class="test-item">' +
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
            (item.passed ? item.cleared : ('<div class="detail-section issue-found">' +
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

        for (var i = 0, li = items.length; i < li; i += 1) {
            html += createTestItem(items[i]);
        }

        html += '</ul>';

        return html;
    }

    function createColumnCenter(sections) {
        var html = "";

        for (var i = 0, li = sections.length; i < li; i += 1) {
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
                items: getItems(analisysData, section.items)
            };
            i += 1;

            section = locale["reportsection" + i + "heading"];
        }

        return sections;
    }

    function generateHTML(analisysData) {

        getLocale(function (locale) {
            var sections = getSections(locale, analisysData),
                pluginModernIe = document.querySelector(".plugin-modern-ie"),
                columnCenter,
                html;

            if (pluginModernIe) {
                columnCenter = pluginModernIe.querySelector(".column.center");

                html = createColumnCenter(sections);

                columnCenter.innerHTML = html;

                addExpandCollapseEvents();
            }
        });
    }

    function generateErrorHTML() {
        var html = '';
        html += '<div class="modern-ie-error">Error communicating with the server.<br/> Make sure the url server' +
            ' is the right one and it is up and running</div>';

        var centerColumn = document.querySelector('.plugin-modern-ie .column.center');
        centerColumn.innerHTML = html;
    }

    function getLocale(callback) {
        var locale;
        if (typeof chrome === "undefined") {
            locale = self.options.locale.moderncontentv4;
            setTimeout(callback.bind(null, locale), 0);
        } else {
            var jsonUrl = chrome.extension.getURL("data/locales/locale.json");
            modernIE.getFile(jsonUrl, function (response) {
                locale = JSON.parse((response.content)).moderncontentv4;
                setTimeout(callback.bind(null, locale), 0);
            });
        }
    }

    function sendData(data, callback) {
        if (!data.css || !data.js) {
            return;
        }

        if (data.css.length === 0 && data.js.length === 0) {
            return;
        }

        function successCallback(arg) {
            generateHTML(arg);
            if (typeof callback === 'function') {
                callback(arg);
            }
        }

        var serializedData = {
            css: JSON.stringify(data.css),
            js: JSON.stringify(data.js),
            html: data.html,
            url: data.url
        };

        modernIE.analyze(serializedData, successCallback, generateErrorHTML);
    }

    function collectCallback(results, type, callback) {
        return function (files) {
            results[type] = files || [];
            sendData(results, callback);
        };
    }

    function getFilesAndAnalyze(callback) {
        if (!isNotIFrame) {
            return;
        }

        var results = {
            url: "http://privatewebs.ite",
            html: getHtml()
        };

        getFiles('link[rel="stylesheet"], style', collectCallback(results, 'css', callback));
        getFiles('script', collectCallback(results, 'js', callback));
    }

    function ondetailtransitionend(evt) {
        var element = evt.currentTarget;

        element.style.transition = "";
        element.style.height = "auto";
        element.removeEventListener("transitionend", ondetailtransitionend, false);
    }

    function onExpandCollapse(evt) {
        var element = evt.currentTarget,
            detail,
            height;

        evt.preventDefault();

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

    function addExpandCollapseEvents() {
        var elements = document.querySelectorAll(".test-item-title");

        if (elements) {
            for (var i = 0, li = elements.length; i < li; i += 1) {
                elements[i].addEventListener("click", onExpandCollapse, true);
            }
        }
    }

    function removeExpandCollapseEvents() {
        var elements = document.querySelectorAll(".test-item-title");

        if (elements) {
            for (var i = 0, li = elements.length; i < li; i += 1) {
                elements[i].removeEventListener("click", onExpandCollapse);
            }
        }
    }

    function close() {
        var pluginElement = document.querySelector(".plugin-modern-ie");

        if (pluginElement && pluginElement.parentNode) {
            pluginElement.parentNode.removeChild(pluginElement);
            removeEvents();
        }
    }

    function addCloseEvent() {
        var buttonElement = document.querySelector(".plugin-modern-ie .header-button.close");

        if (buttonElement) {
            buttonElement.addEventListener("click", close, false);
        }
    }

    function removeCloseEvent() {
        var buttonElement = document.querySelector(".plugin-modern-ie .header-button.close");

        if (buttonElement) {
            buttonElement.removeEventListener("click", close);
        }
    }

    function toggleStatus() {
        var pluginElement = document.querySelector(".plugin-modern-ie");

        if (pluginElement) {
            toggleClass(pluginElement, "plugin-modern-ie-minimize");
        }
    }

    function addMinMaxEvent() {
        var buttonElement = document.querySelector(".header-button.more");

        if (buttonElement) {
            buttonElement.addEventListener("click", toggleStatus, false);
        }
    }

    function removeMinMaxEvent() {
        var buttonElement = document.querySelector(".header-button.more");

        if (buttonElement) {
            buttonElement.removeEventListener("click", toggleStatus);
        }
    }

    /**
     * Removes all the event handlers attached to the plugin HTML
     * */
    function removeEvents() {
        removeExpandCollapseEvents();
        removeCloseEvent();
        removeMinMaxEvent();
    }

    /**
     * Creates the main body of the plugin HTML
     * */
    function createBody() {
        var html = '<section class="scan-code">' +
            createLeftColumn() +
            createRightColumn() +
            '<div class="column center">' +
            '<div class="modern-ie-loader"></div>' +
            '</div>' +
            '</section>';

        return html;
    }

    /**
     * Generates the main HTML of the plugin and ads it to the page
     *
     * */
    function injectHTML() {
        if (isNotIFrame) {
            var pluginModernIe = document.querySelector(".plugin-modern-ie"),
                html;

            if (pluginModernIe) {
                pluginModernIe.parentNode.removeChild(pluginModernIe);
            }

            pluginModernIe = document.createElement("div");
            pluginModernIe.classList.add("plugin-modern-ie");

            html = createHeader();
            html += createBody();

            pluginModernIe.innerHTML = html;

            document.querySelector("body").appendChild(pluginModernIe);
        }
    }

    function scan(callback) {
        injectHTML();
        addCloseEvent();
        addMinMaxEvent();
        getFilesAndAnalyze(callback);
    }

    modernIE.scan = scan;
}());