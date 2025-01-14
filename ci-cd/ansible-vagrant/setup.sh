#!/bin/bash

echo "Checking for processes using KVM..."
PIDS=$(lsof -n -w -t /dev/kvm)

if [ ! -z "$PIDS" ]; then
    echo "Found processes using KVM. Stopping them..."
    for PID in $PIDS; do
        echo "Stopping process $PID"
        sudo kill -TERM $PID
        sleep 2
    done
fi

echo "Attempting to unload KVM modules..."
sudo modprobe -r kvm_intel || echo "Warning: Could not unload kvm_intel"
sudo modprobe -r kvm || echo "Warning: Could not unload kvm"

echo "Starting Vagrant..."
vagrant up