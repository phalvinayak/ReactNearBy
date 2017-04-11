export default {
    get(store){ // Get preticular key or entire object from storage
        let obj = window.localStorage.getItem(store);
        if(obj){
            try{
                obj = JSON.parse(obj);
            } catch(e){
                console.error(`Unable to parse the JSON ${e.message}`);
                obj = {};
            }
        } else {
            obj = {};
        }
        return obj;
    },

    set(store, obj){
        window.localStorage.setItem(store, JSON.stringify(obj));
        return obj;
    },

    getKey(store, key){
        let obj = this.get(store);
        if(obj.hasOwnProperty(key)){
            return obj[key];
        }
        return undefined;
    },

    setKey(store, key, value){
        let obj = this.get(store);
        obj[key] = value;
        return this.set(store, obj);
    },

    hasKey(store, key){
        let obj = this.get(store);
        if(obj.hasOwnProperty(key)){
            return true;
        }
        return false;
    }
}