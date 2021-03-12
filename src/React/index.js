import { createElement } from './createElement';
import { render } from './render';
import Component from './component';

const React = {
  createElement,
  Component
};

export const ReactDOM = {
  render: (vnode, container) => {
    container.innerHTML = '';
    return render(vnode, container);
  }
};
export default React;
