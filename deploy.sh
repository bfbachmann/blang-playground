#!/bin/bash 

set -e

{
        # Pull from master
        echo -e "\n\n===> Pulling from blang-playground:master...\n"
        cd blang-playground
        git pull

        # Build playground Docker image
        echo -e "\n\n===> Building Playground Docker image...\n"
        cd compiler/base
        docker build --no-cache -t bfbachmann/blang-playground:latest .

        # Clean up Docker garbage
        docker system prune -f
        docker volume prune -f

        # Clean up any running containers
        containers="$(docker ps -aq)"
        if [ -n $containers ]; then
                docker stop $containers && docker rm $containers
        fi

        cd ../..

        # Build Rust binary
        echo -e "\n\n===> Building Rust binary...\n"
        cd ui
        cargo build --release
        sudo setcap 'cap_net_bind_service=+ep' ./target/release/ui

        # Build frontend
        echo -e "\n\n===> Building frontend...\n"
        cd frontend
        /home/bfbachmann/.local/share/pnpm/pnpm build:production

        # Restart service
        echo -e "\n\n===> Restarting service...\n"
        sudo systemctl restart blang-playground

        echo -e "\n\n===> DONE\n"

} > update.log 2>&1