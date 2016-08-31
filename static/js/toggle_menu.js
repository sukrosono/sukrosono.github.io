(function() {
  var Menu,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Menu = (function() {
    function Menu() {
      this.close = bind(this.close, this);
      this.open = bind(this.open, this);
      this.oWrapperEl = document.querySelector('main.main');
      this.maskEl = document.querySelector('div.mask');
      this.menuEl = document.querySelector('nav.menu.menu-slide-right');
      this.closeBtnEl = document.querySelector('nav.menu>div.menu-close>button');
      this.menuBtn = document.querySelector('button.menu-btn');
      this._initEvent();
    }

    Menu.prototype.open = function() {
      this.menuEl.classList.add('is-active');
      return this.maskEl.classList.add('is-active');
    };

    Menu.prototype.close = function() {
      this.menuEl.classList.remove('is-active');
      return this.maskEl.classList.remove('is-active');
    };

    Menu.prototype._initEvent = function() {
      this.closeBtnEl.addEventListener('click', (function(_this) {
        return function(e) {
          e.preventDefault();
          return _this.close();
        };
      })(this));
      this.menuBtn.addEventListener('click', (function(_this) {
        return function(e) {
          e.preventDefault();
          return _this.open();
        };
      })(this));
      return this.maskEl.addEventListener('click', (function(_this) {
        return function(e) {
          e.preventDefault();
          return _this.close();
        };
      })(this));
    };

    return Menu;

  })();

  document.onreadystatechange = function() {
    if (document.readyState === 'complete') {
      return Window.menu = new Menu();
    }
  };

}).call(this);
