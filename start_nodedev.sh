docker build -t nodedev .
cd iottly_console
docker run -it -v `pwd`:/iottly_console nodedev /bin/bash