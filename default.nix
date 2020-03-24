{ pkgs ? import <nixpkgs> {} }:

with pkgs;

let
  node = nodejs-10_x;
in
mkShell {
  buildInputs =
  [
    node
    git
    gnumake
    yarn
    nomad
  ];
}
