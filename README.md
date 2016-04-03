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
- files are served by the [iottly-http-load-balancer](https://github.com/iottly/iottly-http-load-balancer) service;
- it calls [API](https://github.com/iottly/iottly-core) service to interact with database and IoT devices;
- it connects to [iottly-core](https://github.com/iottly/iottly-core) service via websockets to receives real-time notifications from IoT devices.

*iottly-console* is based on angularjs v1 and it's actually two angular applications:
- iottly-main: provides access to the list of IoT projects the user has created
- iottly-project: provides access to each specific IoT project for devices, messages, and communication management

# Setup instructions

Please refer to [Iottly docker](https://github.com/iottly/iottly-docker) for prerequisites and full Iottly setup.

# bower install and Yeoman app Generator 

A specific dev [container](https://github.com/iottly/iottly-console/blob/mvcangular/Dockerfile) is provided to manage all bower, npm, grunt and yeoman stuff:
- execute [`./start_nodedev.sh`](https://github.com/iottly/iottly-console/blob/mvcangular/start_nodedev.sh) to build and start the interactive container. The guest working dir is a Docker mount of the host dir `iottly-console/iottly_console`
- so from within the container `cd iottly_main` or `cd iottly_project` depending on which app you want to work on;
- after a fresh clone you'll need to generate all the bower_components resources for both apps:
  - `cd iottly_main` and then `bower install`
  - `cd iottly_project` and then `bower install`
  - will install all the required packages as for bower.json config files
- to generate new web app components use following expressions for [yeoman](https://github.com/yeoman/generator-angular) (from proper app dir):
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
- to install new packages use bower again (from proper app dir):
  - `bower install <package> --save`
  - `--save` will persist the package into bower.json to be committed later