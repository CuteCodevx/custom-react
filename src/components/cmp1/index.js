import React from '../../React';

class FirstChildCmp extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    var Tv = {
      open: function () {
        alert('open');
      },
      close: function () {
        alert('close');
      }
    };
    var createCommand = function (receiver) {
      // var execute = function () {
      //   return receiver.open();
      // };
      // var undo = function () {
      //   return receiver.close();
      // };
      // var execute = receiver.open
      return {
        execute: receiver.open,
        undo: receiver.close
      };
    };
    // var setCommand = function (command) {
    //   document.getElementById('execute').onclick = function () {
    //     command.execute();
    //   };
    //   document.getElementById('undo').onclick = function () {
    //     command.undo();
    //   };
    // };
    // setCommand(createCommand(Tv));
    var command = createCommand(Tv);
    return (
      <div>
        我是第一个child
        <button
          id='execute'
          onClick={() => {
            command.execute();
          }}>
          open
        </button>
        <button
          id='undo'
          onClick={() => {
            command.undo();
          }}>
          close
        </button>
      </div>
    );
  }
}

export default FirstChildCmp;
