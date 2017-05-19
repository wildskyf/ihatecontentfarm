window.onload = () => {
    var submitButton = "#submitButton";
    var blockRequest = "#blockRequest";
    var blockLoading = "#blockLoading";
    var userBlacklistTextArea = "#userBlacklist textarea";
    var userWhitelistTextArea = "#userWhitelist textarea";

    var trTable = {
        "#blockLabel": "blockLabel",
        "#BlockRequestLabel" : "blockRequestLabel",
        "#BlockLoadingLabel" : "blockLoadingLabel",
        "#systemBlacklistLabel" : "systemBlacklist",
        "#systemBlacklistDescLabel" : "systemBlacklistDesc",
        "#userBlacklistLabel" : "userBlacklist",
        "#userBlacklistDescLabel" : "userBlacklistDesc",
        "#userWhitelistLabel" : "userWhitelist",
        "#userWhitelistDescLabel" : "userWhitelistDesc",
        "#appDescLabel": "appDesc",
        "#appNameLabel": "appName",
        "title" : "appName"
    };

    trTable[submitButton] = "save";

    Utils.trFromTable(trTable);

    var submit = () => {
        document.querySelector(submitButton).classList.add("disabled");
        Utils.tr(submitButton, "saved");

        browser.storage.local.set({
            blockRequest: document.querySelector(blockRequest).checked,
            blockLoading: document.querySelector(blockLoading).checked
        });
        LocalStorageStore.userBlacklist = ListFormatter.parse(document.querySelector(userBlacklistTextArea).value);
        LocalStorageStore.userWhitelist = ListFormatter.parse(document.querySelector(userWhitelistTextArea).value);
    }

    var enableButton = () => {
        document.querySelector(submitButton).classList.remove("disabled");
        Utils.tr(submitButton, "save");

        document.querySelector(submitButton).addEventListener("click", e => {
            e.preventDefault();
            submit();
        }, false);
    }

    const toJSON = response => response.json();
    fetch('https://rawgit.com/wildskyf/content-farm-list/master/list.json')
        .then(toJSON)
        .then(online_data => {
            if (Array.isArray(online_data) && online_data.length !== 0) sites = online_data;
            document.querySelector("#systemBlacklist textarea").value = ListFormatter.stringify(sites);
        }).catch(error => {
            document.querySelector("#systemBlacklist textarea").value = ListFormatter.stringify(sites);
        });

    addMultipleListeners(document.querySelector(blockRequest), ['change', 'click'], enableButton,false);
    addMultipleListeners(document.querySelector(blockLoading), ['change', 'click'], enableButton,false);
    addMultipleListeners(document.querySelector(userBlacklistTextArea), ['change', 'keyup', 'paste'], enableButton,false);
    addMultipleListeners(document.querySelector(userWhitelistTextArea), ['change', 'keyup', 'paste'], enableButton,false);

    browser.storage.local.get().then(results => {
        if ((typeof results.length === 'number') && (results.length > 0)) {
            results = results[0];
        }

        document.querySelector(blockRequest).checked = results.blockRequest;
        document.querySelector(blockLoading).checked = results.blockLoading;
    });
    document.querySelector(userBlacklistTextArea).value = ListFormatter.stringify(LocalStorageStore.userBlacklist);
    document.querySelector(userWhitelistTextArea).value = ListFormatter.stringify(LocalStorageStore.userWhitelist);

    document.querySelector("#submitButton").addEventListener('click', () => {
        document.querySelector("#submitButton").classList.add("disabled");
    }, false);
};

