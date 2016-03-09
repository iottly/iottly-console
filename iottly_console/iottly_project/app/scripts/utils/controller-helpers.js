Utils.controllerhelpers = { 


  getProject: function(controllerscope, routeParams, projectService) {
    
    controllerscope.project = controllerscope.project || { data: {}};            

    console.log(routeParams.id);
    projectService.getProject(routeParams.id).then(function(data){
      controllerscope.project.data = data;
    }, function(error) {
      console.error(error);
    });

  }

};