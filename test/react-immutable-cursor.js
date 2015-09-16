import chai from 'chai';
import sinon from 'sinon';
import Immutable from 'immutable';
import Cursor from 'immutable-cursor';

const expect = chai.expect;

import Root from './../src/react-immutable-cursor';

describe('React immutable cursor', () => {
  describe('Obtain the raw JS object that describes the initial state of the application', () => {
    it('throws an error if this.initialState is not defined on the child class', () => {
      const method = Root.prototype.createAtom.bind({});
      expect(method).to.throw('No method initialState defined on React class that initial props are passed to');
    });
    it('initial props passed to the component are obtained', () => {
      const mockInstance = {
        initialState: sinon.spy(function() {
          return {
            hello: 'it works'
          };
        }),
        updateAndRenderTree: sinon.stub
      };

      Root.prototype.createAtom.call(mockInstance);

      expect(mockInstance.initialState.called).to.be.true;
    });
  });

  it('Converts the props into an immutable and sets up the root cursor', () => {
    const mockInstance = {
      initialState: sinon.spy(function() {
        return {
          hello: 'it works'
        };
      }),
      updateAndRenderTree: sinon.stub
    };

    const cursor = Root.prototype.createAtom.call(mockInstance);
    expect(cursor.cursor.toString()).to.equal('Cursor { "hello": "it works" }');
    expect(cursor.cursor.deref()).to.deep.equal(Immutable.fromJS({
      hello: 'it works'
    }));
  });

  it('Triggers the \'change\' callback when that cursors value is updated', () => {
    const mockInstance = {
      initialState: sinon.spy(function() {
        return {
          work: {
            company: 'Red Badger',
            position: 'Developer'
          }
        };
      }),
      updateAndRenderTree: sinon.spy()
    };

    const instance = Root.prototype.createAtom.call(mockInstance);

    instance.cursor.setIn(['work', 'position'], 'coffee maker');

    expect(mockInstance.updateAndRenderTree).to.have.been.called;
  });

  it('Callback calls setState with a new cursor', () => {
    const mockInstance = {
      setState: sinon.spy(),
      updateAndRenderTree: sinon.spy()
    };

    const newData = Immutable.fromJS({
      work: {
        company: 'Red Badger',
        position: 'Developer'
      }
    });

    Root.prototype.updateAndRenderTree.call(mockInstance, newData);
    expect(mockInstance.setState).to.be.called;
    const callbackData = mockInstance.setState.args[0][0].cursor.deref();
    expect(newData.equals(callbackData)).to.be.true;
  });
});
