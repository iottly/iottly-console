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

#sudo docker build -t frmgoal .
#sudo docker run -d --name goal frmgoal

FROM ubuntu:latest
MAINTAINER iottly


RUN mkdir /iottly_console
ADD /iottly_console/static /iottly_console/static
ADD /iottly_console/templates /iottly_console/templates
