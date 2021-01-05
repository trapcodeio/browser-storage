import BrowserStorage from "./src/BrowserStorage";

if(window && !window.hasOwnProperty('BrowserStorage')){
    // @ts-ignore
    window['BrowserStorage'] = BrowserStorage;
}


export default BrowserStorage;