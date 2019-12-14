import React from 'react';
import './App.css';
import { URL, Name, Resource, Leaf, Tree } from './core/main';


const ble: Tree = [{content: "elon", is_done: false}, [
    [{content: "mózg", is_done: true}, [
      [{content: "mozg1", is_done: false}, []],
      [{content: "mozg2", is_done: false}, []],
      [{content: "mozg3", is_done: false}, []]
    ]],
    [{content: "leci", is_done: false}, []],
    [{content: "w marsa", is_done: true}, []],
    [{content: "mózg", is_done: true}, []],
    [{address: "https://", is_done: true}, []]
]];

function fuj(t: Tree)
{
    // TODO: handle null
    if (!t)
        return;

    // TODO: destruction syntax
    const resource = t[0];
    const subtrees = t[1];

    return (
        // TODO: wtf div
        // TODO: handle unhandled properties
        // TODO: typeguards is a protip
        <div>

            <li>
              {resource && (resource as Name).content}
              {(resource as URL).address}
              {resource.is_done
                ? <input type="checkbox" checked disabled />
                : <input type="checkbox" disabled />}

              </li>
            <ul>
                {subtrees.map(fuj)}
            </ul>
        </div>
    )
}

const App: React.FC = () => {
  return (
    <div className="App">
      {fuj(ble)}
    </div>
  );
}

export default App;
