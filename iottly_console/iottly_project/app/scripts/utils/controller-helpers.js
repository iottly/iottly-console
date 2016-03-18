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