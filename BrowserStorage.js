import WebStorage from "./WebStorage"

class BrowserStorage {

    /**
     *  BrowserStorage constructor
     * @param {string} namespace - Namespace for keys
     */
    constructor(namespace = undefined) {
        if (namespace) {
            this.namespace = namespace;
        }

        this.local = new WebStorage('local', namespace);
        this.session = new WebStorage('session', namespace);

        return this;
    }

    /**
     * Create new instance of BrowserStorage
     * @param {string} namespace - Namespace for keys
     * @returns {BrowserStorage}
     *
     * @example
     *  const store = BrowserStorage.new()
     *  // same as
     *  const store = new BrowserStorage();
     */
    static new(namespace = undefined) {
        return new BrowserStorage(namespace)
    }

    /**
     * Get LocalStorage WebStorage
     * @param namespace
     * @returns {WebStorage}
     */
    static getLocalStore(namespace = undefined) {
        return new WebStorage('local', namespace)
    }

    /**
     * Get SessionStore WebStorage
     * @param namespace
     * @returns {WebStorage}
     */
    static getSessionStore(namespace = undefined) {
        return new WebStorage('session', namespace)
    }

}

export default BrowserStorage;