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

        this.namespace = namespace;

        return this;
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
     * Set Array in store.
     * Uses JSON.stringify
     * @param key
     * @param value
     * @returns {WebStorage}
     */
    setArray(key, value) {
        return this.setObject(key, value);
    }


    /**
     * Set Number item in store.
     * Uses JSON.stringify
     * @param key
     * @param value
     * @returns {WebStorage}
     */
    setNumber(key, value) {
        return this.set(key, value);
    }

    /**
     * Set Boolean item in store.
     * Uses JSON.stringify
     * @param key
     * @param value
     * @returns {WebStorage}
     */
    setBoolean(key, value) {
        return this.set(key, value);
    }

    /**
     * Get item form store
     * @param key
     * @param $default
     * @returns {*}
     */
    get(key, $default = undefined) {
        const value = this.store.getItem(this.n(key));
        if (value === null) return $default;
        return value;
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
     * Get object from store
     * Uses JSON.parse
     * @param key
     * @param $default
     * @returns {{}|[]}
     */
    getObject(key, $default = undefined) {
        const value = this.get(key, $default);
        if (typeof value === "string")
            try {
                return JSON.parse(value);
            } catch {
                return value
            }
        return value;
    }

    /**
     * Get array from store
     * Uses JSON.parse
     * @param key
     * @param $default
     * @returns {[]}
     */
    getArray(key, $default = undefined) {
        return this.getObject(key, $default);
    }


    /**
     * Get Number from store
     * @param key
     * @param $default
     * @return {number}
     */
    getNumber(key, $default) {
        let value = Number(this.get(key, $default));

        if (isNaN(value)) {
            throw Error(`Value for key: {${key}} is not a number!`)
        }

        return value;
    }

    /**
     * Delete Item from store
     * @param key
     * @return {WebStorage}
     * @deprecated - Use .remove instead
     */
    del(key) {
        this.store.removeItem(this.n(key));
        return this;
    }


    /**
     * Remove Item from store
     * @param key
     * @return {WebStorage}
     */
    remove(key) {
        this.store.removeItem(this.n(key));
        return this;
    }
}

WebStorage.prototype.namespace = undefined;
WebStorage.prototype.store = undefined;

export default WebStorage;