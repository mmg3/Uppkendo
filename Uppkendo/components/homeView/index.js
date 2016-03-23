'use strict';


/* ------------------------------------------------------------------------------------------------------------------------------
   JS de vista view, la primera en cargarse por defecto
*  ------------------------------------------------------------------------------------------------------------------------------ */
app.homeView = kendo.observable({
    onShow: function(e) {
		var hash = localStorage.getItem('hash');
		var codi = localStorage.getItem('codi');
		var id = localStorage.getItem('id');
        
		if(!codi) {
			//alert('redirecting...');
			//var app = new kendo.mobile.Application();
			kendo.history.navigate("#components/homeView/loginView.html");
			return;
		}
        
        /*var networkState = navigator.connection.type;

        var states = {};
        states[Connection.UNKNOWN] = 'Unknown connection';
        states[Connection.ETHERNET] = 'Ethernet connection';
        states[Connection.WIFI] = 'WiFi connection';
        states[Connection.CELL_2G] = 'Cell 2G connection';
        states[Connection.CELL_3G] = 'Cell 3G connection';
        states[Connection.CELL_4G] = 'Cell 4G connection';
        states[Connection.CELL] = 'Cell generic connection';
        states[Connection.NONE] = 'No network connection';

        $('#sp_connection_type').text(states[networkState] + " " + device_language);

        if (states[networkState] == 'No network connection') {
            navigator.notification.alert(
                'Sin acceso a internet!',
                oppenSettings,
                'Network ',
                'OK'
            );
            return;
        }*/
        
        var baseDir = baseUrl();
        var puerto = basePort();
        var protocolo = baseProtocol();
        
        if(!$.trim($("#tareas").html())) {
            
            var everlive = new Everlive({
                appId: '60n1765bfcynawwc',
                scheme: 'http' // switch this to 'https' if you'd like to use TLS/SSL encryption and if it is included in your subscription tier
            });
            
            var devicePushSettings = {
                iOS: {
                    badge: 'true',
                    sound: 'true',
                    alert: 'true'
                },
                android: {
                    projectNumber: '970031689994'
                },
                wp8: {
                    channelName: 'EverlivePushChannel'
                },
                notificationCallbackIOS: onPushNotificationReceived,
                notificationCallbackAndroid: onPushNotificationReceived,
                notificationCallbackWP8: onPushNotificationReceived
            };
            
            everlive.push.register(devicePushSettings, function(data) {
                //alert("Registro: "+JSON.stringify(data));
                //alert("Registro: "+data.token);
                
                var urls = protocolo+'://'+baseDir+':'+puerto+'/upp-restful/api/usuarios/actualizapush/'+id+'/'+data.token;
                
                $.ajax({
                    data:{},
                    type: "POST",
                    dataType: "json",
                    contentType: "application/json",
                    crossDomain: true,
                    url:urls,
                    success: function(data, textStatus, xhr){
                        //ok
                    },
                    error: function( xhr, textStatus, errorThrown ) {
                        window.plugins.toast.showShortBottom('Error al procesar la información.')
                        console.log( "HTTP Status: " + xhr.status );
                        console.log( "Error textStatus: " + textStatus );
                        console.log( "Error thrown: " + errorThrown );
                        return;
                    }
                });
                
                //alert("Registrado exitosamente!!!");
            }, function(err) {
                alert("1.Error: " + err.message);
            });
            
            
        }
        //if(!$.trim($("#tareas").html())) {
        
        $('#tareas').remove();
        
        var $ulTareas = $('<ul id="tareas" style="font-size:0.9em;"></ul>');
			$("#vista_tareas").append($ulTareas);
        
		var urls = protocolo+"://"+baseDir+":" + puerto +"/upp-restful/api/solicitudes/tareas/"+codi;
		
       
		
            $("#tareas").kendoMobileListView({
                dataSource: new kendo.data.DataSource({
                  transport: {
                    read: {
                      url: urls,
                      dataType: "json"
                    }
                  },
                  schema: {
                    total: function() { return 500; }
                  }
                }),
                template: "<div onclick='retornaTareaUsuario(#: solicitudId #)'><label id='#: solicitudId #'>#: 'Asunto: '+problema #<br>#: 'Fecha Limite: '+fechaAsignada #</label></div>"
            });
            
        //}
            
        if($('#usuario_nombre').text() == 'Usuario')
        {
            $('#usuario_nombre').text(codi);
        }
        
        
	},
    afterShow: function() {
    }
});

