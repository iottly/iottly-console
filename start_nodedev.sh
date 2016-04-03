docker build -t iottlynodedev .
cd iottly_console
docker run -it -v `pwd`:/iottly_console iottlynodedev /bin/bash