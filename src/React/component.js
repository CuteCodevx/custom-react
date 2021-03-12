// const { reconcile } = require('./reconcile');
import { reconcile } from './reconcile';

function updateInstance(internalInstance) {
  //internalInstance是自定义组件对应的instance {element, dom, childInstances}
  const parentDom = internalInstance.dom.parentNode;
  const element = internalInstance.element;
  //调用reconile函数，进行虚拟DOM比较，并更新DOM树
  reconcile(parentDom, internalInstance, element);
}

// 继承的Component
class Component {
  constructor(props) {
    this.props = props;
    this.state = this.state || {};
  }

  setState(partialState) {
    // 点击setState变化后 页面dom全部消失的原因--this.__internalInstance.childInstance.childInstances为undefined
    this.state = Object.assign({}, this.state, partialState);
    updateInstance(this.__internalInstance);
  }
}
export default Component;
