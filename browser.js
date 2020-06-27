(function () {
    'use strict';

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

        /**
         * Get array from store
         * Uses JSON.parse
         * @param key
         * @param $default
         * @returns {{}}
         */
        getArray(key, $default = undefined) {
            return this.getObject(key, $default);
        }

        del(key) {
            this.store.removeItem(this.n(key));
            return this;
        }
    }

    WebStorage.prototype.namespace = undefined;
    WebStorage.prototype.store = undefined;

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

    window['BrowserStorage'] = BrowserStorage;

    return BrowserStorage;

}());
