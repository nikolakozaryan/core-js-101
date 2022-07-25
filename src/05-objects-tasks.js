/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  return {
    width,
    height,
    getArea() {
      return this.width * this.height;
    },
  };
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const Proto = proto.constructor;
  return new Proto(...Object.values(JSON.parse(json)));
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */
class BuilderHelper {
  constructor() {
    this.res = '';
    this.usedSelectors = [];
    this.uniqueSelectors = ['element', 'id', 'pseudoElement'];
    this.order = {
      element: 0,
      id: 1,
      class: 2,
      attribute: 3,
      pseudoClass: 4,
      pseudoElement: 5,
    };
    this.firstErr = 'Element, id and pseudo-element should not occur more then one time inside the selector';
    this.secondErr = 'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element';
  }

  stringify() {
    return this.res;
  }

  element(value) {
    this.errorHandler('element');
    this.res += value;
    return this;
  }

  id(value) {
    this.errorHandler('id');
    this.res += `#${value}`;
    return this;
  }

  class(value) {
    this.errorHandler('class');
    this.res += `.${value}`;
    return this;
  }

  attr(value) {
    this.errorHandler('attribute');
    this.res += `[${value}]`;
    return this;
  }

  pseudoClass(value) {
    this.errorHandler('pseudoClass');
    this.res += `:${value}`;
    return this;
  }

  pseudoElement(value) {
    this.errorHandler('pseudoElement');
    this.res += `::${value}`;
    return this;
  }

  errorHandler(selector) {
    if (
      this.usedSelectors.includes(selector)
      && this.uniqueSelectors.includes(selector)
    ) {
      throw new Error(this.firstErr);
    }
    if (
      this.order[this.usedSelectors.at(-1)]
      > this.order[selector]
    ) {
      throw new Error(this.secondErr);
    }

    this.usedSelectors.push(selector);
  }
}
const cssSelectorBuilder = {
  id: (value) => new BuilderHelper().id(value),
  attr: (value) => new BuilderHelper().attr(value),
  class: (value) => new BuilderHelper().class(value),
  element: (value) => new BuilderHelper().element(value),
  pseudoClass: (value) => new BuilderHelper().pseudoClass(value),
  pseudoElement: (value) => new BuilderHelper().pseudoElement(value),
  combine(selector1, combinator, selector2) {
    this.res = `${selector1.res} ${combinator} ${selector2.res}`;
    return this;
  },
  stringify() {
    return this.res;
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
