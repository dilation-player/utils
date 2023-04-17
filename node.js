// ====================================================
// Class {Node}
// ====================================================
class Node {
  /**
   * Constructor
   * @param selector
   */
  constructor(selector) {
    this.setSelector(selector);
  }

  /**
   * Convert to array
   * @param selector
   * @return {string|Array|*[]}
   */
  convertToArray(selector) {
    if (selector instanceof NodeList) {
      for (var a = [], l = selector.length; l--; a[l] = selector[l]);
      selector = a;
    } else if (typeof selector !== 'string'
      && !(selector instanceof Array)) {
      selector = [selector];
    }

    return selector;
  }

  /**
   * Set selector
   * @param selector
   * @return {Node}
   */
  setSelector(selector) {
    this.selectors = this.convertToArray(selector);

    return this;
  }

  /**
   * Get selectors
   * @return {*[]|NodeListOf<HTMLElementTagNameMap[keyof HTMLElementTagNameMap]>|*}
   */
  allDom() {
    if (typeof this.selectors === 'string') {
      let nodes = document.querySelectorAll(this.selectors);
      return this.convertToArray(nodes).filter((item) => typeof item !== 'string');
    }

    return this.selectors;
  }

  /**
   * Get selector
   * @return {*}
   */
  dom() {
    if (typeof this.selectors === 'string') {
      return document.querySelector(this.selectors);
    }

    return this.selectors[0];
  }

  /**
   * Find elements
   * @param selector
   * @return {Node}
   */
  find(selector) {
    let children = this.dom().querySelectorAll(selector);
    children = this.convertToArray(children);

    return new Node(children);
  }

  /**
   * Get parent
   * @return {Node}
   */
  parent() {
    return new Node(this.dom().parentNode);
  }

  /**
   * Get/set height of element
   * @param value
   * @return {*}
   */
  height(value) {
    if (value === undefined) {
      let node = this.dom();

      return node.getBoundingClientRect !== undefined ? node.getBoundingClientRect().height : (function () {
        var myHeight = 0;

        if (typeof (window.innerWidth) == 'number') {
          myHeight = window.innerHeight;
        } else if (document.documentElement && document.documentElement.clientHeight) {
          myHeight = document.documentElement.clientHeight;
        } else if (document.body && document.body.clientHeight) {
          myHeight = document.body.clientHeight;
        }

        return myHeight;
      })();
    }

    let selectors = this.allDom();

    for (var i = 0; i < selectors.length; ++i) {
      selectors[i].style.height = value;
    }

    return this;
  }

  /**
   * Get/set width of element
   * @return {number}
   * @return {*}
   */
  width(value) {
    if (value === undefined) {
      let node = this.dom();

      return node.getBoundingClientRect !== undefined ? node.getBoundingClientRect().width : (function () {
        var myWidth = 0;

        if (typeof (window.innerWidth) == 'number') {
          myWidth = window.innerWidth;
        } else if (document.documentElement && document.documentElement.clientWidth) {
          myWidth = document.documentElement.clientWidth;
        } else if (document.body && document.body.clientWidth) {
          myWidth = document.body.clientWidth;
        }

        return myWidth;
      })();
    }

    let selectors = this.allDom();

    for (var i = 0; i < selectors.length; ++i) {
      selectors[i].style.width = value;
    }

    return this;
  }

  /**
   * Add class to element
   * @param name
   */
  addClass(name) {
    let selectors = this.allDom();

    for (var i = 0; i < selectors.length; ++i) {
      selectors[i].classList.add(name);
    }

    return this;
  }

  /**
   * Remove class
   * @param name
   */
  removeClass(name) {
    let selectors = this.allDom();

    for (var i = 0; i < selectors.length; ++i) {
      if (selectors[i].classList.contains(name)) {
        selectors[i].classList.remove(name);
      }
    }

    return this;
  }

  /**
   * CSS
   * @param key
   * @param value
   * @return {*}
   */
  css(key, value) {
    // Check if is get CSS
    if (typeof key === 'string' && value === undefined) {
      return this.dom().style[key];
    }

    let selectors = this.allDom();
    let values = {};

    if (typeof key === 'string') {
      values[key] = value;
    } else {
      values = key;
    }

    for (let i = 0; i < selectors.length; i++) {
      for (let vKey in values) {
        selectors[i].style[vKey] = values[vKey];
      }
    }

    return this;
  }

