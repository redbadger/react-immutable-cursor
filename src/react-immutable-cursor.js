import React from 'react';
import {fromJS as buildImmutableFrom} from 'immutable';
import {from as buildRootCursorFrom} from 'immutable/contrib/cursor';

export default class extends React.Component {

  updateAndRenderTree(newData) {
    this.setState({
      cursor: buildRootCursorFrom(
        newData,
        ::this.updateAndRenderTree
      )
    });
  }

  createAtom() {
    if (typeof this.initialState !== 'function') {
      throw new Error('No method initialState defined on React class that initial props are passed to');
    }
    const data = this.initialState();
    return {
      cursor: buildRootCursorFrom(
        buildImmutableFrom(data),
        ::this.updateAndRenderTree
      )
    };
  }

}
