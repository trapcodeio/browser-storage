/**
 * This is an extension of the Trapcode.io Browser Storage for VUE.
 */
import {isRef, reactive, ref, watch} from "vue";
import WebStorage from "./src/WebStorage";

class VueWebStorageError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "VueWebStorage";
    }
}

class VueWebStorage extends WebStorage {
    private readonly types: Record<string, string> = {};
    private typesKey: string = "__types__"

    constructor(type: string, namespace?: string, enableBase64Encryption: boolean = false) {
        super(type, namespace);

        this.enableBase64Encryption(enableBase64Encryption);

        let types: any = this.getObject(this.typesKey, {});
        if (typeof types === "string") {
            // Encryption maybe enabled late.
            this.enableBase64Encryption();
            types = this.getObject(this.typesKey, {});
            this.enableBase64Encryption(false);
        }

        this.types = types;
    }

    /**
     * Set Type
     * @param key
     * @param type
     * @private
     */
    private setType(key: string, type: string) {
        this.types[key] = type;
        super.setObject(this.typesKey, this.types);
        return this;
    }

    /**
     * Remove type from types.
     * @param key
     * @private
     */
    private removeType(key: string) {
        if (this.types.hasOwnProperty(key)) {
            delete this.types[key];
            super.setObject(this.typesKey, this.types);
        }

        return this;
    }

    /**
     * Set value as type of itself.
     * @param key
     * @param value
     * @private
     */
    private setAsType(key: string, value: any): this {
        const type = typeof value;

        switch (type) {
            case "undefined":
                return this.remove(key);
            case "boolean":
                return this.setType(key, "boolean").setBoolean(key, value);
            case "bigint":
                return this.setType(key, "bigint").setNumber(key, value);
            case "number":
                return this.setType(key, "number").setNumber(key, value);
            case "object":
                return this.setType(key, "object").setObject(key, value);
            default:
                return this.setType(key, "string").set(key, value);
        }
    }

    /**
     * Get value as saved type.
     * @param key
     * @param def
     * @private
     */
    private getAsType<T>(key: string, def?: T): T {
        const type = this.types[key];
        switch (type) {
            case "boolean":
                return super.getBoolean(key, def as any) as unknown as T;
            case "bigint":
                return super.getNumber(key, def as any) as unknown as T;
            case "number":
                return super.getNumber(key, def as any) as unknown as T;
            case "object":
                return super.getObject(key, def as any) as unknown as T;
            default:
                return super.get(key, def) as unknown as T;
        }
    }

    /**
     * Remove key and types associated with it.
     * @param key
     */
    remove(key: string): this {
        this.removeType(key);
        return super.remove(key);
    }


    /**
     * Persist multiple values to refs
     * @param set
     * @example
     * const appName = ref("Name");
     * const appVersion = ref("Version");
     *
     * storage.persist({appName, appVersion});
     */
    persist(set: Record<string, any>) {
        if (isRef(set))
            return console.warn(new VueWebStorageError(`persist must be an object not a ref!`));

        Object.entries(set).forEach(([key, val]) => {
            if (!isRef(val)) {
                return console.warn(
                    new VueWebStorageError(`Persist object value must be a type of vue <Ref>`)
                );
            }

            if (val.value === undefined) {
                val.value = this.getAsType(key);

                if (val.value === undefined) this.remove(key);
            } else {
                this.setAsType(key, val.value);
            }

            watch(val, (n: any) => (n === undefined ? this.remove(key) : this.setAsType(key, n)));
        });

        return this;
    }

    /**
     * Sync ref with storage value
     * @param key
     * @param value
     *
     * @example
     * const appName = storage.persistRef("appName", "Name");
     *
     * appName.value = "New Name";
     *
     * storage.get("appName") // "New Name"
     */
    persistedRef<T>(key: string, value?: T) {
        // Make ref
        const r = ref(this.getAsType<T>(key, value));

        // Watch for changes
        watch(r, (value: any) => {
            this.setAsType(key, value);
        }, {immediate: true});

        // return ref
        return r;
    }

    /**
     * Sync reactive with storage value
     * @param key
     * @param value
     *
     * @example
     * const config = storage.persistReactive("config", {
     *  appName: "Name",
     *  appVersion: "Version"
     * });
     *
     * config.name = "New Name";
     *
     * storage.get("config") // {appName: "New Name", appVersion: "Version"}
     */
    persistedReactive<T extends object>(key: string, value: T = {} as T) {
        // Make Reactive
        const r = reactive(this.getAsType<T>(key, value));

        // Watch Reactive
        watch(r, (v) => {
            this.setAsType(key, v || value);
        }, {immediate: true});

        // Return Reactive
        return r;
    }

    /**
     * A helper to rename the types key.
     * @param key
     */
    $renameTypesKey(key: string) {
        if (!key || (key && !key.length)) throw new VueWebStorageError(`New TypesKey must be a valid string!`);

        this.typesKey = key;
        return this;
    }
}

export function vueLocalStorage(namespace?: string, enableBase64Encryption?: boolean) {
    return new VueWebStorage("local", namespace, enableBase64Encryption);
}

export function vueSessionStorage(namespace?: string, enableBase64Encryption?: boolean) {
    return new VueWebStorage("session", namespace, enableBase64Encryption);
}

export default VueWebStorage;