  /**
   * Get attribute
   * @param key
   * @param value
   * @return {*}
   */
  attr(key, value) {
    // Check if is get value
    if (typeof key === "string" && value === undefined) {
      return this.dom().getAttribute(key);
    }

    let selectors = this.allDom();
    let values = {};

    if (typeof key === 'string') {
      values[key] = value;
    } else {
      values = key;
    }

    for (let i = 0; i < selectors.length; i++) {
      for (let vKey in values) {
        selectors.forEach(element => {
          element.setAttribute(vKey, values[vKey]);
        });
      }
    }

    return this;
  }

  /***
   * Get/set html
   * @param value
   * @return *
   */
  html(value) {
    if (value === undefined) {
      return this.dom().innerHTML;
    }

    let selectors = this.allDom();

    for (let i = 0; i < selectors.length; i++) {
      selectors[i].innerHTML = value;
    }

    return this;
  }

  /**
   * Has Class
   * @param name
   * @return {boolean}
   */
  hasClass(name) {
    return this.dom().classList.contains(name);
  }

  /**
   * Active status
   * @param status
   * @return {Node}
   */
  active(status) {
    let selectors = this.allDom();

    for (let i = 0; i < selectors.length; i++) {
      if (status) {
        selectors[i].classList.add('active');
      } else if (selectors[i].classList.contains('active')) {
        selectors[i].classList.remove('active');
      }
    }

    return this;
  }

  /**
   * Is active
   * @return {boolean}
   */
  isActive() {
    return this.hasClass('active');
  }

  /**
   * Events
   * @param name
   * @param call
   */
  listen(key, call) {
    let keys = key.trim().replace(/\s/gi, ',').split(',');
    let selectors = this.allDom();

    for (let i = 0; i < selectors.length; i++) {
      for (let j = 0; j < keys.length; j++) {
        selectors[i].addEventListener(keys[j], call);
      }
    }

    return this;
  }

  /**
   * Get value
   * @param value
   * @return {Node}
   */
  val(value) {
    if (value === undefined) {
      return this.dom().value;
    }

    let selectors = this.allDom();

    for (let i = 0; i < selectors.length; i++) {
      selectors[i].value = value;
    }

    return this;
  }

  /**
   * Get offset
   * @return {{}}
   */
  offset() {
    let bound = this.dom().getBoundingClientRect();

    return {
      left: bound.left,
      top: bound.top,
      right: bound.right,
      bottom: bound.bottom
    };
  }

  /**
   * Has
   * @param selector
   * @return {boolean}
   */
  has(selector) {
    return this.dom().contains(selector);
  }

  /**
   * is
   * @param selector
   */
  is(selector) {
    return this.dom().isSameNode(selector);
  }

  /**
   * Closest
   * @param selector
   * @return {*|HTMLElementTagNameMap[keyof HTMLElementTagNameMap]|Element|SVGElementTagNameMap[keyof SVGElementTagNameMap]}
   */
  closest(selector) {
    return new Node(this.dom().closest(selector));
  }

  /**
   * Append child
   * @param node
   * @return {Node}
   */
  append(node) {
    let selectors = this.allDom();

    for (let i = 0; i < selectors.length; i++) {
      selectors[i].appendChild(node);
    }

    return this;
  }

  /**
   * Text
   * @param value
   * @return {*}
   */
  text(value) {
    if (value === undefined) {
      return this.dom().textContent;
    }

    let selectors = this.allDom();

    for (let i = 0; i < selectors.length; i++) {
      selectors[i].textContent = value;
    }

    return this;
  }

  hide(){
    let d = this.css('display');
    let c = this.attr('dp-cache-display');

    if (d !== 'none') this.attr('dp-cache-display', d || '');
    else if (!c) this.attr('dp-cache-display', '');

    this.css('display', 'none');
    return this;
  }

  show(){
    let d = this.attr('dp-cache-display');
    this.css('display', d);
    return this;
  }
}

export default Node;