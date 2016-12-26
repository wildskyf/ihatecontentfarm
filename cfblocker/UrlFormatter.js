class UrlFormatter {

    static googleWebCache(site) {
        var u = site.replace(/^https?:?\/?\/?/,"");
        var result = "https://webcache.googleusercontent.com/search?strip=1";

        u = u.replace("?","%3F");
        u = u.replace("=","%3D");
        u = u.replace("&","%26"); // don't process "#"

        result += "&q=cache:" + u;

        return result;
    }


}