/*$(document).ready(function(){
   $('.km-rightitem').click(function(e){
       e.preventDefault();
       alert('km-rightitem');
   })
});

function refrescaTareas(e) {
    e.preventDefault();
    alert('refresca');
    //$('#tareas').remove();
    //onShow();
}*/

function retornaTareaUsuario(solicitudId) {
	if(solicitudId>0)
		kendo.history.navigate("#components/homeView/tareaView.html?solicitudId="+solicitudId);
}


/* ------------------------------------------------------------------------------------------------------------------------------
   JS de vista tareaView
*  ------------------------------------------------------------------------------------------------------------------------------ */
app.tareaView = kendo.observable({
    onShow: function(e) {
		var hash = localStorage.getItem('hash');
		var codi = localStorage.getItem('codi');
		
		if(!codi) {
			//alert('redirecting...');
			//var app = new kendo.mobile.Application();
			kendo.history.navigate("#components/homeView/loginView.html");
		}
        
        $('#tarea').remove();
        
        var $ulTarea = $('<ul id="tarea" style="font-size:0.9em;"></ul>');
			$("#vista_tarea").append($ulTarea);
        
        var baseDir = baseUrl();
        
		var solicitudId = e.view.params.solicitudId;
		var puerto = basePort();
        var protocolo = baseProtocol();
        
		var urls = protocolo+"://"+baseDir+":"+puerto+"/upp-restful/api/solicitudes/"+solicitudId;
        
        $("#tarea").kendoMobileListView({
            dataSource: new kendo.data.DataSource({
              transport: {
                read: {
                  url: urls,
                  dataType: "json"
                }
              },
              schema: {
                total: function() { return 500; }
              }
            }),
                template: "<li style='display:none;'><label id='codigoSol'>#: solicitudId #</label></li><li><label>TEMA: #: problema #</label></li><li><label>ASIGNADO POR: #: reporta #</label></li><li><label>FECHA ASIGNACI&Oacute;N: #: fecha #</label></li><li><label>FECHA LIMITE: #: fechaAsignada #</label></li><li><label>COMIT&Eacute;: #: nmEmpresa #</label></li><li><label>SUBCOMIT&Eacute;: #: clienteNombre #</label></li><li><label>ACTIVIDADES: #: detalleProblema #</label></li><li><label id='resultado_esperado'>RESULTADO DESEADO: #: solucionTecnica #</label></li><li><label>ACTUALIZACIONES: <textarea style='width:100%' id='actualizaTarea' /></label></li><li><label>Estado: <select  data-role='dropdownlist' id='estado' ><option value='1'>Activo</option> <option value='3'>Resuelto</option><option value='4'>Anulado</option></select></label></li><li><label>Fecha vencimiento<input id='fechaNueva' type='date' value='#: fechaAsignada #' /></label></li><li><a data-role='button' data-click='guardaActualizacion' style='width:cover' >Enviar</a></li>"
            });
	},
	afterShow: function() {
        
	   }
});

