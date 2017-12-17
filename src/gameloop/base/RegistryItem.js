export default class RegistryItem {
  constructor (key, obj) {
    this.key = key;
    this.obj = obj;
    this.state = "ready";
    if (obj.loading && (typeof(obj.addOnLoad) === "function")) {
      this.state = "loading";
      obj.addOnLoad(this.itemLoad(), this);
    }
  }

  itemLoad (awaiting) {
    if (awaiting.hasOwnProperty(this.key)){
      awaiting[this.key].callback.call(awaiting[this.key].context, this.obj);
      delete awaiting[this.key];
    }
    this.state = "ready";
  }
}

