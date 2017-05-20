var isDev = false;
var handleTabId = null;
var handleUrl = '';

const toJSON = response => response.json();

fetch('https://cdn.rawgit.com/wildskyf/content-farm-list/master/data/list.json')
    .then(toJSON)
    .then(data => {
        if (!Array.isArray(data) || data.length === 0) return;
        sites = data;
    });

// set default block way
browser.storage.local.get().then( results => {
    if ((typeof results.length === 'number') && (results.length > 0)) {
        results = results[0];
    }
    if (results.blockRequest === undefined && results.blockLoading === undefined) {
        browser.storage.local.set({
            blockLoading: true
        });
    }
});

function hostname(url) {
    var parser = document.createElement("a");
    parser.href = url;
    return parser.hostname;
}

function block(url) {
    var filter = new Filter(),
        ret = false,
        domain = hostname(url),
        key = "tmpWhitelist";

    filter.appendBlacklist(sites);
    filter.appendBlacklist(ListFormatter.parse(LocalStorageStore.userBlacklist));

    filter.appendWhitelist(ListFormatter.parse(LocalStorageStore.userWhitelist));

    if (filter.match(domain)) {
        var Whitelist ;
        try {
            Whitelist = JSON.parse(localStorage.getItem(key) || "");
        } catch (e) {
            Whitelist = {};
        }

        if (Whitelist.hasOwnProperty(domain)) {
            var timestamp = (new Date()).getTime();
            var threshold = 10 * 60 * 1000; // Ten minutes
            if (timestamp - Whitelist[domain] > threshold) {
                delete Whitelist[domain];

                try {
                    localStorage.setItem(key,JSON.stringify(Whitelist));
                } catch (err) {
                    console.error(err);
                }
            }
        }

        if (!Whitelist.hasOwnProperty(domain)) {
            ret = true;
        }
    }
    return ret;
}

function handle(tab) {
    if (!block(tab.url)) return;

    var replacePage = () => {
        if ((handleTabId || tab.id || tab.tabId) == false) return;

        browser.tabs.update( handleTabId || tab.id || tab.tabId, {
            url: "stop.html?to=" + encodeURIComponent(tab.url)
        });
    }

    if (handleTabId) {
        browser.tabs.get(handleTabId).then( newtab => {
            isDev && console.log(newtab.url)
            isDev && console.log(tab.url);
            if (newtab.url != tab.url) handleTabId = null;
            replacePage();
        });
    }
    else {
        replacePage();
    }
}

browser.tabs.onCreated.addListener(function(tab){
    isDev && console.log('created!');
    handleTabId = tab.id;
});

browser.tabs.onUpdated.addListener(function(tabId, changeInfo, newTab){
    browser.storage.local.get().then( results => {
        if ((typeof results.length === 'number') && (results.length > 0)) {
            results = results[0];
        }

        if (results.blockLoading) {
            var cancel = false;

            if (!LocalStorageStore.isWebRequestFilterBlocked) {
                if (!changeInfo.url || changeInfo.url == "about:blank") return;
                cancel = block(changeInfo.url);
            }

            if (cancel) {
                handleUrl = newTab.url;
                handle(newTab);
            }
        }
    });
});

browser.webRequest.onBeforeRequest.addListener(function(info) {
    browser.storage.local.get().then( results => {
        if ((typeof results.length === 'number') && (results.length > 0)) {
            results = results[0];
        }

        if (results.blockRequest) {
            var cancel = false;

            if (!LocalStorageStore.isWebRequestFilterBlocked ) {
                cancel = block(info.url);
            }

            if (cancel) {
                handleUrl = info.url;
                handle(info);
            }

            return {cancel: cancel};
        }
    });

    }, { urls: ["*://*/*"] }, ["blocking"]);

