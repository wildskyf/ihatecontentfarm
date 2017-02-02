window.onload = () => {
    var submitButton = "#submitButton";
    var userBlacklistTextArea = "#userBlacklist textarea";
    var userWhitelistTextArea = "#userWhitelist textarea";

    var trTable = {
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

    document.querySelector("#systemBlacklist textarea").value = ListFormatter.stringify(sites);

    addMultipleListeners(document.querySelector(userBlacklistTextArea), ['change', 'keyup', 'paste'], enableButton,false);
    addMultipleListeners(document.querySelector(userWhitelistTextArea), ['change', 'keyup', 'paste'], enableButton,false);

    document.querySelector(userBlacklistTextArea).value = ListFormatter.stringify(LocalStorageStore.userBlacklist);
    document.querySelector(userWhitelistTextArea).value = ListFormatter.stringify(LocalStorageStore.userWhitelist);

    document.querySelector("#submitButton").addEventListener('click', () => {
        document.querySelector("#submitButton").classList.add("disabled");
    }, false);
};

