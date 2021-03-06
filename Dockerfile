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

FROM node:7.2
MAINTAINER iottly

RUN mkdir /iottly_console
#ADD /iottly_console /iottly_console

WORKDIR /iottly_console 

RUN npm install -g grunt-cli bower yo generator-karma generator-angular --verbose


USER node

CMD /bin/bash
