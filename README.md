# License

Copyright 2015 Stefano Terna

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

# iottly-console
The *iottly-console* repo hosts the html and js files for the iottly console frontend:
- files are served by the [iottly-core](https://github.com/iottly/iottly-core) service;
- it connects to the [iottly-core](https://github.com/iottly/iottly-core) service via websockets to receives messages in real-time.


# Setup instructions

Please refer to [Iottly docker](https://github.com/iottly/iottly-docker) for prerequisites and full Iottly setup.

# Yeoman app Generator

A specific dev [container](https://github.com/iottly/iottly-console/blob/mvcangular/Dockerfile) is provided to manage all npm, grunt and yeoman stuff:
- execute [`./start_nodedev.sh`](https://github.com/iottly/iottly-console/blob/mvcangular/start_nodedev.sh) to build and start the container
- from within the container use following expressions for yeoman to generate web app components (https://github.com/yeoman/generator-angular):
  - `yo angular:controller  <controller>`
  - `yo angular:directive   <directive>`
  - `yo angular:filter      <filter>`
  - `yo angular:route       <route>` 
  - `yo angular:service     <service>`  
  - `yo angular:provider    <provider>`
  - `yo angular:factory     <factory>`
  - `yo angular:value       <value>`
  - `yo angular:constant    <constant>`
  - `yo angular:decorator   <decorator>`
  - `yo angular:view        <view>`