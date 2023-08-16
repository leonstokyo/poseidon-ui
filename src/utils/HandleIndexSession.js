class HandleIndexSession {
  static removeSession(_this, name) {
    _this.$session.remove(`${name}_pagination`);
    _this.$session.remove(`${name}_filter`);
  }

  static setSession(_this, name) {
    _this.$session.set(`${name}_pagination`, _this.pagination);
    _this.$session.set(`${name}_filter`, _this.filter);
  }

  static getSession(_this, name) {
    _this.pagination = _this.$session.get(`${name}_pagination`);
    _this.filter = _this.$session.get(`${name}_filter`);
  }

  static exitSession(_this, name) {
    return _this.$session.exists(`${name}_pagination`) && _this.$session.exists(`${name}_filter`);
  }
}

module.exports = HandleIndexSession;
