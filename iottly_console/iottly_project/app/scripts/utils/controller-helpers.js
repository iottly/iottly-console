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
    var msg = {};

    message.typetag = message.type.split(' ').join('_');
    msg[message.typetag] = {};
    

    message.keys.forEach(function(element, index, array){
      msg[message.typetag][element.key.split(' ').join('_')] = element.value;
    });

    return JSON.stringify(msg);
  }




};