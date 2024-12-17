$(document).ready(function () {
    $("#lstCarreras").chosen({width: "100%", disable_search_threshold: 4});
    resize();
    var tblAlumnos;
    function initTable() {
        tblAlumnos = $('.js-dataTable-full-pagination-Fixed').dataTable({
            ordering: true,
            orderable: false,
            paging: true,
            searching: true,
            info: true,
            pagingType: "full_numbers",
            columnDefs: [{orderable: false, targets: 8}],
            pageLength: 15,
            lengthMenu: [[5, 10, 15, 20, 50], [5, 10, 15, 20, 50]],
            "columns": [
                null,
                null,
                {"width": "20%"},
                {"width": "20%"},
                {"width": "20%"},
                {"width": "5%"},
                {"width": "20%"},
                {"width": "10%"},
                {"width": "5%"},
            ]
        });
    }
    initTable();
    function LoadTable() {
        $(".tooltip").hide();
        $.ajax({
            url: '../Transporte/queryCAlumnos.jsp',
            data: '&txtBandera=1',
            type: 'POST',
            success: function (resp) {
                var indicador = resp.split("|")[0];
                if (indicador.toString().trim() === "success") {
                    $('#DivTblAlumnos').html(resp.split("|")[1]);
                    $('[data-toggle="tooltip"]').tooltip();
                    TableActions();
                    initTable();
                    setTimeout(function () {
                        $('#mainLoader').fadeOut();
                    });
                } else {
                    show_swal("¡Upps!", resp.split('|')[1], "error");
                }
            }, complete: function () {
                $(".tooltip").hide();
            }
        });
    }

    $('#btnImportarCarrerasExcel').click(function () {
        $('#fileAlumnos').click();
    });

    $('#fileAlumnos').on('change', function () {
        var archivo = $(this).val();

        if (archivo != null && archivo.toString() != "undefined") {
            if (archivo.toString().endsWith('.xls') || archivo.toString().endsWith('.xlsx')) {
                swal('¡Cargando información!', 'Se están registrando los alumnos en el sistema', 'info').then(function () {
                    $('#loadAction').fadeIn();
                });
                $('#importarArchivo').click();
            } else {
                swal('¡Upps!', 'Debes seleccionar el formato predeterminado con la información de los alumnos', 'warning');
                $('#fileAlumnos').val('');
            }
        }
    });

    $('.btnAccionesAlumno').click(function () {
        $("form[name='FormAlumno']").submit(function (e) {
            e.preventDefault();
        }).validate({
            ignore: [],
            errorClass: 'help-block text-right animated fadeInDown',
            errorElement: 'div',
            errorPlacement: function (error, e) {
                jQuery(e).parents('.form-group > div').append(error);
            },
            highlight: function (e) {
                var elem = jQuery(e);
                elem.closest('.col-xs-6').removeClass('has-error').addClass('has-error');
                elem.closest('.help-block').remove();
            },
            success: function (e) {
                var elem = jQuery(e);
                elem.closest('.col-xs-6').removeClass('has-error');
                elem.closest('.help-block').remove();
            },
            rules: {
                fileAlumnos: {
                    required: true,
                    extension: "xls|xlsx"
                }
            },
            messages: {
                'fileAlumnos': {
                    required: function () {
                        swal('¡Upps!', 'Selecciona el archivo predeterminado con la información de los alumnos', 'warning');
                    },
                    extension: function () {
                        swal('¡Upps!', 'Selecciona el archivo excel con la información de los alumnos', 'warning');
                    }
                }
            },
            submitHandler: function (form) {

                var bandera = $('#txtBandera').val();
                $.ajax({
                    url: '../Transporte/queryCAlumnos.jsp',
                    type: 'POST',
                    data: new FormData(form),
                    processData: false,
                    contentType: false,
                    success: function (resp) {
                        if (resp.toString().includes('success')) {
                            swal('¡Alumnos agregados!', 'La importación de los alumnos se ha completado con éxito', 'success');
                            cargarListaCarreras();
                        } else if (resp.toString().includes('infoIncompleta')) {
                            if (resp.includes('||')) {
                                var split = resp.split("||");
                                swal('¡Upps!', 'La información de los alumnos en la página ' + split[1] + ' está incompleta, por favor revise el archivo e intente nuevamente. Recuerde que solamente el apellido materno es opcional', 'warning');
                            } else {
                                swal('¡Upps!', 'La información de los alumnos está incompleta, por favor revise el archivo e intente nuevamente. Recuerde que solamente el apellido materno es opcional', 'warning');
                            }

                        } else if (resp.toString().includes('sinAlumnos')) {
                            var split = resp.split('||');
                            swal('¡Upps!', 'No se encontraron alumnos para registar en la página ' + split[1] + '. Los registros posteriores NO fueron realizados', 'warning');
                        } else if (resp.toString().includes('formatoInvalido')) {
                            swal('¡Upps!', 'El archivo seleccionado no cumple con el formato requerido, recuerde que no debe modificar la estructura del formato', 'warning');
                        } else if (resp.toString().includes('sinCarrera')) {
                            var split = resp.split('||');
                            swal('¡Upps!',
                                    'El id de la carrera asignada al alumno ' + split[2] + " con matrícula " + split[1] +
                                    " no está registrada en el sistema, por favor rectifique la clave o registre la carrera para continuar. \n" +
                                    "Los registros posteriores a este alumno no se realizaron", 'error');
                            cargarListaCarreras();
                        } else if (resp.toString().includes('certificadoActivo')) {
                            var split = resp.split('||');
                            swal('¡Upps!', 'El alumno(a) ' + split[2] + ' con matrícula ' + split[1] +
                                    ' tiene un certificado electrónico activo, por lo que no es posible modificar su información. Los registros posteriores no fueron realizados', 'warning');
                            cargarListaCarreras();
                        } else if (resp.toString().includes('tituloActivo')) {
                            var split = resp.split('||');
                            swal('¡Upps!', 'El alumno(a) ' + split[2] + ' con matrícula ' + split[1] +
                                    ' tiene un título electrónico activo, por lo que no es posible modificar su información. Los registros posteriores no fueron realizados', 'warning');
                            cargarListaCarreras();
                        } else if (resp.toString().includes('curp')) {
                            var split = resp.split('||');
                            show_swal('¡Upps!', 'El alumno(a) ' + split[2] + ' con matrícula ' + split[1] +
                                    ' tiene una CURP (<b>' + split[3] + '</b>) que no es válida.<br><small>Los registros posteriores no fueron procesados.</small>', 'warning');
                            cargarListaCarreras();
                        } else if (resp.toString().includes('fechaExtranjero')) {
                            var split = resp.split('||');
                            show_swal('¡Upps!', 'El alumno(a) ' + split[2] + ' con matrícula ' + split[1] +
                                    ' no tiene una fecha de nacimiento: (<b>' + split[3] + '</b>) teniendo CURP como extranjero.<br><small>Los registros posteriores no fueron procesados.</small>', 'warning');
                        } else if (resp.toString().includes('celdaNoValida')) {
                            var split = resp.split('||');
                            show_swal('¡Upps!', 'El sistema encontró una celda con información no válida.<br> Fila: ' + split[1] + '. Columna: ' + split[2], 'warning');
                        } else {
                            show_swal("¡Upps!", resp.split('|')[1], "error");
                        }
                    }, complete: function () {
                        $('#fileAlumnos').val('');
                        $('#loadAction').fadeOut();
                    }
                });
            }
        });
    });

    function TableActions() {
        $('#DivTblAlumnos').on('click', '.js-swal-confirm', function () {
            var buttonVal = $(this).val().split('_');
            var calif = $('#Calificaciones_' + buttonVal[1]).text();
            var idCarrera = $("#Carrera_" + buttonVal[1]).attr("id-carrera");
            tblAlumnos.$("[data-toggle='tooltip']").tooltip("hide");
            if (calif.includes('Alumno Calificado')) {
                swal({
                    type: 'warning',
                    title: '¿Estás seguro?',
                    text: '¡Este alumno ya cuenta con calificaciones asignadas, éstas serán eliminadas de igual forma y los datos no podrán retornar! ¿Desea continuar?',
                    confirmButtonText: 'Sí, ¡Elimínalo!',
                    showCancelButton: true,
                    cancelButtonText: 'Cancelar',
                    cancelButtonColor: '#d33',
                    showLoaderOnConfirm: true,
                    animation: true,
                    allowOutsideClick: false,
                    allowEscapeKey: false
                }).then(function () {
                    $.ajax({
                        url: '../Transporte/queryCAlumnos.jsp',
                        data: '&txtBandera=2&idAlumno=' + buttonVal[1],
                        type: 'POST',
                        success: function (resp) {
                            if (resp.includes('success')) {
                                swal('¡Registro eliminado!', 'El alumno(a) seleccionado ha sido eliminado', 'success');
                                $(".tooltip").hide();
                                LoadTableEspecifico(idCarrera);
                            } else if (resp.includes('TituloActivo')) {
                                swal('¡Upps!', 'El alumno(a) seleccionado cuenta con titulos sin generar, no es posible eliminarlo', 'warning');
                            } else if (resp.includes('CertificadoActivo')) {
                                swal('¡Upps!', 'El alumno(a) seleccionado cuenta con certificados sin generar, no es posible eliminarlo', 'warning');
                            } else {
                                show_swal("¡Upps!", resp.split('|')[1], "error");
                            }
                        }, complete: function (jqXHR, textStatus) {
                            tblAlumnos.$("[data-toggle='tooltip']").tooltip("hide");
                        }
                    });
                }, function () {
                    tblAlumnos.$("[data-toggle='tooltip']").tooltip("hide");
                });
            } else {
                swal({
                    type: 'warning',
                    title: '¿Estás seguro?',
                    text: 'Al confirmar, los datos no podrán retornar fácilmente',
                    confirmButtonText: 'Sí, ¡Elimínalo!',
                    showCancelButton: true,
                    cancelButtonText: 'Cancelar',
                    cancelButtonColor: '#d33',
                    showLoaderOnConfirm: true,
                    animation: true,
                    allowOutsideClick: false,
                    allowEscapeKey: false
                }).then(function () {
                    $.ajax({
                        url: '../Transporte/queryCAlumnos.jsp',
                        data: '&txtBandera=2&idAlumno=' + buttonVal[1],
                        type: 'POST',
                        success: function (resp) {
                            if (resp.includes('success')) {
                                swal('¡Registro eliminado!', 'El alumno(a) seleccionado ha sido eliminado', 'success');
                                $(".tooltip").hide();
                                LoadTableEspecifico(idCarrera);
                            } else if (resp.includes('TituloActivo')) {
                                swal('¡Upps!', 'El alumno(a) seleccionado cuenta con titulos sin generar, no es posible eliminarlo', 'warning');
                            } else if (resp.includes('CertificadoActivo')) {
                                swal('¡Upps!', 'El alumno(a) seleccionado cuenta con certificados sin generar, no es posible eliminarlo', 'warning');
                            } else {
                                show_swal("¡Upps!", resp.split('|')[1], "error");
                            }
                        }, complete: function (jqXHR, textStatus) {
                            tblAlumnos.$("[data-toggle='tooltip']").tooltip("hide");
                        }
                    });
                }, function () {
                    tblAlumnos.$("[data-toggle='tooltip']").tooltip("hide");
                });
            }
        });
    }

    function resize() {
        window.onresize = function () {
            ajustarComponentesModal();
        };

        window.onload = function () {
            ajustarComponentesModal();
        };

        function ajustarComponentesModal() {
            if (window.innerWidth <= 371) {
                $("#btnImportarCarrerasExcel").css("margin-top", "15px");
            } else {
                $("#btnImportarCarrerasExcel").css("margin-top", "");
            }
        }
    }

    primerPaso();
    function primerPaso() {
        let txtModulo = $("#txtModulo").val();
        $.ajax({
            url: '../Transporte/queryCPermisos.jsp',
            data: 'txtModulo=' + txtModulo,
            type: 'POST',
            success: function (data, textStatus, jqXHR) {
                var resp = data.split("~");
                let mensajeVigencia = resp[1];
                if (mensajeVigencia !== "") {
                    eval(mensajeVigencia);
                }
                if (resp[0].includes("todos")) {
                    cargarListaCarreras();
                } else if (resp[0].includes("acceso")) {
                    let stringStepFirst = resp[0].split("°")[1];
                    if (stringStepFirst.split("¬")[0].includes("1")) {
                        cargarListaCarreras();
                        //IMPORTAR REGISTROS
                        if (stringStepFirst.split("¬")[5].includes("0")) {
                            $("#btnImportarCarrerasExcel").remove();
                        }
                        //IMPORTAR WEB SERVICE
                        if (stringStepFirst.split("¬")[6].includes("0")) {
                            $("#btn-cargar-servicio").remove();
                        }
                    } else {
                        $(".noPermisson").show();
                        $("#fullContent").html("");
                        $('#mainLoader').fadeOut();
                    }
                } else if (resp[0].includes("error")) {
                    $(".noPermisson").show();
                    $("#fullContent").html("");
                    $('#mainLoader').fadeOut();
                }
            }
        });
    }

    function LoadTableEspecifico(e) {
        $.ajax({
            url: '../Transporte/queryCAlumnos.jsp',
            data: 'txtBandera=1&idCarrera=' + e,
            type: 'POST',
            success: function (resp) {
                var indicador = resp.split("|")[0];
                if (indicador.toString().trim() === "success") {
                    $('#DivTblAlumnos').html(resp.split("|")[1]);
                    $('[data-toggle="tooltip"]').tooltip();
                    TableActions();
                    initTable();
                    setTimeout(function () {
                        $('#mainLoader').fadeOut();
                    });
                } else {
                    show_swal("¡Upps!", resp.split('|')[1], "error");
                }
            }, complete: function (jqXHR, textStatus) {
                $("#loadAction").fadeOut();
            }
        });
    }

    function cargarListaCarreras() {
        $("#loadAction").fadeIn();
        $.ajax({
            url: '../Transporte/queryCCarreras.jsp',
            data: 'txtBandera=3',
            type: 'POST',
            success: function (resp) {
                let serverMsg = resp.split("¬")[0];
                if (serverMsg.toString().trim() === 'success') {
                    let lista = resp.split("¬")[1];
                    $("#lstCarreras").find("option").remove().end().append(lista).trigger("chosen:updated");
                    $("#btnFiltrarAlumnos").attr("disabled", false);
                } else if (serverMsg.toString().trim() === 'empty') {
                    let lista = resp.split("¬")[1];
                    $("#lstCarreras").find("option").remove().end().append(lista).trigger("chosen:updated");
                    $("#btnFiltrarAlumnos").attr("disabled", true);
                } else {
                    show_swal("¡Upps!", resp.split('|')[1], "error");
                }
            }, complete: function (jqXHR, textStatus) {
                $('#mainLoader').fadeOut();
                $("#loadAction").fadeOut();
            }
        });
    }

    $("#btnFiltrarAlumnos").on("click", function () {
        let idMateria = $("#lstCarreras").val();
        if (idMateria.toString().trim() === 'todos') {
            swal({
                type: 'warning',
                title: '¿Estás seguro?',
                text: 'El proceso de carga va demorar en relación a la cantidad de alumnos registrados en el sistema',
                confirmButtonText: 'Sí, ¡Consultar!',
                showCancelButton: true,
                cancelButtonText: 'Cancelar',
                cancelButtonColor: '#d33',
                showLoaderOnConfirm: true,
                animation: true,
                allowOutsideClick: false,
                allowEscapeKey: false
            }).then(function () {
                $("#loadAction").fadeIn();
                LoadTableEspecifico(idMateria);
            }, function () {

            });
        } else {
            $("#loadAction").fadeIn();
            LoadTableEspecifico(idMateria);
        }
    });

    /**
     * Función global para manejo de errores con ajax
     */
    $.ajaxSetup({
        beforeSend: function (jqXHR, settings) {
            jqXHR.url = settings.url;
            jqXHR.url = jqXHR.url.substring(jqXHR.url.lastIndexOf('/') + 1);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            var msjError = '';
            if (jqXHR.status === 0) {
                //Not connect: Verify Network
                msjError += 'Sin conexión, verifica la red.';

            } else if (jqXHR.status == 404) {
                //Requested page not found [404]
                msjError += '[404] Elemento <b>"' + jqXHR.url + '"</b> no encontrado';

            } else if (jqXHR.status == 500) {
                msjError += '[500] Error interno del servidor';

            } else if (textStatus === 'parsererror') {

                msjError += 'Requested JSON parse failed.';

            } else if (textStatus === 'timeout') {
                msjError += 'Time out error.';

            } else if (textStatus === 'abort') {
                msjError += 'Ajax request aborted.';

            } else {
                msjError: '(' + jqXHR + ' <b>|</b> ' + textStatus + ' <b>|</b> ' + errorThrown + ')';
            }

            msjError += "<br><small>vuelve a cargar la página con F5, si continua con el problema, comuníquese con soporte técnico.</small>";
            show_swal('Error interno POST', msjError, 'error');
        }
    });

    function show_swal(titulo, mensaje, tipo) {
        swal({
            allowOutsideClick: false,
            allowEscapeKey: false,
            title: titulo,
            html: mensaje,
            type: tipo
        });
    }
});
