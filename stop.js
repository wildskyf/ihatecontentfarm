function decodeQuery() {
    var queryString = window.location.search.substring(1);
    var token = queryString.split("&");
    var to = "";
    for (var i = 0; i < token.length; i++) {
        var pair = token[i].split("=");
        if (decodeURIComponent(pair[0]) == "to") {
            to = decodeURIComponent(pair[1]);
            break;
        }
    }
    return to;
}

function unblockTemp(hostname) {
    var key = "tmpWhitelist";

    var Whitelist;
    try {
        Whitelist = JSON.parse(localStorage.getItem(key) || "");
    } catch (e) {
        Whitelist = {};
    }

    var field = hostname;

    Whitelist[field] = new Date().getTime();

    try {
        localStorage.setItem(key,JSON.stringify(Whitelist));
    } catch (err) {
        // e.g. quote exceed. Just purge old data
        Whitelist = {};
        Whitelist[field] = true;
        localStorage.setItem(key,JSON.stringify(Whitelist));
    }

    // Disable web request filter
    LocalStorageStore.blockWebRequestFilter();
}

window.onload = () => {
    var to = decodeQuery();
    var hostname = Utils.hostname(to);
    document.querySelector("#warningText").textContent = browser.i18n.getMessage("header") + " : " + hostname;

    var trTable = {
        "#detailsLink" : "details",
        "title" : "title",
        "#messageText" : "body",
        "#back" : "backBtn",
        "#continue" : "contBtn",
        "#continueNoAds" : "contNoAdsBtn"
    };

    Utils.trFromTable(trTable);

    document.querySelector("#continue").addEventListener('click', () => {
        unblockTemp(hostname);
        window.location.href = to;
    });

    document.querySelector("#continueNoAds").addEventListener('click', () => {
        // Only disable web request so that it could load images.
        // In case user need to switch to full version in cache.
        LocalStorageStore.blockWebRequestFilter();
        window.location.href = UrlFormatter.googleWebCache(to);
    });

    document.querySelector("#back").addEventListener('click', () => {
        if (history.length <= 2) {
            if (window.opener || window.parent)
                window.close();
            else
                window.history.go(-1);
        }
        else {
            window.history.go(-2);
        }
    });

    var offsetY = document.body.clientWidth > 1000 ?
        (document.body.clientHeight/2 - document.querySelector('.content').offsetHeight/2 - 20) :
        30;
    document.querySelector('.content').style.top = offsetY;
};

