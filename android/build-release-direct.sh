#!/bin/bash
# Direct Release APK Build Attempt
cd "$(dirname "$0")"
export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk-1.8.jdk/Contents/Home
./gradlew clean assembleRelease --no-daemon 2>&1 | tail -20
