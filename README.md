# Blang Playground

This is the home of the [Blang Playground][real], adapted from the [Rust playground][rust].

[real]: https://play.blang.net/
[rust]: https://play.rust-lang.org/

## What's it do?

The playground allows you to experiment with Blang before you install
it locally, or in any other case where you might not have the compiler
available.

## Architecture

A [React][react] frontend communicates with an [Axum][axum]
backend. [Docker][docker] containers are used to provide the various
compilers and tools as well as to help isolate them.

We hope that this frontend and backend stack is comfortable to
potential contributors! If you are interested in contributing, please
feel free to ask a question and we might even be able to point out
some useful resources.

[react]: https://reactjs.org/
[axum]: https://github.com/tokio-rs/axum
[docker]: https://www.docker.com/

## Resource Limits

### Network

There is no network connection between the compiler container and the
outside world.

### Memory

The amount of memory the compiler and resulting executable use is
limited by the container.

### Execution Time

The total compilation and execution time is limited by the container.

### Disk

This sandbox **does not** provide any disk space limits. It is
suggested to run the server such that the temp directory is a
space-limited. One bad actor may fill up this shared space, but it
should be cleaned when that request ends.

## Development

### Build the UI
```
cd ui/frontend
pnpm install
pnpm watch # Will rebuild and watch for changes
```

If you don't need the backend running because you are only making
basic HTML/CSS/JS changes, directly open in your browser the built
`ui/frontend/build/index.html`.

### Build and run the server

```
cd ui
cargo run
```

There are some optional configuration parameters described in the
[ui README](./ui/README.md) which you may set in a `.env` file. The server will
run with no configuration, but in order to load and save gists a GitHub token
must be configured.

### Build or download the containers
```
cd compiler
./build.sh # If you want to test changes to the containers
./fetch.sh # If you just want the current playground
```

## License

Licensed under either of
 * Apache License, Version 2.0 ([LICENSE-APACHE](LICENSE-APACHE) or http://www.apache.org/licenses/LICENSE-2.0)
 * MIT license ([LICENSE-MIT](LICENSE-MIT) or http://opensource.org/licenses/MIT)
at your option.