//ajax para guardar actualizacion tarea
//$('#guardaActualizacion').click(function(e) {
function guardaActualizacion(e)
{
    var hash = localStorage.getItem('hash');
    var codi = localStorage.getItem('codi');
    var id = localStorage.getItem('id');
    
    var solicitudId = $('#codigoSol').text();
    
    if(codi)
    {
        var baseDir = baseUrl();
        var puerto = basePort();
        var protocolo = baseProtocol();

        var urls = protocolo+'://'+baseDir+':'+puerto+'/upp-restful/api/solicitudes/actualizar';
        
        var estado = $('#estado').val();
        
        var fechaFinaliza = $('#fechaNueva').val().split("-");
        
        var fechaFin = fechaFinaliza[0]+'-'+fechaFinaliza[1]+'-'+fechaFinaliza[2];

        var actualizaTarea = $('#actualizaTarea').val();
        
        if(!actualizaTarea)
        {
            window.plugins.toast.showShortBottom('Por favor agregue el texto de actualizacion.');
            return;
        }
        
        var jsonTarea = {"estadoId": estado, "fechaFinaliza": fechaFin, "resultado": actualizaTarea, "solicitudId": solicitudId, "ubicacionAdjunto": "", "usuarioId": id};
        
        console.log(JSON.stringify(jsonTarea));
        //var jsonData = JSON.parse( jsonTarea ); 
        //return;
        $.ajax({
            data: JSON.stringify(jsonTarea),
            type: "POST",
            dataType: "json",
            contentType: "application/json",
            crossDomain: true,
            url:urls,
            success: function(data, textStatus, xhr){
                try
                {
                    window.plugins.toast.showShortBottom('Asignacion editada correctamente.')
                    kendo.history.navigate("#components/homeView/view.html");
                }
                catch(ex)
                {
                    //alert('Error al procesar la solicitud: '+ex.description);
                    window.plugins.toast.showShortBottom('Error al procesar la información.')
                    //$("#cedula").val('');
                }
            },
            error: function( xhr, textStatus, errorThrown ) {
                        window.plugins.toast.showShortBottom('Error al procesar la información.')
                        console.log( "HTTP Status: " + xhr.status );
                        console.log( "Error textStatus: " + textStatus );
                        console.log( "Error thrown: " + errorThrown );
                        return;
            }
        });
    }
    else
    {
        kendo.history.navigate("#components/homeView/loginView.html");
    }
}//);

/* ------------------------------------------------------------------------------------------------------------------------------
   JS de vista loginView
*  ------------------------------------------------------------------------------------------------------------------------------ */
app.loginView = kendo.observable({
    onShow: function() {
		var hash = localStorage.getItem('hash');
		var codi = localStorage.getItem('codi');
		
		if(codi) {
			//alert('redirecting...');
			//var app = new kendo.mobile.Application();
			kendo.history.navigate("#components/homeView/view.html");
		}
        
	},
	afterShow: function() {}
});
	//ajax para logearse
	function onClick(e) {
		var hash = localStorage.getItem('hash');
		var codi = localStorage.getItem('codi');
		//var app = new kendo.mobile.Application();
		
		if(!codi)
		{
			
			var user = $('#username').val();
			var pass = $('#password').val();
            
            var baseDir = baseUrl();
            var puerto = basePort();
        var protocolo = baseProtocol();
            
			var urls = protocolo+'://'+baseDir+':'+puerto+'/upp-restful/api/usuarios/login/'+user+'/'+pass;
			//alert(urls);
			$.ajax({
				data: {},
				type: "GET",
				dataType: "json",
				crossDomain: true,
				url:urls,
				success: function(data, textStatus, xhr){
					try
					{
						//alert(data.nombre);
						if(data.hash.length > 0)
						{
							localStorage.setItem('hash',data.hash);
							localStorage.setItem('codi',data.codi);
                            localStorage.setItem('id',data.id);
							//window.plugins.toast.showShortBottom('Bienvenid@ ' + data.codi);
							//window.location="main.html";
							kendo.history.navigate("#components/homeView/view.html");
						}
						else
						{
							$('#password').val('');
							//alert('Verifique los datos de acceso.');
							window.plugins.toast.showShortBottom('Verifique los datos de acceso.')
						}
					}
					catch(ex)
					{
						//alert('Error al procesar la solicitud: '+ex.description);
						window.plugins.toast.showShortBottom('Error al procesar la información.')
						//$("#cedula").val('');
					}
				},
				error: function( xhr, textStatus, errorThrown ) {
							window.plugins.toast.showShortBottom('Error al procesar la información.')
							console.log( "HTTP Status: " + xhr.status );
							console.log( "Error textStatus: " + textStatus );
							console.log( "Error thrown: " + errorThrown );
							return;
				}
			});
		}
		else
		{
			kendo.history.navigate("#components/homeView/view.html");
		}
	}

