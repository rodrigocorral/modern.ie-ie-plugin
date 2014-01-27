var modernIE = modernIE || {};
(function () {
    /**
     * Downloads a file using XMLHttpRequests via GET and executes callback when done
     * @param {String} url
     * @param {Function} callback
     * */
    function getFile(url, callback) {
        var xhr = new XMLHttpRequest();

        xhr.onerror = function (e) {
            //Error downloading the file. It could be it no longer exists
            callback();
        };

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    callback({
                        url: url,
                        content: xhr.responseText
                    });
                } else {
                    callback();
                }
            }
        };
        xhr.open("GET", url, true);
        xhr.send(null);
    }

    function getServerUrl(callback) {
        var server_url = "http://localhost:1337/package";
    }

    function analyze(serializedData, successCallback, errorCallback) {

        getServerUrl(function (serverUrl) {
            var xhr = new XMLHttpRequest(),
                analysisData;

            xhr.onerror = function (e) {
                errorCallback(e);
            };

            xhr.onreadystatechange = function () {
                if (this.readyState === 4) {
                    if (this.status === 200) {
                        analysisData = JSON.parse(this.responseText);

                        successCallback(analysisData);
                    } else {
                        errorCallback();
                    }
                }
            };

            xhr.open("POST", serverUrl);
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhr.send(JSON.stringify(serializedData));
        });
    }

    function endCallback(sendResponse) {
        return function () {
            sendResponse({
                status: "ok"
            });
        };
    }

    function isIE() {
        return 
            navigator.appName.indexOf("Internet Explorer") != -1  
            && (
                navigator.appVersion.indexOf("MSIE 9") != -1  //IE9
                || navigator.appVersion.indexOf("MSIE 1") != -1 //IE1x
            ); 
    }

    modernIE.getFile = getFile;
    modernIE.analyze = analyze;
    modernIE.isIE = isIE;
}());