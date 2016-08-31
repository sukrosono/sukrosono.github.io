class Menu
  constructor: ->
    # console.log 'initializing menu', @;
    @oWrapperEl= document.querySelector('main.main');
    @maskEl= document.querySelector 'div.mask';
    @menuEl= document.querySelector('nav.menu.menu-slide-right');
    @closeBtnEl= document.querySelector 'nav.menu>div.menu-close>button';
    @menuBtn= document.querySelector 'button.menu-btn';
    @_initEvent();
    # dissable mask
    # console.log 'menu initialized', @;
  open: =>
    # console.log 'opening menu', @;
    @menuEl.classList.add 'is-active';
    @maskEl.classList.add 'is-active';
    # add is-active to menu element and mask element
  close: =>
    # console.log 'closing menu', @;
    @menuEl.classList.remove 'is-active';
    @maskEl.classList.remove 'is-active';
    # remove is-active to menu element and mask element
  _initEvent: ->
    @closeBtnEl.addEventListener 'click', (e)=>
      e.preventDefault();
      @.close();
    @menuBtn.addEventListener 'click', (e)=>
      e.preventDefault();
      # console.log 'click event, this: ', @;
      @.open();
    @maskEl.addEventListener 'click', (e)=>
      e.preventDefault();
      # console.log('closing by mask');
      @.close();
document.onreadystatechange= ->
  if document.readyState is 'complete'
    Window.menu = new Menu();