/* ------------------------------------------------------------------------------------------------------------------------------
   JS de vista agregarView, para agregar tareas
*  ------------------------------------------------------------------------------------------------------------------------------ */
app.agregarView = kendo.observable({
    onShow: function() {
		var hash = localStorage.getItem('hash');
		var codi = localStorage.getItem('codi');
        
		if(!codi) {
			//alert('redirecting...');
			//var app = new kendo.mobile.Application();
			kendo.history.navigate("#components/homeView/loginView.html");
			
		}
		
        
        var baseDir = baseUrl();
        var puerto = basePort();
        var protocolo = baseProtocol();
        
		var urls = protocolo+'://'+baseDir+':'+puerto+'/upp-restful/api/usuarios/'+codi+'/true';
        
        $.ajax({
				data: {},
				type: "GET",
				dataType: "json",
				crossDomain: true,
				url:urls,
				success: function(data, textStatus, xhr){
					try
					{
						//alert(data.nombre);
						if(data[0].codUsr.length > 0)
						{
							$('#usuariosLista').empty();
                            
                            var listaUsers = '';
                            
                            $.each(data,function(index,value){
                                listaUsers = listaUsers + '<option value='+data[index].usuarioCd+'>'+data[index].codUsr+'</option>'
                            });
                            
                            $('#usuariosLista').append(listaUsers);
						}
						else
						{
							window.plugins.toast.showShortBottom('Error de acceso a la red.')
						}
					}
					catch(ex)
					{
						//alert('Error al procesar la solicitud: '+ex.description);
						window.plugins.toast.showShortBottom('Error al procesar la información.')
						//$("#cedula").val('');
					}
				},
				error: function( xhr, textStatus, errorThrown ) {
							window.plugins.toast.showShortBottom('Error al procesar la información.')
							console.log( "HTTP Status: " + xhr.status );
							console.log( "Error textStatus: " + textStatus );
							console.log( "Error thrown: " + errorThrown );
							return;
				}
			});
        
        
        var urls = protocolo+'://'+baseDir+':'+puerto+'/upp-restful/api/almacenes';
        
        $.ajax({
				data: {},
				type: "GET",
				dataType: "json",
				crossDomain: true,
				url:urls,
				success: function(data, textStatus, xhr){
					try
					{
						//alert(data.nombre);
						if(data[0].almacenId >= 0)
						{
							$('#comiteLista').empty();
                            
                            var listaUsers = '';
                            
                            $.each(data,function(index,value){
                                if(data[index].almacenId != 0)
                                    listaUsers = listaUsers + '<option value='+data[index].almacenId+'>'+data[index].nmEmpresa+'</option>'
                            });
                            
                            $('#comiteLista').append(listaUsers);
						}
						else
						{
							window.plugins.toast.showShortBottom('Error de acceso a la red.')
						}
					}
					catch(ex)
					{
						//alert('Error al procesar la solicitud: '+ex.description);
						window.plugins.toast.showShortBottom('Error al procesar la información.')
						//$("#cedula").val('');
					}
				},
				error: function( xhr, textStatus, errorThrown ) {
							window.plugins.toast.showShortBottom('Error al procesar la información.')
							console.log( "HTTP Status: " + xhr.status );
							console.log( "Error textStatus: " + textStatus );
							console.log( "Error thrown: " + errorThrown );
							return;
				}
			});
        
        var urls = protocolo+'://'+baseDir+':'+puerto+'/upp-restful/api/clientes';
        //console.log(urls);
        $.ajax({
				data: {},
				type: "GET",
				dataType: "json",
				crossDomain: true,
				url:urls,
				success: function(data, textStatus, xhr){
					try
					{
						//alert(data.nombre);
						if(data[0].clienteId >= 0)
						{
							$('#subcomiteLista').empty();
                            
                            var listaUsers = '';
                            
                            $.each(data,function(index,value){
                                listaUsers = listaUsers + '<option value='+data[index].clienteId+'>'+data[index].clienteNombre+'</option>'
                            });
                            
                            $('#subcomiteLista').append(listaUsers);
						}
						else
						{
							window.plugins.toast.showShortBottom('Error de acceso a la red.')
						}
					}
					catch(ex)
					{
						//alert('Error al procesar la solicitud: '+ex.description);
						window.plugins.toast.showShortBottom('Error al procesar la información.')
						//$("#cedula").val('');
					}
				},
				error: function( xhr, textStatus, errorThrown ) {
							window.plugins.toast.showShortBottom('Error al procesar la información.')
							console.log( "HTTP Status: " + xhr.status );
							console.log( "Error textStatus: " + textStatus );
							console.log( "Error thrown: " + errorThrown );
							return;
				}
			});
        
	},
    afterShow: function() {
        
    }
});

