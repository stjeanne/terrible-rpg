// stores.js - a store inventory manager

class Store {
	constructor(store_id = 0) {
		this.store = new Object;
	}

	loadStore(store_id = 0) {
		this.store.id = GM.stores[store_id].id;
		this.store.level = GM.stores[store_id].level;
	}
}