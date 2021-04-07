import BrowserStorage from "./src/BrowserStorage";

try {
    if(window && !window.hasOwnProperty('BrowserStorage')){
        // @ts-ignore
        window['BrowserStorage'] = BrowserStorage;
    }
} catch {
    // do nothing
}


export default BrowserStorage;