function onClickGuardaTarea(e)
{
    var hash = localStorage.getItem('hash');
    var codi = localStorage.getItem('codi');
    var id = localStorage.getItem('id');
    
    if(codi)
    {
        var baseDir = baseUrl();
        var puerto = basePort();
        var protocolo = baseProtocol();
        
        var urls = protocolo+'://'+baseDir+':'+puerto+'/upp-restful/api/solicitudes/nuevo';
        
        var usuariosLista = $('#usuariosLista').val();
        var comiteLista = $('#comiteLista').val();
        var subcomiteLista = $('#subcomiteLista').val();
        var tema = $('#tema').val();
        var instrucciones = $('#instrucciones').val();
        var resultado = $('#resultado').val();
        
        
        var fechaFinaliza = $('#fechaFin').val().split("-");
        
        var dia = parseInt(fechaFinaliza[2])+1;
        if(dia < 10)
            dia = "0" + dia;
        
        var fechaFin = fechaFinaliza[0]+"-"+fechaFinaliza[1]+"-"+dia
        //alert(fechaFin);
        //return;
        
        if(!usuariosLista || !comiteLista || !subcomiteLista || !fechaFin || !tema || !instrucciones || !resultado)
        {
            window.plugins.toast.showShortBottom('Todos los campos son obligatorios.');
            return;
        }
        
        var jsonAgregaTarea = {"clienteId": subcomiteLista, "detalleProblema": instrucciones, "fechaAsignada": fechaFin, "problema": tema, "tecnicoAsignado": usuariosLista,"tecnicoReporta":id,"almacenId":comiteLista,"solucionTecnica":resultado};
        
        //console.log(JSON.stringify(jsonAgregaTarea));
        //var jsonData = JSON.parse( jsonTarea ); 
        
        $.ajax({
            data: JSON.stringify(jsonAgregaTarea),
            type: "POST",
            dataType: "json",
            contentType: "application/json",
            crossDomain: true,
            url:urls,
            success: function(data, textStatus, xhr){
                try
                {
                    window.plugins.toast.showShortBottom('Asignacion creada correctamente.')
                    kendo.history.navigate("#components/homeView/view.html");
                }
                catch(ex)
                {
                    //alert('Error al procesar la solicitud: '+ex.description);
                    window.plugins.toast.showShortBottom('Error al procesar la información.')
                    //$("#cedula").val('');
                }
            },
            error: function( xhr, textStatus, errorThrown ) {
                        window.plugins.toast.showShortBottom('Error al procesar la información.')
                        console.log( "HTTP Status: " + xhr.status );
                        console.log( "Error textStatus: " + textStatus );
                        console.log( "Error thrown: " + errorThrown );
                        return;
            }
        });
    }
    else
    {
        kendo.history.navigate("#components/homeView/loginView.html");
    }
}


