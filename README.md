# lmap
Essentially a mind map and a todolist 

[![Build Status](https://cloud.drone.io/api/badges/allgreed/lmap/status.svg)](https://cloud.drone.io/allgreed/lmap)
[![codecov](https://codecov.io/gh/allgreed/lmap/branch/master/graph/badge.svg)](https://codecov.io/gh/allgreed/lmap)

## Demo
[lmap.allgreed.pl](https://lmap.allgreed.pl/)

## Getting started
TODO

## Limitations
- Due to our node addressing scheme the app beahviour is undefined when you create a tree with more than 18014398509481983 nodes. Yup, that's 18 quadrillions. Slightly more than [the estimate count of live ants on Earth](https://en.wikipedia.org/wiki/Orders_of_magnitude_(numbers)#1015) and slightly less than [possible Rubik's qube states](https://en.wikipedia.org/wiki/Orders_of_magnitude_(numbers)#1018). Please do [create an issue](https://github.com/allgreed/lmap/issues/new) if this becomes a serious problem for you. In that case (and **only** in that case) we'll be glad to work on our addressing scheme to aliviate the pain

## Development

### Prerequisites
- [nix](https://nixos.org/nix/manual/#chap-installation)
- direnv (`nix-env -i direnv`)

Hint: if something doesn't work because of missing package please add the package to `default.nix` instead of installing on your computer. Why solve the problem for one if you can solve the problem for all? ;)

### Setup
```
make init
```

### Everything else
```
make help
```
