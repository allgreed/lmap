import React from 'react';
import logo from './logo.svg';
import './App.css';
//import { Tree, Leaf } from './core/main.ts';

// TODO: fix it
interface URL {
    address: string;
    is_done: boolean;
}

interface Name {
    content: string;
    is_done: boolean;
}

export type Resource = URL | Name;

export type Leaf = null;
export type Tree = Leaf | [Resource, Tree[]];
// endTODO

const ble: Tree = [{content: "elon", is_done: false}, [
    [{content: "mózg", is_done: true}, []],
    [{content: "leci", is_done: false}, []],
    [{content: "w marsa", is_done: true}, []],
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
        <div>
            // TODO: handle unhandled properties
            // TODO: typeguards is a protip
            <li>[{resource.is_done ? <input type="checkbox" checked disabled /> : <input type="checkbox" disabled />}]</li>  // TODO: checkbox
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
