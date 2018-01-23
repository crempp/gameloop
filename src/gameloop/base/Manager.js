import RegistryItem from "./RegistryItem";

export default class Manager {

  constructor () {
    this.registry = {};
    this.awaiting = {};
    this.assets = {};
    this.components = [];
  }

  /**
   * get
   *
   * @param key
   * @returns {*}
   */
  get (key) {
    if (this.registry.hasOwnProperty(key)){
      return this.registry[key].obj;
    }
  }

  /**
   * add
   *
   * @param key
   * @param obj
   */
  add (key, obj) {
    this.registry[key] = new RegistryItem(key, obj);
  }

  /**
   * addAsset
   *
   * @param key
   * @param asset
   */
  addAsset (key, asset) {
    this.assets[key] = asset;
  }

  /**
   * getAsset
   *
   * @param key
   * @returns {*}
   */
  getAsset (key) {
    if (this.assets.hasOwnProperty(key)){
      return this.assets[key];
    }
    return null;
  }

  /**
   * loadAssets
   */
  loadAssets () {
    const assets = document.querySelectorAll("[data-gl-asset]");
    assets.forEach((asset) => {
      this.addAsset(asset.dataset.glAsset, asset);
    });
  }

  /**
   * update
   *
   * @param context
   * @param timediff
   * @param timestamp
   */
  update (context, timediff, timestamp) {
    this.components.forEach((component) => {
      component.update(context,timediff, timestamp);
    });
  }

  /**
   * addItem
   *
   * @param component
   */
  addItem (component) {
    this.components.push(component);
  }

  /**
   * await
   *
   * @param key
   * @param callback
   * @param context
   */
  await (key, callback, context) {
    if (this.registry.hasOwnProperty(key)){
      switch (this.registry[key].state){
        case "ready":
          callback.call(context, this.registry[key].obj);
          break;
        default :
          this.awaiting[key] = {context:context, callback:callback};
          break;
      }
    }
  }
}

