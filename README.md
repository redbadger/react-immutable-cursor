# React Immutable Cursor
[![Circle CI](https://circleci.com/gh/redbadger/react-immutable-cursor/tree/master.svg?style=svg)](https://circleci.com/gh/redbadger/react-immutable-cursor/tree/master)
[![npm version](https://badge.fury.io/js/react-immutable-cursor.svg)](http://badge.fury.io/js/react-immutable-cursor)

> A React helper allowing for intuitive bidirectional data flow, through the use of cursors into a single, immutable root atom.

## Rationale

The organisation and management of application-level state in a project can be complex. React itself promotes the concept
of top-down rendering through component composition (thus resulting in the same directional flow of data). However, data must have
the ability to flow bidirectionally to provide a useful application - i.e a button deeply nested in the component tree that submits a new record
in a list.

I've tried several ideas to solve this issue, including the [flux architecture](https://facebook.github.io/flux/docs/overview.html), however it [has some conceptual problems](https://github.com/arch-js/arch/blob/master/docs/04-arch-architecture.md#issues-with-flux).

### Why I built it

I wanted:

* **to incorporate a single, root-level atom as my application state**

  This would allow me keep all my state at the very fringes of my applicaton, and means my components can become (essentially) pure, referentially-transparent functions. This backing structure also needed to be immutable, so I could make performance alterations to the application using reference-based object equality checks in `shouldComponentUpdate()`.

* **to use an elegant, idiomatic interface to communicate with the above**

  I needed some way to communicate reads and writes to the aforementioned backing structure, but I didn't want to compromise it's API design due to the store being of an immutable type.


* **require as little integration as possible in my React application**

  The elegance of the solution would be gauged by the level of effort required to integrate it into an existing React application.

## The solution

Cursors over an immutable backing structure, instantiated using a React component class!

### How do cursors work?

A model borrowed from [Om](https://github.com/omcljs/om) (a ClosureScript interface to React), a cursor provides a mutative API that holds a scoped reference to a particular sub atom in the application state. Once created, this sub-atom can be updated from any cursor that holds a reference to it. Cursors can also be derived from one another, which make them incredibly powerful.

I've always been taken with the [Immutable JS](https://github.com/facebook/immutable-js/) library and have been watching the development of [their cursor implementation](https://github.com/facebook/immutable-js/tree/master/contrib/cursor) closely. An an [issue has recently been fixed](https://github.com/facebook/immutable-js/pull/622) that until now, meant they couldn't be used in the context of an application architecture like React.

## How to use

### Root-level component

Below is a barebones setup of a root-level component within your application.

```js
import React from 'react/addons';
import Root from 'react-immutable-cursor';

// Extend your own component from the class provides by react-immutable-cursor
export default class extends Root {

  // The return value of this.createAtom() will be the root-level cursor.
  state = this.createAtom();

  // Make sure you define an initialState method that returns an object. This object will form the root backing structure.
  initialState() {
    return {
      people: this.props.people,
      pending: null,
      canManage: this.props.canManage,
      projects: {
        booked: this.props.projects.booked,
        unbooked: this.props.projects.unbooked
      }
    };
  }

  render() {
    // This is where the root cursor currently lives, although this will change soon.
    const cursor = this.state.cursor
    return (
      <div id="timesheet">
        <Heading people={cursor.get('people')} />
        <UnbookedList people={cursor.get('people')} projects={cursor.getIn(['projects', 'unbooked'])}/>
        <BookedList people={cursor.get('people')} projects={cursor.getIn(['projects', 'booked'])}/>
  }

}
```

### Deriving and using cursors

Building on the above, below would be the `BookedList` component.

```js
import React from 'react/addons';
import Root from 'react-immutable-cursor';

export default class extends React.Component {

  addBooking(e) {
    // Using Immutabile JS' mutative API, we're calling .push() directly on this
    // sub cursor. This is an update action, this will cause a new, updated immutable
    // backing structure at the root-level and will trigger a re-render of the
    // entire application.
    this.props.projects.push({
      name: 'Some name',
      id: Math.random()
    })
  }

  render() {
    return (
      <div>
        <ul>
          {this.props.projects.map((project) => {
            <li>
              {booking.get('name')} // This would return a primitve
            </li>
          })}
        </ul>
        <button onClick={this.addBooking.bind(this)}>Add booking</button>
      </div>
    )
  }
}
```

## Who's this for?

* People who are sick of `prop` callback hell
* People who have tried Flux but have experienced [it's disadvantages at scale](https://github.com/arch-js/arch/blob/master/docs/04-arch-architecture.md#issues-with-flux).
* People who want to further embrace the idea of functional programming, and thus reap the rewards that this gives.
