#!/bin/bash

set -e

SOURCE_PATH="/home/bfbachmann/code/blang-playground"
DEST_PATH="/shared/blang-playground"

# Pull latest code from main
echo -e "\n\n===> Pulling from main...\n"
cd $SOURCE_PATH
git pull origin main

# Build ui binary, update its capabilities, and copy it to the right place
cd ui
cargo build --release
sudo setcap 'cap_net_bind_service=+ep' target/release/ui

# Build frontend
echo -e "\n\n===> Building frontend...\n"
cd frontend
pnpm build:production

# Copy assets to shared path
echo -e "\n\n===> Restarting service...\n"
sudo systemctl stop blang-playground
rm -rf $DEST_PATH
cp -r $SOURCE_PATH $DEST_PATH
sudo systemctl start blang-playground

echo -e "\n\n===> DONE\n"
