import { Platform } from "react-native";
import { openDB, readStoreKey, writeStore } from "./WebDB";

export default class DataContext {

    Configuracion: ConfiguracionEntity;

    constructor(readonly connectionName = "", protected contextType?: string) {
        this.Configuracion = new ConfiguracionEntity({
            openDB: () => openDB(connectionName, 4)
            , base_url: window.localStorage[connectionName]
        });
    }
}

class ConfiguracionEntity {
    constructor(private config: {
        openDB(): ReturnType<typeof openDB>,
        base_url: string
    }) { }

    DATA: { [key: string]: any } = {};
    async Get() {
        if (Platform.OS != "web") return {};
        const db = await this.config.openDB();
        this.DATA = await readStoreKey(db, "ajustes", 1) || {};
        return this.DATA;
    }
    async download() {
        try {
            const url = new URL(this.config.base_url);
            if (url.pathname.endsWith("/")) {
                let x = Array.from(url.pathname);
                x.pop();
                url.pathname = x.join("");
            }
            url.pathname += "/LOCAL_NETWORK/CONFIGURACION/Fetch";
            const response = await fetch(url.toJSON(), {
                mode: "cors",
                body: JSON.stringify({
                    tablet: this.TabletParams()
                }),
                method: "POST"
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            this.DATA = data;
            await this.store("deviceID", "tmp-" + new Date().valueOf());
            return this.DATA;
        } catch (error: any) {
            console.error("Error during download:", error);
            throw new Error(`Failed to download data: ${error.message}`);
        }
    }
    
    async Set(key: string, value: any, scope?: "EMPRESA" | "ESTABLECIMIENTO" | "DISPOSITIVO") {
        if (Platform.OS != "web") return {};
        const url = new URL(this.config.base_url);
        if (url.pathname.endsWith("/")) {
            let x = Array.from(url.pathname);
            x.pop();
            url.pathname = x.join("");
        }
        url.pathname += "/LOCAL_NETWORK/CONFIGURACION/SET";
        const abortCtrl = new AbortController();
        const response = await fetch(url.toJSON()
            , {
                mode: "cors"
                , body: JSON.stringify({
                    tablet: this.TabletParams()
                    , data: { [key]: value }
                    , scope
                })
                , method: "PUT"
                , signal: abortCtrl.signal
            }
        );
        const result = await response.json();
        if (!response.ok) throw new Error(JSON.stringify(result));
        this.DATA[key] = value;
        return this.DATA;
    }
    protected async store(key: string, value: any) {
        this.DATA[key] = value;
        const db = await this.config.openDB();
        await writeStore(db, "ajustes", 1, this.DATA);
        return this.DATA;
    }
    private TabletParams() {
        let user = (window as any)["usuarioActual"] || {};
        const { serie1, serie2, bodega, deviceID, documentosElectronicos, deviceName } = this.DATA;
        return {
            serie1, serie2, deviceName,
            bodega, deviceID, documentosElectronicos,
            fecha: new Date(),
            usuario: user.id,
            usuarioName: user.nombre
        }
    }
}