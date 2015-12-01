# 
# Copyright 2015 Stefano Terna
# 
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
# 
#     http://www.apache.org/licenses/LICENSE-2.0
# 
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
# 

FROM ubuntu:latest
MAINTAINER iottly


RUN mkdir /iottly_console
ADD /iottly_console /iottly_console

# npm installs -- only for dev #FIXME -- bower_comps are committed
#RUN cd /iottly_console \
#    && sudo npm install -g \
#    && sudo npm install -g bower \
#    && bower install --allow-root --force-latest

VOLUME /iottly_console
WORKDIR /iottly_console

# ensure that all files have readonly permissions for "others", 
# since nginx is running as non root user
# run `docker-compose start iottlyconsole` to set permissions over all static files
COPY docker-entrypoint.sh /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]