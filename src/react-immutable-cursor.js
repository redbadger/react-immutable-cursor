import {Component} from 'react';
import Immutable from 'immutable';
import Cursor from 'immutable/contrib/cursor';

export default class extends Component {

  updateAndRenderTree(newData) {
    this.setState({
      cursor: Cursor.from(
        newData,
        ::this.updateAndRenderTree
      )
    });
  }

  createAtom() {
    if (typeof this.initialState !== 'function') {
      throw new TypeError('No method initialState defined on React class that initial props are passed to');
    }
    const data = this.initialState();
    return {
      cursor: Cursor.from(
        Immutable.fromJS(data),
        ::this.updateAndRenderTree
      )
    };
  }

}
