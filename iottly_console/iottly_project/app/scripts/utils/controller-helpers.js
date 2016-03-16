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


  normalizeProperty: function(type) {
    return type.split(' ').join('_')
      .split(',').join('')
      .split('.').join('');
  }


};