#!/bin/sh
set -e

# always run from local dir
cd `dirname $0`

case "$1" in
    "build")
        shift
        $0 mvn clean package $*
        ;;
    "build-quick")
        shift
        $0 build -DquickRun=true -DskipTests $*
        ;;
    "build-docker")
        shift
        docker build -t package-track-ui ../package-track-ui
        docker build -t package-track-server .
        ;;
    "run-all")
        shift
        $0 build-docker
        MYIP=$(ifconfig | grep '\<inet\>' | cut -d ' ' -f2 | grep -v '127.0.0.1')
        docker rm -f package-track-ui || true
        # start the frontend (UI)
        docker run -it --rm -d \
            -p 3456:80 \
            --add-host REMOTE_API_HOST:$MYIP \
            --name package-track-ui \
            package-track-ui
        # start the backend
        docker run -it --rm \
            -p 8080:8080 \
            --name package-track-server \
            package-track-server
        ;;
    "run")
        shift
        $0 build-quick
        APP=target/rest-1.0.0.jar
        java -jar $APP $*
        ;;
    *)
        maven_cache_repo="$HOME/.m2/repository"
        mkdir -p "$maven_cache_repo"
        set -x
        docker run -it --rm \
                -w /gen \
                -v "${PWD}:/gen" \
                -v "${maven_cache_repo}:/root/.m2/repository" \
                maven:3-jdk-8-alpine "$@"
esac
