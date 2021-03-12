/**
 * name: render
 * params: 第一个参数其实是createElement返回的对象（virtual dom），第二个是挂载的目标dom
 * desc: 将虚拟dom渲染成真实的dom
 */

import { reconcile } from './reconcile';

//虚拟dom的根节点
let rootInstance = null;
export function render(element, container) {
  const prevInstance = rootInstance;
  //对比dom diff，更新真实dom
  const nextInstance = reconcile(container, prevInstance, element);
  //新的虚拟dom根节点
  rootInstance = nextInstance;
}

export function renderOld(element, parentDom) {
  const { type, props } = element;
  const isTextElement = type === 'TEXT ELEMENT';

  //创建相应的dom
  const dom = isTextElement ? document.createTextNode('') : document.createElement(type);
  //处理dom上的事件监听
  const isListener = name => name.startsWith('on');
  Object.keys(props)
    .filter(isListener)
    .forEach(name => {
      const eventType = name.toLowerCase().substring(2);
      dom.addEventListener(eventType, props[name]);
    });

  //处理DOM上的普通属性
  const isAttribute = name => !isListener(name) && name != 'children';
  Object.keys(props)
    .filter(isAttribute)
    .forEach(name => {
      dom[name] = props[name];
    });

  //处理 children
  const childrenElements = props.children || [];

  //递归渲染每一个React元素
  childrenElements.forEach(child => render(child, dom));
  parentDom.appendChild(dom);
}