/* ------------------------------------------------------------------------------------------------------------------------------
   JS de vista usuarioView
*  ------------------------------------------------------------------------------------------------------------------------------ */
app.usuarioView = kendo.observable({
    onShow: function() {
		var hash = localStorage.getItem('hash');
		var codi = localStorage.getItem('codi');
		var id = localStorage.getItem('id');
		
		if(!codi) {
			kendo.history.navigate("#components/homeView/loginView.html");
		}
        
        $('#ulUserForm').remove();
        
        var $ulUsuario = $('<ul data-role="listview" id="ulUserForm" data-style="inset"></ul>');
			$("#userform").append($ulUsuario);
        
        var baseDir = baseUrl();
        var puerto = basePort();
        var protocolo = baseProtocol();
		
		var urls = protocolo+"://"+baseDir+":"+puerto+"/upp-restful/api/usuarios/"+codi;
        
        $.ajax({
            data: {},
            type: "GET",
            dataType: "json",
            crossDomain: true,
            url:urls,
            success: function(data, textStatus, xhr){
                try
                {
                    //alert(data.nombre);
                    if(data.usuarioCd > 0)
                    {
                        $('#idUsuario').text(data.usuarioCd);
                        $('#textoUsuario').text(data.codUsr);
                        $('#nombreUsuario').val(data.nombre);
                        $('#apellidoUsuario').val(data.apellido);
                        $('#mailUsuario').val(data.email);
                        
                        //window.plugins.toast.showShortBottom('Información actualizada.')
                        //kendo.history.navigate("#components/homeView/view.html");
                    }
                    else
                    {
                        //alert('Verifique los datos de acceso.');
                        window.plugins.toast.showShortBottom('Verifique su conexion a internet.')
                    }
                }
                catch(ex)
                {
                    //alert('Error al procesar la solicitud: '+ex.description);
                    window.plugins.toast.showShortBottom('Error al procesar la información.')
                    //$("#cedula").val('');
                }
            },
            error: function( xhr, textStatus, errorThrown ) {
                        window.plugins.toast.showShortBottom('Error al procesar la información.')
                        console.log( "HTTP Status: " + xhr.status );
                        console.log( "Error textStatus: " + textStatus );
                        console.log( "Error thrown: " + errorThrown );
                        return;
            }
        });
	},
	afterShow: function() {
        
	   }
});


function onClickGuardaUsuario(e)
{
    var hash = localStorage.getItem('hash');
    var codi = localStorage.getItem('codi');
    var id = localStorage.getItem('id');
    
    if(codi)
    {
        var baseDir = baseUrl();
        var puerto = basePort();
        var protocolo = baseProtocol();

        var urls = protocolo+'://'+baseDir+':'+puerto+'/upp-restful/api/usuarios/actualizar';
        
        var usuarioId = $('#idUsuario').text();
        var usuarioNombre = $('#nombreUsuario').val();
        var usuarioApellido = $('#apellidoUsuario').val();
        var usuarioEmail = $('#mailUsuario').val();
        
        if(!usuarioId || !usuarioNombre || !usuarioApellido || !usuarioEmail)
        {
            window.plugins.toast.showShortBottom('Todos los campos son obligatorios.');
            return;
        }
        
        var jsonUsuario = {"usuarioCd": usuarioId, "apellido": usuarioApellido, "nombre": usuarioNombre, "email": usuarioEmail,};
        
        console.log(JSON.stringify(jsonUsuario));
        //var jsonData = JSON.parse( jsonTarea ); 
        
        $.ajax({
            data: JSON.stringify(jsonUsuario),
            type: "POST",
            dataType: "json",
            contentType: "application/json",
            crossDomain: true,
            url:urls,
            success: function(data, textStatus, xhr){
                try
                {
                    //alert(data.nombre);
                    window.plugins.toast.showShortBottom('Usuario Editado correctamente.')
                       
                }
                catch(ex)
                {
                    //alert('Error al procesar la solicitud: '+ex.description);
                    window.plugins.toast.showShortBottom('Error al procesar la información.')
                    //$("#cedula").val('');
                }
            },
            error: function( xhr, textStatus, errorThrown ) {
                        window.plugins.toast.showShortBottom('Error al procesar la información.')
                        console.log( "HTTP Status: " + xhr.status );
                        console.log( "Error textStatus: " + textStatus );
                        console.log( "Error thrown: " + errorThrown );
                        return;
            }
        });
    }
    else
    {
        kendo.history.navigate("#components/homeView/loginView.html");
    }
}

/* ------------------------------------------------------------------------------------------------------------------------------
   JS de vista logoutView
*  ------------------------------------------------------------------------------------------------------------------------------ */

app.logoutView = kendo.observable({
    onShow: function() {
		localStorage.clear();
        kendo.history.navigate("#components/homeView/loginView.html");
	},
	afterShow: function() {
        
	   }
});


/* -------------------------------------------------------
*
*  Funcion para todas las vistas
*
* ------------------------------------------------------- */

function baseUrl() {
    return 'confiaenlineaec.com';
    //return '192.168.0.13';
    //return '192.168.0.171';
}

function basePort() {
    //return '6443';
    return '6081';
}

function baseProtocol() {
    return 'http'; //http o https
}

function onPushNotificationReceived(e) {
    alert(JSON.stringify(e));
};