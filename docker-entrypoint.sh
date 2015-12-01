#!/bin/bash
set -e

if [ "$1" = '/bin/true' ]; then
    #ensure that all files have readonly permissions for "others", since nginx is running as non root user
	chmod -R o+r .
	exec "$@"
fi

exec "$@"
