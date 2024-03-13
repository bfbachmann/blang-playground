#syntax=docker/dockerfile:1.5

FROM ubuntu:20.04 as toolchain

ENV DEBIAN_FRONTEND="noninteractive"
ENV LLVM_SYS_160_PREFIX=/usr/lib/llvm-16

# `build-essential` and `file` are needed for backtrace-sys
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    file \
    gcc \
    git \
    libssl-dev \
    pkg-config \
    lsb-release \
    wget \
    software-properties-common \
    gnupg \
    zlib1g-dev \
    libzstd-dev \
    && rm -rf /var/lib/apt/lists/*

# Install LLVM 16
RUN wget https://apt.llvm.org/llvm.sh && chmod +x llvm.sh && ./llvm.sh 16 all

# Add a non-root playground user
RUN useradd -m playground -d /playground
RUN usermod -p '!!' root # Disable all passwords for root

# Attach the security note
COPY --chown=playground attach_notice.sh security_notice.txt /playground/
RUN /playground/attach_notice.sh /playground/security_notice.txt /etc/passwd && \
    /playground/attach_notice.sh /playground/security_notice.txt /etc/shadow && \
    rm -f /playground/attach_notice.sh

USER playground
ENV USER=playground
ENV PATH=/playground/.cargo/bin:$PATH
WORKDIR /playground

# Ensure that we are using the latest stable version of rustup.
# A new manifest will trigger these lines to run again, forcing
# a new download of rustup and installation of Rust.
ADD --chown=playground https://static.rust-lang.org/rustup/release-stable.toml /playground/tools/rustup-manifest.toml
ADD --chown=playground https://static.rust-lang.org/dist/channel-rust-stable-date.txt /playground/tools/rust-channel-version
RUN curl https://sh.rustup.rs -sSf | sh -s -- \
    -y \
    --profile minimal \
    --default-toolchain stable \
    --component rust-src

# Download and install the Blang compiler.
RUN git clone --depth=1 https://github.com/bfbachmann/blang.git
RUN mv blang/std ./std && cd blang && cargo install --path . --locked

COPY --chown=playground entrypoint.sh /playground/tools/

# Build wasm-tools

FROM toolchain as wasm-tools

RUN cargo install --locked wasm-tools

# Fetch all the crate source files

FROM toolchain as sources

RUN cargo init /playground

COPY --chown=playground Cargo.toml /playground/Cargo.toml
COPY --chown=playground crate-information.json /playground/crate-information.json
RUN cargo fetch

# Set up cargo-chef for faster builds

FROM toolchain as chef-available

RUN cargo install --locked cargo-chef

WORKDIR /orchestrator

# Prepare the orchestrator's dependencies

FROM chef-available as prepare-orchestrator

COPY --chown=playground asm-cleanup /asm-cleanup
COPY --chown=playground orchestrator /orchestrator
RUN cargo chef prepare

# Build the orchestrator

FROM chef-available as build-orchestrator

COPY --chown=playground asm-cleanup /asm-cleanup
COPY --chown=playground --from=prepare-orchestrator /orchestrator/recipe.json /orchestrator/recipe.json
RUN cargo chef cook --locked --release

COPY --chown=playground asm-cleanup /asm-cleanup
COPY --chown=playground orchestrator /orchestrator
RUN cargo install --locked --path .

# Compiler and pre-compiled crates

FROM sources

RUN cargo build
RUN cargo build --release
RUN rm src/*.rs

COPY --from=build-orchestrator /playground/.cargo/bin/worker /playground/.cargo/bin/worker
COPY --from=build-orchestrator /playground/.cargo/bin/blang /playground/.cargo/bin/blang

ENTRYPOINT ["/playground/tools/entrypoint.sh"]
