// stores.js - a store inventory manager

class Store {
	constructor(store_id = 0) {
		this.store = new Object;
		this.products = [];
	}

	addProduct(hnd) {
		let thiz = this;
		let i = GM.items.filter(function (v, idx, array) {
			if (v.name == hnd) {
//				console.log("correctly filtered " + v.name + " as equal to "+ hnd + ", pushing index " + idx);
				thiz.products.push(GM.items[idx]);
			}
		});	

		console.log("added product to store: " + this.products[this.products.length - 1].name);		
	}

	loadStore(store_id = 0) {
		this.products = []; // clear out the old store

		let thiz = this;
		this.store.id = GM.stores[store_id].id;
		this.store.level = GM.stores[store_id].level;
		this.store.stim = GM.stores[store_id].stim;

		this.store.level[GM.PC.creditlevel - 1].item.forEach(function (v,idx,array) {
	//		console.log("testing addProduct with value " + v);
			thiz.addProduct(v);
		})

	}

	showStore() {
		$("#stimuli").html("<p>" + this.store.stim + "</p>");

		let thiz = this;

//		$("#stimuli").append("<form action=\"\" onsubmit=\"createBill(); return false;\">");

		for (var i of thiz.products) {
			$("#stimuli").append("<li><input type=\"checkbox\" name=\"" + i.name + "\" value=\"" + i.name + "\">" + i.disp + " &mdash; $" + i.price + "</li>");
		}

//		$("#stimuli").append("<input type=\"submit\" value=\"Buy\"></form>");
	}
}