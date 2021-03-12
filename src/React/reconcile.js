/**
 * name: reconcile
 * params: 第一个是挂载的目标dom ，第二个参数是虚拟dom的实例， 第三个参数是createElement返回的对象（virtual dom）
 * desc: 创建虚拟dom，对真实dom进行最小化更新操作
 *
 * instance = {
 *  element: {}, //React元素的引用
 *  dom: {},  //真实浏览器DOM的引用
 *  childInstances: [] //子节点的Instance引用
 *  publicInstance: {  //表示Component的引用
      __internalInstance: {} //对自身instance的引用, 用于在setState时通过组件this拿到instance以触发更新
    }
 * }
 */
export function reconcile(parentDom, instance, element) {
  if (instance == null) {
    //虚拟的根节点为空是，使用当前React元素，创建新的虚拟dom
    const newInstance = instantiate(element);
    parentDom.appendChild(newInstance.dom);
    return newInstance;
  } else if (element == null) {
    //删除dom
    parentDom.removeChild(instance.dom);
    return null;
  } else if (instance.element.type !== element.type) {
    //使用当前React元素，创建新的虚拟DOM
    const newInstance = instantiate(element);
    //将真实DOM替换容器中的原有DOM
    parentDom.replaceChild(newInstance.dom, instance.dom);
    return newInstance;
  } else if (typeof element.type === 'string') {
    updateDomProperties(instance.dom, instance.element.props, element.props);
    //对子节点进行对比
    instance.childInstances = reconcileChildren(instance, element);
    instance.element = element;

    return instance;
  } else {
    //逻辑到之有两个条件
    //（1）原有虚拟DOM节点类型与要创建的DOM节点类型一致
    //（2）element type为自定义类型，其中publicInstance是自定义组件的实例
    //更新自定义组件的属性
    instance.publicInstance.props = element.props;
    //原有孩子节点instance数组
    const oldChildInstance = instance.childInstance;
    //调用自定义的render函数，创建自定义组件的孩子节点element
    const childElement = instance.publicInstance.render(); // 组件的render函数
    //有子元素啊 为啥之后会消失呢
    //对比自定义组件的虚拟DOM，更新DOM
    const childInstance = reconcile(parentDom, oldChildInstance, childElement);
    //更新instance引用
    instance.dom = childInstance.dom;
    instance.childInstance = childInstance;
    instance.element = element;
    return instance;
  }
}

// 简易 Diff 算法 只比较children数组中相同位置的子节点
function reconcileChildren(oldInstance, newElement) {
  const dom = oldInstance.dom;
  const childInstances = oldInstance.childInstances;
  const nextChildElements = newElement.props.children || [];
  const newChildInstances = [];

  const count = Math.max(childInstances.length, nextChildElements.length);

  for (let i = 0; i < count; i++) {
    const childInstance = childInstances[i];
    const childElement = nextChildElements[i];
    //调用reconcile创建子节点的虚拟DOM
    /*这里存在三种情况：
     * (1). childInstance和childElement都存在，则调用reconcile进行diff操作
     * (2). childInstance为空而childElement存在，调用调用reconcile创建新的instance
     * (3). childInstance存在而childElement为空，则调用reconcile进行删除操作，此时会返回null
     */
    const newChildInstance = reconcile(dom, childInstance, childElement);
    newChildInstances.push(newChildInstance);
  }

  return newChildInstances.filter(item => item != null);
}

// 递归的创建、更新虚拟DOM
function instantiate(element) {
  const { type, props } = element;
  const isDomElement = typeof type === 'string';

  if (isDomElement) {
    const isTextElement = type === 'TEXT ELEMENT';
    //创建相应的dom
    const dom = isTextElement ? document.createTextNode('') : document.createElement(type);
    updateDomProperties(dom, [], props); //更新dom节点的属性、绑定事件
    //递归，创建虚拟DOM的子节点
    const childElements = props.children || [];
    const childInstances = childElements.map(instantiate);
    const childDoms = childInstances.map(item => item.dom);
    childDoms.forEach(item => dom.appendChild(item));

    const instance = { dom, element, childInstances };
    return instance;
  } else {
    const instance = {};
    //对于自定义类组件，创建对应的publicInstance
    const publicInstance = createPublicInstance(element, instance);

    //调用自定义组件的render方法，获取child element
    const childElement = publicInstance.render();

    //创建child element的instance
    const childInstance = instantiate(childElement); // 递归 孩子拿到 { dom, element, childInstances }

    const dom = childInstance.dom;
    //返回自定义类型组件的instance，其中publicInstance为自定义组件的实例
    //自定义组件的instance有几个特殊的地方：
    //(1) childInstance不是数组，而是自定义组件的根节点对应的instance
    //(2) dom是自定义组件的根节点对应的DOM
    //(3) publicInstance是自定义组件类实例，内部维护着__internalInstance指向instance
    Object.assign(instance, { dom, element, childInstance, publicInstance });
    return instance;
  }
}

//调用浏览器API对DOM进行修改
function updateDomProperties(dom, prevProps, nextProps) {
  const isListener = name => name.startsWith('on');
  const isAttribute = name => !isListener(name) && name != 'children';
  Object.keys(prevProps)
    .filter(isListener)
    .forEach(name => {
      const eventType = name.toLowerCase().substring(2);
      dom.removeEventListener(eventType, prevProps[name]);
    });
  Object.keys(prevProps)
    .filter(isAttribute)
    .forEach(name => {
      dom[name] = null;
    });
  Object.keys(nextProps)
    .filter(isAttribute)
    .forEach(name => {
      dom[name] = nextProps[name];
    });
  Object.keys(nextProps)
    .filter(isListener)
    .forEach(name => {
      const eventType = name.toLowerCase().substring(2);
      dom.addEventListener(eventType, nextProps[name]);
    });
}

//创建自定义Component实例的方法
function createPublicInstance(element, internalInstance) {
  //type为自定义element的构造函数
  const { type, props } = element;
  // 调用组件的构造函数 创建组件实例
  const publicInstance = new type(props);
  // 自定义组件对应的Instance引用, 用于在实例中通过this.__internalInstance获取组件对应的instance，以更新组件
  publicInstance.__internalInstance = internalInstance;
  //第一次创建的时候是有值的
  return publicInstance;
}
