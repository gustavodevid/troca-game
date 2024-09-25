import Store from "../models/storeModel.js";

class StoreController {
async getAllStores(req, res) {
    const stores = await Store.find();
    res.json(stores);
}
}

export default new StoreController();