/**
 * name: createElement
 * params: 第一个参数是类型，第二个是类型元素上的属性， 第三个是children
 * desc: 将转化成另一种数据结构 -- React 元素
 *
 * element = {
 *  type: "div",
 *  props: {
 *    id: "container",
 *    children: [
 *      {
 *         type: "span",
 *         props: {
 *            children: [
 *              {
 *                  type: "TEXT ELEMENT",
 *                  props: { nodeValue: "Foo" }
 *              }
 *            ]
 *
 *      },
 *      {...}
 *    ]
 * }
 * attention: 具体将JSX转换成JS语法 由Babel实现
 */
/** @jsx createElement */
export function createElement(type, config, ...args) {
  const props = Object.assign({}, config);
  const hasChildren = args.length > 0;
  const rawChildren = hasChildren ? [].concat(...args) : [];

  props.children = rawChildren
    .filter(rc => rc != null && rc !== false)
    .map(c => (c instanceof Object ? c : createTextElement(c)));

  return {
    type,
    props
  };
}

function createTextElement(value) {
  return createElement('TEXT ELEMENT', { nodeValue: value });
}
