class WebStorage {

    /**
     * WebStorage Constructor
     * @param type
     * @param namespace
     */
    constructor(type = "local", namespace = undefined) {
        if (type === 'session') {
            this.store = sessionStorage;
        } else {
            this.store = localStorage;
        }
    }

    /**
     * Get key with namespace prefixed
     * @param key
     * @returns {string}
     */
    n(key) {
        if (this.namespace && this.namespace.length) {
            return this.namespace + ':' + key;
        }

        return key
    }

    /**
     * Check if key exists
     * @param key
     * @returns {boolean}
     */
    has(key) {
        return !!this.get(key);
    }

    /**
     * Set Variable in store.
     * @param key
     * @param value
     * @returns {WebStorage}
     */
    set(key, value) {
        this.store.setItem(this.n(key), value);
        return this;
    }


    /**
     * Set Object in store.
     * Uses JSON.stringify
     * @param key
     * @param value
     * @returns {WebStorage}
     */
    setObject(key, value) {
        if (typeof value === "object")
            value = JSON.stringify(value);
        return this.set(key, value);
    }

    /**
     * Get True or false values
     * @param key
     * @returns {boolean}
     */
    getBoolean(key) {
        const value = this.get(key);
        if (value && typeof value === "string") {
            return value.toLowerCase() === 'true';
        }
        return false;
    }

    /**
     * Get item form store
     * @param key
     * @param $default
     * @returns {string|undefined}
     */
    get(key, $default = undefined) {
        const value = this.store.getItem(this.n(key));
        if (!value) return $default;
        return value;
    }

    /**
     * Get object from store
     * Uses JSON.parse
     * @param key
     * @param $default
     * @returns {{}}
     */
    getObject(key, $default = undefined) {
        const value = this.get(key, $default);
        if (typeof value === "string")
            return JSON.parse(value);

        return value;
    }

    del(key) {
        this.store.removeItem(this.n(key));
        return this;
    }
}

WebStorage.prototype.namespace = undefined;
WebStorage.prototype.store = undefined;

export default WebStorage;