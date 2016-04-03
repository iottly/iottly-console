/*

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

*/

Utils.controllerhelpers = { 


  getProject: function(controllerscope, routeParams, projectService) {
    
    controllerscope.project = controllerscope.project || { data: {}};            

    console.log(routeParams.id);
    projectService.getProject(routeParams.id).then(function(data){
      controllerscope.project.data = data;
    }, function(error) {
      console.error(error);
    });

  },

  messagetoJSON: function(message){
    var msg = angular.copy(message);

    delete msg.metadata;

    return JSON.stringify(msg);
  },

  renderMessage: function(message) {
    var msg = angular.copy(message);

    typeProp = Utils.controllerhelpers.getTypeProp(msg);

    for (prop in typeProp) {
      if (typeProp.hasOwnProperty(prop)) {
        typeProp[prop] = Utils.controllerhelpers.getRenderedProperty(typeProp[prop]);
      }
    };

    delete msg.metadata;

    return JSON.stringify(msg);

  },

  getRenderedProperty: function(property){
    switch (property.type)
    {
      //['FixedValue', 'MultipleChoice', 'FreeValue'];
      case "FixedValue":
        return property.value;
      case "MultipleChoice":
        var listvalues = '';
        for (value in property.listvalues) {
          listvalues += property.listvalues[value] + '|';
        }
        listvalues = listvalues.substring(0,listvalues.length - 1);
        return '<' + listvalues + '>';
      case "FreeValue": 
        return '<free value>';
      default: 
        return 'Unknown type';
    }      
  },

  getTypeProp: function(message){
    if (message.metadata.type){
      var normtype = Utils.controllerhelpers.normalizeProperty(message.metadata.type);        
      return message[normtype];
    } else
      return {};
  },

  normalizeProperty: function(type) {
    return type.split(' ').join('_')
      .split(',').join('')
      .split('.').join('');
  }


};