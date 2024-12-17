/**
 * @author: Braulio Sorcia
 * @description Js para las validaciones del lado del cliente de titulos
 * @since 08 DE ENERO DE 2019
 * =====================================================
 * @author_change:
 * @description_change:
 * @date_change: 
 */

$(document).ready(function () {
    var tblTitulos;
    function initTable() {
        tblTitulos = $('.js-dataTable-full-pagination-Fixed').dataTable({
            ordering: true,
            orderable: false,
            paging: true,
            searching: true,
            info: true,
            pagingType: "full_numbers",
            columnDefs: [{orderable: false, targets: [8, 9]}, {width: 5, targets: 9}],
            pageLength: 20,
            lengthMenu: [[5, 10, 15, 20, 50], [5, 10, 15, 20, 50]]
        });
        tblTitulos.$('[data-toggle="tooltip"]').tooltip({
            container: 'body',
            animation: false,
            trigger: 'hover'
        });
        if (window.innerWidth <= 545 && window.innerWidth >= 335) {
            $(".js-dataTable-full-pagination-Fixed").find("th:nth-child(10),td:nth-child(10)").show();
        } else if (window.innerWidth <= 334) {
            $(".js-dataTable-full-pagination-Fixed").find("th:nth-child(10),td:nth-child(10)").hide();
        } else {
            $(".js-dataTable-full-pagination-Fixed").find("th:nth-child(10),td:nth-child(10)").show();
        }
    }
//    $(".notAllowed").keyup(function () {
//        let element = $(this);
//        element.val(element.val().replace(/[&"'<>;]/g, ""));
//    });
//    $(".notAllowed").on("paste", function () {
//        let element = $(this);
//        element.val(element.val().replace(/[&"'<>;]/g, ""));
//    });
    var xml = 0;
    $('#lstLugarExpedicion').chosen({width: "100%", disable_search_threshold: 4});
    $('#lstCarreraTitulo').chosen({width: "100%", disable_search_threshold: 4});
    $('#lstModalidadTitulacion').chosen({width: "100%", disable_search_threshold: 4});
    $('#lstFundamentoLegal').chosen({width: "100%", disable_search_threshold: 4});
    $('#lstCumplioServicio').chosen({width: "100%", disable_search_threshold: 4});
    $('#lstEstudioAntecedente').chosen({width: "100%", disable_search_threshold: 4});
    $('#lstEntidadAntecedente').chosen({width: "100%", disable_search_threshold: 4});
    $('#lstMotivosCan').chosen({width: "100%", disable_search_threshold: 4});
    $("#lstCarreras").chosen({width: "100%", disable_search_threshold: 4});
    $("#lstCarreras_chosen").css("display", "grid");

    function cargaInicio() {
        $.ajax({
            url: '../Transporte/queryCTitulos.jsp',
            data: '&txtBandera=1',
            type: 'POST',
            success: function (resp) {
                var arregloRespuesta = resp.split("~");

                var lstCarreras = arregloRespuesta[0];
                var lstEstados = arregloRespuesta[1];
                var lstFirmantes = arregloRespuesta[2];
                var lstFundamentoLegal = arregloRespuesta[3];
                var lstModalidadTitulacion = arregloRespuesta[4];
                var lstEstudioAntecedente = arregloRespuesta[5];
                var nombreInstitucion = arregloRespuesta[6];
                var notificacionEFirma = arregloRespuesta[7];
                var lstMotCan = arregloRespuesta[8];
                if (lstCarreras.split("|")[0].toString().trim().includes("error")) {
                    show_swal("¡Upps!", lstCarreras.split('|')[1], "error");
                }
                if (lstEstados.split("|")[0].toString().trim().includes("error")) {
                    show_swal("¡Upps!", lstEstados.split('|')[1], "error");
                }
                if (lstFirmantes.split("|")[0].toString().trim().includes("error")) {
                    show_swal("¡Upps!", lstFirmantes.split('|')[1], "error");
                }
                if (lstFundamentoLegal.split("|")[0].toString().trim().includes("error")) {
                    show_swal("¡Upps!", lstFundamentoLegal.split('|')[1], "error");
                }
                if (lstModalidadTitulacion.split("|")[0].toString().trim().includes("error")) {
                    show_swal("¡Upps!", lstModalidadTitulacion.split('|')[1], "error");
                }
                if (lstEstudioAntecedente.split("|")[0].toString().trim().includes("error")) {
                    show_swal("¡Upps!", lstEstudioAntecedente.split('|')[1], "error");
                }
                if (nombreInstitucion.split("|")[0].toString().trim().includes("error")) {
                    show_swal("¡Upps!", nombreInstitucion.split('|')[1], "error");
                }
                if (notificacionEFirma.split("|")[0].toString().trim().includes("error")) {
                    show_swal("¡Upps!", notificacionEFirma.split('|')[1], "error");
                }
                if (lstMotCan.split("|")[0].toString().trim().includes("error")) {
                    show_swal("¡Upps!", lstMotCan.split('|')[1], "error");
                }
                var data = "";
                $('#lstCarreras').html(lstCarreras.split("|")[1]);
                $("#lstCarreras").val("todos").trigger("chosen:updated");
                initTable();
                //TableActions();
                data = $('#lstLugarExpedicion').val();
                $('#lstLugarExpedicion').html(lstEstados.split('|')[1]).val(data).trigger('chosen:updated');
                $('#lstFirmantesTitulos').find('option').remove().end().append(lstFirmantes.split('|')[1]);
                App.initHelpers(['select2']);
                $('#lstFirmantesTitulos').trigger('change');
                data = $('#lstFundamentoLegal').val();
                $('#lstFundamentoLegal').find('option').remove().end().append(lstFundamentoLegal.split('|')[1]).val(data).trigger('chosen:updated');
                data = $('#lstModalidadTitulacion').val();
                $('#lstModalidadTitulacion').find('option').remove().end().append(lstModalidadTitulacion.split('|')[1]).val(data).trigger('chosen:updated');
                data = $('#lstEstudioAntecedente').val();
                $('#lstEstudioAntecedente').find('option').remove().end().append(lstEstudioAntecedente.split('|')[1]).val(data).trigger('chosen:updated');
                data = $('#lstEntidadAntecedente').val();
                $('#lstEntidadAntecedente').find('option').remove().end().append(lstEstados.split('|')[1]).val(data).trigger('chosen:updated');
                data = $('#txtInstitucionProcedencia').val();
                $('#txtInstitucionProcedencia').val(data).trigger('change');
                //$('#txtInstitucionProcedencia').prop('disabled', true);
                //$('#txtFechaExpedicion').val(fecha()).trigger('change');
                var notifys = notificacionEFirma;
                if (notifys !== "") {
                    eval(notifys);
                } else if (notifys.includes("errorNotify")) {
                    swal('¡Upps!', 'Ocurrió un error al generar las notificaciones de firmantes, consulte a soporte técnico.', 'error');
                }
                data = $('#lstMotivosCan').val();
                $("#lstMotivosCan").find('option').remove().end().append(lstMotCan).val(data).trigger('chosen:updated');
                setTimeout(function () {
                    $('#mainLoader').fadeOut();
                });

            }, complete: function (jqXHR, textStatus) {
                $('#loadAction').fadeOut();
            }
        });
    }

    $('#btnNuevoTitulo').click(function () {
        CleanInputs();
        $('#ButtonCerrarTitulo').hide();
        $('#ButtonUpdateTitulo').hide();
        $('#ButtonAddTitulo').show();
        $('#ButtonGenerateXML').show();
        $('#ButtonGenerateXML').prop('disabled', true);
        $('#ButtonAddTitulo').prop('disabled', false);
        $('#modaltitle').text('NUEVO TITULO');
        $('#DivLstEstatusTituloIn').hide();
        $('#tagsPerfil').html('<span class="tag"><span> - Seleccione los firmantes responsables - &nbsp;</span></span>');
        $('#txtEdition').val('0');
        $("#divTxtACadenaOriginal").hide();
        BlockInputs(false);
        $('#txtInstitucionProcedencia').prop('disabled', false);
    });

    $('#tagsPerfil').on('click', function () {
        openModalFirmante();
    });

    $('#tagsPerfil').on('focus', function () {
        openModalFirmante();
    });

    function openModalFirmante() {
        $('#modal-listFirmantes').modal('show');
    }

    $('#btnAgregarFirmantes').click(function () {
        var idsFirmantes = $('#lstFirmantesTitulos').val();
        $('#txtIdsFirmantes').val(idsFirmantes);
        var tmp = $('#txtIdsFirmantes').val().split(",");
        var aux = [];
        tmp.map(function (e, i, array) {
            if (!aux.includes(e)) {
                aux.push(e);
            }
        });
        $('#txtIdsFirmantes').val(aux);
        $('#modal-listFirmantes').modal('hide');
        var str = '';
        var data = $('#lstFirmantesTitulos').select2('data');
        for (var i = 0; i < data.length; i++) {
            if (data[i].text == 'Todos') {
                str = '<span class="tag">' +
                        '<span>' + data[i].text + '&nbsp;</span>' +
                        '</span>';
                break;
            } else {
                str += '<span class="tag">' +
                        '<span>' + data[i].text + '&nbsp;</span>' +
                        '</span>';
            }
        }
        $("#tagsPerfil").html(str);
        $('#txtIdsFirmantes-error').remove();
        $('#DivLstFirmantesTitulos').removeClass('has-error');
        setTimeout(function () {
            $('body').addClass('modal-open');
        }, 400);
    });


    $('#btnBuscarAlumno').click(function () {
        var matricula = $('#txtMatricula').val();
        $('#loadAction').fadeIn();
        $.ajax({
            url: '../Transporte/queryCTitulos.jsp',
            data: '&txtBandera=2&matricula=' + matricula,
            type: 'POST',
            success: function (resp) {
                if (!resp.includes('error')) {
                    if (resp.includes('sinCoincidencias')) {
                        swal('¡Upps!', 'No se encontraron alumnos relacionados a la matrícula ingresada', 'warning');
                    } else if (resp.includes('tieneTitulo')) {
                        swal('¡Upps!', 'Este alumno ya cuenta con titulos registrados', 'info');
                    } else {
                        var split = resp.split('||');

                        $('#lstCarreraTitulo').find('option').remove().end().append(split[1]).trigger('chosen:updated');
                        $('#txtNombreAlumno').val(split[2]).trigger('change');
                        $("#txtNombreAlumno").prop('disabled', true);

                        $('#txtFechaInicioAntecedente').datepicker().datepicker('setDate', split[3]);
                        $('#txtFechaFinAntecedente').datepicker().datepicker('setDate', split[4]);

//https://alvarotrigo.com/blog/javascript-select-option/
//Se busca la opción del select, conforme al texto de los option.

                        var text = split[5];
                        var $select = document.querySelector('#lstEstudioAntecedente');
                        var $options = Array.from($select.options);
                        var optionToSelect = $options.find(item => item.text === text);
                        optionToSelect.selected = true;

                        var text2 = split[6].trim();
                        var $select2 = document.querySelector('#lstEntidadAntecedente');
                        var $options2 = Array.from($select2.options);
                        var optionToSelect2 = $options2.find(item => item.text === text2);
                        optionToSelect2.selected = true;

                        $('#lstEstudioAntecedente').trigger("chosen:updated");
                        $('#lstEntidadAntecedente').trigger("chosen:updated");

                        if (split[0].trim() == '1') {
                            $('#lstCarreraTitulo').change();
                        } else if (split[0].trim() == '2') {
                            swal('¡Wow!', 'Se encontró más de un registro relacionado a la matrícula ingresada, selecciona la carrera que estás buscando', 'info');
                        }
                    }
                } else {
                    show_swal("¡Upps!", resp.split('|')[1], "error");
                }
            }, complete: function () {
                $('#loadAction').fadeOut();
            }
        });
    });

    $('#lstCarreraTitulo').change(function () {
        var fechaInicio = $('#lstCarreraTitulo option:selected').data('inicio');
        var fechaFin = $('#lstCarreraTitulo option:selected').data('fin');

        $('#txtFechaInicio').datepicker().datepicker('setDate', fechaInicio);
        $('#txtFechaFin').datepicker().datepicker('setDate', fechaFin);

    });

    $('.BtnAccionesTitulos').click(function () {
        $("form[name='FormTitulosElectronicos']").submit(function (e) {
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
                elem.closest('.col-lg-6').removeClass('has-error').addClass('has-error');
                elem.closest('.col-lg-3').removeClass('has-error').addClass('has-error');
                elem.closest('.col-lg-9').removeClass('has-error').addClass('has-error');
                elem.closest('.col-xs-12').removeClass('has-error').addClass('has-error');
                elem.closest('.help-block').remove();
            },
            success: function (e) {
                var elem = jQuery(e);
                elem.closest('.col-lg-6').removeClass('has-error');
                elem.closest('.col-lg-3').removeClass('has-error');
                elem.closest('.col-lg-9').removeClass('has-error');
                elem.closest('.col-xs-12').removeClass('has-error');
                elem.closest('.help-block').remove();
            },
            rules: {
                txtMatricula: {
                    required: true
                },
                lstCarreraTitulo: {
                    required: true
                },
                txtNombreAlumno: {
                    required: true
                },
                lstModalidadTitulacion: {
                    required: true
                },
                lstFundamentoLegal: {
                    required: true
                },
                lstLugarExpedicion: {
                    required: true
                },
                txtFechaInicio: {
                    required: false
                },
                txtFechaFin: {
                    required: true
                },
                txtFechaExpedicion: {
                    required: true
                },
                lstCumplioServicio: {
                    required: true
                },
                txtFechaExamenProfesional: {
                    //Depende de la modalidad de titulacion
                    required: false
                },
                txtFechaExencionExamenProfesional: {
                    //Depende de la modalidad de titulación
                    required: false
                },
                txtInstitucionProcedencia: {
                    required: true
                },
                lstEstudioAntecedente: {
                    required: true
                },
                lstEntidadAntecedente: {
                    required: true
                },
                txtFechaInicioAntecedente: {
                    required: false
                },
                txtFechaFinAntecedente: {
                    required: true
                },
                txtIdsFirmantes: {
                    required: true
                },
                txtNoCedula: {
                    required: false,
                    maxlength: 8,
                    minlength: 7
                }
            },
            messages: {
                txtMatricula: {
                    required: '¡Por favor completa este campo!'
                },
                lstCarreraTitulo: {
                    required: '¡Por favor selecciona una opción!'
                },
                txtNombreAlumno: {
                    required: '¡Por favor completa este campo!'
                },
                lstModalidadTitulacion: {
                    required: '¡Por favor selecciona una opción!'
                },
                lstFundamentoLegal: {
                    required: '¡Por favor selecciona una opción!'
                },
                lstLugarExpedicion: {
                    required: '¡Por favor selecciona una opción!'
                },
                txtFechaInicio: {
                    required: '¡Por favor selecciona una fecha!'
                },
                txtFechaFin: {
                    required: '¡Por favor selecciona una fecha!'
                },
                txtFechaExpedicion: {
                    required: '¡Por favor selecciona una fecha!'
                },
                lstCumplioServicio: {
                    required: '¡Por favor selecciona una opción!'
                },
                txtFechaExamenProfesional: {
                    required: '¡Por favor selecciona una fecha!'
                },
                txtFechaExencionExamenProfesional: {
                    required: '¡Por favor selecciona una fecha!'
                },
                txtInstitucionProcedencia: {
                    required: '¡Por favor completa este campo!'
                },
                lstEstudioAntecedente: {
                    required: '¡Por favor selecciona una opción!'
                },
                lstEntidadAntecedente: {
                    required: '¡Por favor selecciona una opción!'
                },
                txtFechaInicioAntecedente: {
                    required: '¡Por favor selecciona una fecha!'
                },
                txtFechaFinAntecedente: {
                    required: '¡Por favor selecciona una fecha!'
                },
                txtIdsFirmantes: {
                    required: '¡Por favor selecciona al menos una opción!'
                },
                txtNoCedula: {
                    required: '¡Por favor completa este campo!',
                    minlength: '¡Por favor ingersa al menos 7 caractéres!'
                }
            },
            submitHandler: function (form) {
                $("#loadAction").fadeIn();
                var idAlumno = $('#lstCarreraTitulo option:selected').data('idalumno');
                var idCarreraTitulo = $('#lstCarreraTitulo').val();
                var idCarreraEscolar = $('#lstCarreraTitulo option:selected').data('idcarrera');
                var idModalidad = $('#lstModalidadTitulacion').val();
                var idFundamento = $('#lstFundamentoLegal').val();
                var idLugarExpedicion = $('#lstLugarExpedicion').val();
                var fechaInicio = $('#txtFechaInicio').val();
                var fechaFin = $('#txtFechaFin').val();
                var fechaExpedicion = $('#txtFechaExpedicion').val();
                var cumplioServicio = $('#lstCumplioServicio').val();
                var fechaExamenProfesional = $('#txtFechaExamenProfesional').val();
                var fechaExcencionExamenProfesional = $('#txtFechaExencionExamenProfesional').val();
                var institutoProcedencia = $('#txtInstitucionProcedencia').val();
                var idTipoEstudioAntecedente = $('#lstEstudioAntecedente').val();
                var idEntidadEstudioAntecedente = $('#lstEntidadAntecedente').val();
                var fechaInicioAntecedente = $('#txtFechaInicioAntecedente').val();
                var fechaFinAntecedente = $('#txtFechaFinAntecedente').val();
                var idsFirmantes = $('#txtIdsFirmantes').val();
                var noCedula = $('#txtNoCedula').val();
                var bandera = $('#txtBandera').val();
                var idTitulo = $('#idTitulo').val();

                $.ajax({
                    url: '../Transporte/queryCTitulos.jsp',
                    data: {
                        txtBandera: bandera,
                        idAlumno: idAlumno,
                        idCarreraTitulo: idCarreraTitulo,
                        idCarreraEscolar: idCarreraEscolar,
                        idModalidad: idModalidad,
                        idFundamento: idFundamento,
                        idLugarExpedicion: idLugarExpedicion,
                        fechaInicio: fechaInicio,
                        fechaFin: fechaFin,
                        fechaExpedicion: fechaExpedicion,
                        servicioSocial: cumplioServicio,
                        fechaExamenProfesional: fechaExamenProfesional,
                        fechaExencionExamenProfesional: fechaExcencionExamenProfesional,
                        institucionProcedencia: institutoProcedencia,
                        idTipoEstudioAntecedente: idTipoEstudioAntecedente,
                        idEntidadEstudioAntecedente: idEntidadEstudioAntecedente,
                        fechaInicioAntecedente: fechaInicioAntecedente,
                        fechaFinAntecedente: fechaFinAntecedente,
                        idsFirmantes: idsFirmantes,
                        noCedula: noCedula,
                        idTitulo: idTitulo,
                    },
                    type: 'POST',
                    success: function (resp) {
                        if (bandera == 3) {// Insercion

                            if (resp.includes('success')) {
                                $("#lstCarreras").val(idCarreraEscolar).trigger("chosen:updated");
                                cargarTabla(idCarreraEscolar);
                                swal('¡Registro guardado!', 'El registro ha sido guardado, ya puedes generar el archivo XML', 'success');
                                var split = resp.split(',');
                                $('#ButtonGenerateXML').val(split[1]);
                                $('#txtFolioControl').val(split[2]).trigger('change');
                                $('#ButtonGenerateXML').data('grados', split[3]);
                                $('#ButtonGenerateXML').prop('disabled', false);
                                $('#ButtonAddTitulo').prop('disabled', true);

                                setTimeout(function () {
                                    $('#lstModalidadTitulacion').val(idModalidad).trigger('chosen:updated');
                                    $('#lstFundamentoLegal').val(idFundamento).trigger('chosen:updated');
                                    $('#lstLugarExpedicion').val(idLugarExpedicion).trigger('chosen:updated');
                                    $('#lstEntidadAntecedente').val(idEntidadEstudioAntecedente).trigger('chosen:updated');
                                    $('#lstEstudioAntecedente').val(idTipoEstudioAntecedente).trigger('chosen:updated');
                                }, 500);
                            } else if (resp.includes('tituloActivo')) {
                                swal('¡Upps!', 'La información ingresada coincide con un registro existente, puedes editar su información o eliminarlo y generar un nuevo registro', 'warning');
                            } else if (resp.includes('errorFirmantes')) {
                                swal('¡Upps!', 'Ha ocurrido un error al asignar los firmantes a este titulo, intente de nuevo', 'error');
                            } else if (resp.includes('sinConfiguracion')) {
                                swal('¡Upps!', 'Parece que no has establecido las configuraciones iniciales, para continuar, primero completa la información inicial', 'warning');
                            } else {
                                show_swal("¡Upps!", resp.split('|')[1], "error");
                            }
                        } else if (bandera == 4) {// Modificacion

                            if (xml == 1) {
                                var grados = $('#ButtonGenerateXML').data('grados');
                                if (resp.includes('success')) {
                                    if (grados == '0' || grados == 0) {

                                        var interval = setInterval(function () {
                                            $('.configurarGrados').click(function () {
                                                swal('¡Configurar grados!', 'Diríjase al modal de Claves carrera para establecer los valores en la carrera', 'info');
                                            });
                                        }, 500);
                                        $('#loadAction').fadeOut();
                                        swal({
                                            type: 'warning',
                                            title: '¡Upps!',
                                            text: 'Los grados de la carrera no se han agregado, ¿deseas generar el XML o regresar a configurar los grados?',
                                            showCancelButton: true,
                                            confirmButtonText: 'Generar XML',
                                            confirmButtonColor: '#dd3333db',
                                            cancelButtonText: 'Configurar los grados',
                                            cancelButtonColor: '#1b92a7d1',
                                            cancelButtonClass: 'configurarGrados'
                                        }).then((result) => {

                                            if (result) {
                                                // Generar XML
                                                $('#loadAction').fadeIn();
                                                generarXML(idTitulo, idCarreraTitulo);
                                            }
                                            clearInterval(interval);
                                        });
                                    } else {
                                        $('#loadAction').fadeIn();
                                        generarXML(idTitulo, idCarreraTitulo);
                                    }
                                } else {
                                    swal('¡Upps!', 'Ha ocurrido un error, la acción no fue realizada', 'error');
                                }
                                xml = 0;
                            } else {
                                if (resp.includes('success')) {
                                    $("#lstCarreras").val(idCarreraTitulo).trigger("chosen:updated");
                                    cargarTabla(idCarreraTitulo);
                                    swal('¡Registro guardado!', 'El registro ha sido guardado, ya puedes generar el archivo XML', 'success');
                                    $('#ButtonGenerateXML').prop('disabled', false);
                                    $('#ButtonGenerateXML').data('grados', grados);
                                    setTimeout(function () {
                                        $('#lstModalidadTitulacion').val(idModalidad).trigger('chosen:updated');
                                        $('#lstFundamentoLegal').val(idFundamento).trigger('chosen:updated');
                                        $('#lstLugarExpedicion').val(idLugarExpedicion).trigger('chosen:updated');
                                        $('#lstEntidadAntecedente').val(idEntidadEstudioAntecedente).trigger('chosen:updated');
                                        $('#lstEstudioAntecedente').val(idTipoEstudioAntecedente).trigger('chosen:updated');
                                    }, 500);
                                } else {
                                    show_swal("¡Upps!", resp.split('|')[1], "error");
                                    $('#loadAction').fadeOut();
                                }
                            }
                        }
                    }, complete: function () {
                        //el problema
                        //$('#loadAction').fadeOut();
                        $("#btnGeneXmlMasivo").attr("disabled", true);
                    }
                });
            }
        });
    });
    var $row;
    var $data;
    var $table;
    function TableActions() {

        $('#tblTitulos').on('click', '.btnConsultarTitulo', function () {
            var buttonVal = $(this).val().split('_');
            $('#loadAction').fadeIn();
            CleanInputs();
            $('#txtEdition').val('0');
            $('#ButtonUpdateTitulo').hide();
            $('#ButtonAddTitulo').hide();
            $('#ButtonGenerateXML').hide();
            $('#ButtonCerrarTitulo').show();
            $('#DivLstEstatusTituloIn').show();
            $('#modaltitle').text('CONSULTAR TÍTULO');
            $.ajax({
                url: '../Transporte/queryCTitulos.jsp',
                data: '&txtBandera=6&idTitulo=' + buttonVal[1],
                type: 'POST',
                success: function (resp) {
                    if (resp.includes('error')) {
                        show_swal("¡Upps!", resp.split('|')[1], "error");
                    } else {
                        var split = resp.split('~');

                        eval(split[1]);
                        $('#tagsPerfil').html(split[2]);
                        $('#idTitulo').val(split[3]);
                        $('#txtMatricula').val(split[4]).trigger('change');
                        $('#lstCarreraTitulo').html(split[5]).trigger('chosen:updated');
                        $('#txtNombreAlumno').val(split[6]).trigger('change');
                        $('#txtFolioControl').val(split[7]).trigger('change');
                        $('#lstModalidadTitulacion').val(split[8]).trigger('chosen:updated');
                        $('#lstFundamentoLegal').val(split[9]).trigger('chosen:updated');
                        $('#lstLugarExpedicion').val(split[10]).trigger('chosen:updated');
                        $('#txtFechaInicio').datepicker().datepicker('setDate', split[11]);
                        $('#txtFechaFin').datepicker().datepicker('setDate', split[12]);
                        $('#txtFechaExpedicion').prop('disabled', false);
                        $('#txtFechaExpedicion').datepicker().datepicker('setDate', split[13]);
                        $('#txtFechaExpedicion').prop('disabled', true);
                        $('#lstCumplioServicio').val(split[14]).trigger('chosen:updated');
                        $('#txtFechaExamenProfesional').datepicker().datepicker('setDate', split[15]);
                        $('#txtFechaExencionExamenProfesional').datepicker().datepicker('setDate', split[16]);
                        $('#txtInstitucionProcedencia').val(split[17]).trigger('change');
                        $('#txtInstitucionProcedencia').prop('disabled', true);
                        $('#lstEstudioAntecedente').val(split[18]).trigger('chosen:updated');
                        $('#lstEntidadAntecedente').val(split[19]).trigger('chosen:updated');
                        $('#txtFechaInicioAntecedente').datepicker().datepicker('setDate', split[20]);
                        $('#txtFechaFinAntecedente').datepicker().datepicker('setDate', split[21]);
                        $('#txtNoCedula').val(split[22]).trigger('change');
                        $('#lstEstatusTitulo').val(split[23]).trigger('chosen:updated');
                        $('#txtIdsFirmantes').val(split[24]);
                        var cadenaOriginal = split[25].split("¬")[1];
                        if (cadenaOriginal != 0) {
                            cadenaOriginal = cadenaOriginal.replace(/°°/g, "\n\n");
                            $('#txtACadenaOriginal').val(cadenaOriginal);
                            $("#divTxtACadenaOriginal").show();
                        } else {
                            $("#divTxtACadenaOriginal").hide();
                        }

                        $('#ButtonGenerateXML').val(split[3]);
                        BlockInputs(true);
                        if (split[22] == "0") {
                            $('#ButtonGenerateXML').prop('disabled', false);
                        }
                        $('#modal-titulosElectronicos').modal('show');
                    }
                }, complete: function () {
                    $('#loadAction').fadeOut();
                }
            });
        });

        $('#tblTitulos').on('click', '.btnEditarTitulo', function () {
            var buttonVal = $(this).val().split('_');
            CleanInputs();
            $('#loadAction').fadeIn();
            $('#txtEdition').val('1');
            $('#ButtonUpdateTitulo').show();
            $('#ButtonAddTitulo').hide();
            $('#ButtonGenerateXML').show();
            $('#ButtonCerrarTitulo').hide();
            $('#DivLstEstatusTituloIn').show();
            $('#modaltitle').text('EDITAR TÍTULO');
            $.ajax({
                url: '../Transporte/queryCTitulos.jsp',
                data: '&txtBandera=6&idTitulo=' + buttonVal[1],
                type: 'POST',
                success: function (resp) {
                    if (resp.includes('error')) {
                        show_swal("¡Upps!", resp.split('|')[1], "error");
                    } else {
                        var split = resp.split('~');

                        eval(split[1]);
                        $('#tagsPerfil').html(split[2]);
                        $('#idTitulo').val(split[3]);
                        $('#txtMatricula').val(split[4]).trigger('change');
                        $('#lstCarreraTitulo').html(split[5]).trigger('chosen:updated');
                        $('#txtNombreAlumno').val(split[6]).trigger('change');
                        $('#txtFolioControl').val(split[7]).trigger('change');
                        $('#lstModalidadTitulacion').val(split[8]).trigger('chosen:updated');
                        $('#lstFundamentoLegal').val(split[9]).trigger('chosen:updated');
                        $('#lstLugarExpedicion').val(split[10]).trigger('chosen:updated');
                        $('#txtFechaInicio').datepicker().datepicker('setDate', split[11]);
                        $('#txtFechaFin').datepicker().datepicker('setDate', split[12]);
                        $('#txtFechaExpedicion').prop('disabled', false);
                        $('#txtFechaExpedicion').datepicker().datepicker('setDate', split[13]);
                        $('#txtFechaExpedicion').prop('disabled', true);
                        $('#lstCumplioServicio').val(split[14]).trigger('chosen:updated');
                        $('#txtFechaExamenProfesional').datepicker().datepicker('setDate', split[15]);
                        $('#txtFechaExencionExamenProfesional').datepicker().datepicker('setDate', split[16]);
                        $('#txtInstitucionProcedencia').val(split[17]).trigger('change');
                        $('#txtInstitucionProcedencia').prop('disabled', false);
                        $('#lstEstudioAntecedente').val(split[18]).trigger('chosen:updated');
                        $('#lstEntidadAntecedente').val(split[19]).trigger('chosen:updated');
                        $('#txtFechaInicioAntecedente').datepicker().datepicker('setDate', split[20]);
                        $('#txtFechaFinAntecedente').datepicker().datepicker('setDate', split[21]);
                        $('#txtNoCedula').val(split[22]).trigger('change');
                        $('#lstEstatusTitulo').val(split[23]).trigger('chosen:updated');
                        $('#txtIdsFirmantes').val(split[24]);
                        $("#divTxtACadenaOriginal").hide();
                        $('#ButtonGenerateXML').data('grados', split[25].split("¬")[0]);

                        $('#ButtonGenerateXML').val(split[3]);
                        BlockInputs(false);
                        $("#txtNombreAlumno").prop('disabled', true);
                        $('#ButtonGenerateXML').prop('disabled', false);
                        $('#lstCarreraTitulo').prop('disabled', true);
                        $('#btnBuscarAlumno').prop('disabled', true);
                        $('#modal-titulosElectronicos').modal('show');
                    }
                }, complete: function () {
                    $('#loadAction').fadeOut();
                }
            });
        });

        $('#tblTitulos').on('click', '.js-swal-confirm', function () {
            $table = $(".js-dataTable-full-pagination-Fixed").DataTable();
            $row = $(this).parents("tr");
            $('#txtEdition').val('0');
            var buttonval = this.value.split('_');
            var matricula = $("#tblTitulos #Matricula_" + buttonval[1]).text();
            var folioControl = $("#tblTitulos #FolioControl_" + buttonval[1]).text();
            var idCarrera = $("#tblTitulos #Carrera_" + buttonval[1]).attr("id-carrera");
            swal({
                type: 'warning',
                title: '¿Estás seguro?',
                html: '<p>El título será eliminado de forma definitiva y no habrá forma de recuperar esa información.</p><br>Matrícula del profesionista: <b>' + matricula.trim() + '</b><br>Folio de control: <b>' + folioControl.trim() + '</p>',
                confirmButtonText: 'Sí, ¡Elimínalo!',
                showCancelButton: true,
                cancelButtonText: 'Cancelar',
                cancelButtonColor: '#d33',
                showLoaderOnConfirm: true,
                animation: true,
                allowOutsideClick: false,
                allowEscapeKey: false
            }).then(function () {
                $("#loadAction").fadeIn();
                $.ajax({
                    url: '../Transporte/queryCTitulos.jsp',
                    data: '&txtBandera=5&idTitulo=' + buttonval[1],
                    type: 'POST',
                    success: function (resp) {
                        if (resp.includes('success')) {
                            swal('¡Eliminado!', 'El registro ha sido eliminado.<p><small>La tabla de contenido se actualizará</small></p>', 'success');
                            //$("#lstCarreras").val(idCarrera).trigger("chosen:updated");
                            $table.row($row).remove().draw();
                        } else {
                            show_swal("¡Upps!", resp.split('|')[1], "error");
                        }
                    }, complete: function () {
                        $("#loadAction").fadeOut();
                    }
                });
            });
        });

        $("#tblTitulos").on("change", ".chtodos", function () {
            if ($(this).is(":checked")) {
                tblTitulos.$(".cbxSelectDescarga").prop("checked", true);
                if (tblTitulos.$(".cbxGenXml").length > 0)
                    $("#btnGeneXmlMasivo").prop("disabled", false);
                if (tblTitulos.$(".cbxDescXml").length > 0)
                    $("#btnDescargarXmlMasivo").prop("disabled", false);
                if (tblTitulos.$(".cbxDesPdf").length > 0)
                    $("#btnDescargarPDFMasivo").prop("disabled", false);
                if (tblTitulos.$(".cbxDescXmlM").length > 0)
                    $("#btnDescargarXMLMasivo").prop("disabled", false);
                if (tblTitulos.$(".servicio-sep").length > 0) {
                    $("#btn-up-pruebas").prop("disabled", false);
                    $("#btn-up-prod").prop("disabled", false);
                }
            } else {
                tblTitulos.$(".cbxSelectDescarga").prop("checked", false);
                $("#btnDescargarXmlMasivo").prop("disabled", true);
                $("#btnGeneXmlMasivo").prop("disabled", true);
                $("#btnDescargarPDFMasivo").prop("disabled", true);
                $("#btnDescargarXMLMasivo").prop("disabled", true);
                $("#btn-up-pruebas").prop("disabled", true);
                $("#btn-up-prod").prop("disabled", true);
            }
        });

        $("body").on("change", ".cbxDescXml", function () {
            var conteo_cadena_validacion = 0;
            tblTitulos.$(".cbxDescXml").each(function () {
                if ($(this).is(":checked")) {
                    ++conteo_cadena_validacion;
                }
            });
            if (conteo_cadena_validacion > 0) {
                $("#btnDescargarXmlMasivo").prop("disabled", false);
                $("#btnDescargarPDFMasivo").prop("disabled", false);
                $("#btnDescargarXMLMasivo").prop("disabled", false);
            } else {
                $("#btnDescargarXmlMasivo").prop("disabled", true);
                $("#btnDescargarPDFMasivo").prop("disabled", true);
                $("#btnDescargarXMLMasivo").prop("disabled", true);
            }
            if (conteo_cadena_validacion !== tblTitulos.$(".cbxSelectDescarga").length) {
                $(".chtodos").prop("checked", false);
            } else {
                $(".chtodos").prop("checked", true);
            }
        });

        $("body").on("change", ".servicio-sep", function () {
            var conteo_cadena_validacion = 0;
            tblTitulos.$(".servicio-sep").each(function () {
                if ($(this).is(":checked")) {
                    ++conteo_cadena_validacion;
                }
            });
            if (conteo_cadena_validacion > 0) {
                $("#btn-up-pruebas").prop("disabled", false);
                $("#btn-up-prod").prop("disabled", false);
            } else {
                $("#btn-up-pruebas").prop("disabled", true);
                $("#btn-up-prod").prop("disabled", true);
            }
            if (conteo_cadena_validacion !== tblTitulos.$(".cbxSelectDescarga").length) {
                $(".chtodos").prop("checked", false);
            } else {
                $(".chtodos").prop("checked", true);
            }
        });

        $("body").on("change", ".cbxGenXml", function () {
            var conteo_cadena_validacion = 0;
            tblTitulos.$(".cbxGenXml").each(function () {
                if ($(this).is(":checked")) {
                    ++conteo_cadena_validacion;
                }
            });
            if (conteo_cadena_validacion > 0) {
                $("#btnGeneXmlMasivo").prop("disabled", false);
            } else {
                $("#btnGeneXmlMasivo").prop("disabled", true);
            }
            if (conteo_cadena_validacion !== tblTitulos.$(".cbxSelectDescarga").length) {
                $(".chtodos").prop("checked", false);
            } else {
                $(".chtodos").prop("checked", true);
            }
        });
		
		$("#tblTitulos").on("change", ".cbxDescXml, .cbxSelectDescarga", function () {
            var contador_seleccionados = 0;
            tblTitulos.$(".cbxDescXml, .cbxSelectDescarga").each(function () {
                if ($(this).is(":checked")) {
                    ++contador_seleccionados;
                }
            });
            $("#contador-seleccionados").html(contador_seleccionados);
        });

        $("#tblTitulos").on("change", ".chtodos", function () {
            var contador_seleccionados = 0;
            tblTitulos.$(".cbxDescXml, .cbxSelectDescarga").each(function () {
                if ($(this).is(":checked")) {
                    ++contador_seleccionados;
                }
            });
            $("#contador-seleccionados").html(contador_seleccionados);
        });																			  
		
		$("#tblTitulos").on("click", ".btnEnviarTituloServicioSEP", function () {
            var idTitulo = $(this).attr("id").split("_")[1];
            var idCarrera = $("#tblTitulos #Carrera_" + idTitulo).attr("id-carrera");
            swal({
                type: 'warning',
                title: '¿Estás seguro?',
                text: 'Al confirmar, el XML será enviado a la SEP para su verificación en el ambiente de pruebas',
                confirmButtonText: 'Sí, ¡Enviar al servicio!',
                showCancelButton: true,
                cancelButtonText: 'Cancelar',
                cancelButtonColor: '#d33',
                showLoaderOnConfirm: true,
                animation: true,
                allowOutsideClick: false,
                allowEscapeKey: false
            }).then(function () {
                $('#loadAction').fadeIn();
                $.ajax({
                    url: '../Transporte/queryCTitulos.jsp',
                    data: '&txtBandera=11&idTitulo=' + idTitulo,
                    type: 'POST',
                    success: function (resp) {
                        if (resp.includes("noCredenciales")) {
                            swal("¡Upps!", "¡No has llenado las credenciales para usar el servicio!\nDirigete a configuración inicial para llenarlas!", "warning");
                        } else if (resp.includes('success')) {
                            swal('¡Enviado!', 'El registro ha sido eviado a la SEP', 'success');
                            cargarTabla(idCarrera);
                        } else if (resp.includes('fileNotFound')) {
                            show_swal('¡Upps!', 'Ha ocurrido un error al obtener el arreglo de bytes.<p>El archivo no pudo ser localizado en la carpeta destinada.</p><br><small>Si el problema persiste contacte a soporte técnico</small>', 'error');
                        } else {
                            show_swal("¡Upps!", resp.split('|')[1], "error");
                        }
                    }, complete: function (jqXHR, textStatus) {
                        $('#loadAction').fadeOut();
                    }
                });
            });
        });

        $("#tblTitulos").on("click", ".btnConsultarRespuestaServicioSEP", function () {
            var idTitulo = $(this).attr("id").split("_")[1];
            $('#loadAction').fadeIn();
            $.ajax({
                url: '../Transporte/queryCTitulos.jsp',
                data: '&txtBandera=12&idTitulo=' + idTitulo,
                type: 'POST',
                success: function (resp) {
                    var respuesta = resp.split("¬");
                    if (respuesta[0].toString().trim() === 'noCredenciales') {
                        swal("¡Upps!", "¡No has llenado las credenciales para usar el servicio!\nDirigete a configuración inicial para llenarlas!", "warning");
                    } else if (respuesta[0].toString().trim() === 'noCargaSEP') {
                        var mensajeSEP = respuesta[2];
                        var folio = respuesta[5];
                        $("#txtFolioRespuesta").val(folio);
                        $("#txtNumLote").val('NO DISPONIBLE');
                        $("#txtMensajeSEP").val(mensajeSEP);
                        $(".btnDecargaRespuestaSEP").prop("disabled", "disabled");
                        $("#modal-consultaTituloSEP").modal("show");
                    } else if (respuesta[0].toString().trim() === 'success' && respuesta[1].toString().trim() === '') {
                        var mensajeSEP = respuesta[2];
                        var folio = respuesta[5];
                        var numLote = respuesta[3];
                        $("#txtFolioRespuesta").val(folio);
                        $("#txtNumLote").val(numLote);
                        $("#txtMensajeSEP").val(mensajeSEP);
                        $(".btnDecargaRespuestaSEP").prop("disabled", "disabled");
                        $("#modal-consultaTituloSEP").modal("show");
                    } else if (respuesta[0].toString().trim() === 'success' && respuesta[1].toString().trim() === 'success') {
                        var cadenaImagen = respuesta[4];
                        if (cadenaImagen.toString().trim().length > 0 && cadenaImagen.toString().trim() !== 'IOException') {
                            var mensajeSEP = respuesta[2];
                            var folio = respuesta[5];
                            var numLote = respuesta[3];
                            $("#txtFolioRespuesta").val(folio);
                            $("#txtNumLote").val(numLote);
                            $("#txtMensajeSEP").val(mensajeSEP);
                            $(".btnDecargaRespuestaSEP").removeAttr("disabled");
                            descargaRespuestaSEP(cadenaImagen);
                            $("#modal-consultaTituloSEP").modal("show");
                        } else {
                            var mensajeSEP = respuesta[2];
                            var folio = respuesta[5];
                            var numLote = respuesta[3];
                            $("#txtFolioRespuesta").val(folio);
                            $("#txtNumLote").val(numLote);
                            $("#txtMensajeSEP").val(mensajeSEP);
                            $(".btnDecargaRespuestaSEP").prop("disabled", "disabled");
                            $("#modal-consultaTituloSEP").modal("show");
                        }
                    } else if (respuesta[0].toString().trim() === 'noConsultaSEP') {
                        var mensajeSEP = respuesta[2];
                        var folio = respuesta[5];
                        var numLote = respuesta[3];
                        $("#txtFolioRespuesta").val(folio);
                        $("#txtNumLote").val(numLote);
                        $("#txtMensajeSEP").val(mensajeSEP);
                        $(".btnDecargaRespuestaSEP").prop("disabled", "disabled");
                        $("#modal-consultaTituloSEP").modal("show");
                    } else if (respuesta[0].toString().trim() === 'noConsultaSQL') {
                        var mensajeSEP = respuesta[2];
                        var folio = respuesta[5];
                        var numLote = respuesta[3];
                        $("#txtFolioRespuesta").val(folio);
                        $("#txtNumLote").val(numLote);
                        $("#txtMensajeSEP").val(mensajeSEP);
                        $(".btnDecargaRespuestaSEP").prop("disabled", "disabled");
                        $("#modal-consultaTituloSEP").modal("show");
                    } else {
                        show_swal("¡Upps!", resp.split('|')[1], "error");
                    }
                }, complete: function (jqXHR, textStatus) {
                    $('#loadAction').fadeOut();
                }
            });
        });

        $("#tblTitulos").on("click", ".btnEnviarTituloServicioSepProductivo", function () {
            var idTitulo = $(this).attr("id").split("_")[1];
            var matricula = $("#tblTitulos #Matricula_" + idTitulo).text();
            var folioControl = $("#tblTitulos #FolioControl_" + idTitulo).text();
            var idCarrera = $("#tblTitulos #Carrera_" + idTitulo).attr("id-carrera");
            swal({
                type: 'warning',
                title: '¿Estás seguro?',
                html: '<p>Al confirmar, el XML será enviado a la SEP para su verificación en el <b>ambiente productivo.</b></p>Matrícula del profesionista: <b> ' + matricula + '</b><br>Folio: <b>' + folioControl + '</b>',
                confirmButtonText: 'Sí, ¡Enviar al servicio!',
                showCancelButton: true,
                cancelButtonText: 'Cancelar',
                cancelButtonColor: '#d33',
                showLoaderOnConfirm: true,
                animation: true,
                allowOutsideClick: false,
                allowEscapeKey: false
            }).then(function () {
                $('#loadAction').fadeIn();
                $.ajax({
                    url: '../Transporte/queryCTitulos.jsp',
                    data: '&txtBandera=13&idTitulo=' + idTitulo,
                    type: 'POST',
                    success: function (resp) {
                        if (resp.includes("noCredenciales")) {
                            swal("¡Upps!", "¡No has llenado las credenciales para usar el servicio productivo!\nDirigete a configuración inicial para llenarlas", "warning");
                        } else if (resp.includes('success')) {
                            swal('¡Enviado!', 'El registro ha sido eviado a la SEP', 'success');
                            cargarTabla(idCarrera);
                        } else if (resp.includes('SQL')) {
                            swal('¡Upps!', 'Ha ocurrido un error en el servidor de base de datos: ' + resp.split("¬")[1], 'error');
                        } else if (resp.includes('eSOAP')) {
                            swal('¡Upps!', 'Parece que el servicio para la carga de titulos de la SEP no está disponible o presenta fallas al momento de enviar la solicitud.<p>Detalle del error: ' + resp.split("¬")[1], 'error');
                        } else if (resp.includes('fileNotFound')) {
                            show_swal('¡Upps!', 'Ha ocurrido un error al obtener el arreglo de bytes.<p>El archivo no pudo ser localizado en la carpeta destinada.</p><br><small>Si el problema persiste contacte a soporte técnico</small>', 'error');
                        } else if (resp.trim() === '') {
                            swal('¡Upps!', 'Parece que el servicio para la carga de titulos de la SEP no está disponible o presenta fallas al momento de enviar la solicitud.<p>Detalle del error: Servicio no disponible', 'error');
                        }
                    }, complete: function (jqXHR, textStatus) {
                        $('#loadAction').fadeOut();
                    }
                });
            });
        });

        $("#tblTitulos").on("click", ".btnConsultarRespuestaServicioSepProductivo", function () {
            var idTitulo = $(this).attr("id").split("_")[1];
            $('#loadAction').fadeIn();
            $.ajax({
                url: '../Transporte/queryCTitulos.jsp',
                data: '&txtBandera=14&idTitulo=' + idTitulo,
                type: 'POST',
                success: function (resp) {
                    var respuesta = resp.split("¬");
                    if (respuesta[0].toString().trim() === 'noCredenciales') {
                        swal("¡Upps!", "¡No has llenado las credenciales para usar el servicio!\nDirigete a configuración inicial para llenarlas", "warning");
                    } else if (respuesta[0].toString().trim() === 'noCargaSEP') {
                        var mensajeSEP = respuesta[2];
                        var folio = respuesta[5];
                        $("#txtFolioRespuesta").val(folio);
                        $("#txtNumLote").val('NO DISPONIBLE');
                        $("#txtMensajeSEP").val(mensajeSEP);
                        $(".btnDecargaRespuestaSEP").prop("disabled", "disabled");
                        $("#modal-consultaTituloSEP").modal("show");
                    } else if (respuesta[0].toString().trim() === 'success' && respuesta[1].toString().trim() === '') {
                        var mensajeSEP = respuesta[2];
                        var folio = respuesta[5];
                        var numLote = respuesta[3];
                        $("#txtFolioRespuesta").val(folio);
                        $("#txtNumLote").val(numLote);
                        $("#txtMensajeSEP").val(mensajeSEP);
                        $(".btnDecargaRespuestaSEP").prop("disabled", "disabled");
                        $("#modal-consultaTituloSEP").modal("show");
                    } else if (respuesta[0].toString().trim() === 'success' && respuesta[1].toString().trim() === 'success') {
                        var cadenaImagen = respuesta[4];
                        if (cadenaImagen.toString().trim().length > 0 && cadenaImagen.toString().trim() !== 'IOException') {
                            var mensajeSEP = respuesta[2];
                            var folio = respuesta[5];
                            var numLote = respuesta[3];
                            $("#txtFolioRespuesta").val(folio);
                            $("#txtNumLote").val(numLote);
                            $("#txtMensajeSEP").val(mensajeSEP);
                            $(".btnDecargaRespuestaSEP").removeAttr("disabled");
                            descargaRespuestaSEP(cadenaImagen);
                            $("#modal-consultaTituloSEP").modal("show");
                        } else {
                            var mensajeSEP = respuesta[2];
                            var folio = respuesta[5];
                            var numLote = respuesta[3];
                            $("#txtFolioRespuesta").val(folio);
                            $("#txtNumLote").val(numLote);
                            $("#txtMensajeSEP").val(mensajeSEP);
                            $(".btnDecargaRespuestaSEP").prop("disabled", "disabled");
                            $("#modal-consultaTituloSEP").modal("show");
                        }
                    } else if (respuesta[0].toString().trim() === 'noConsultaSEP') {
                        var mensajeSEP = respuesta[2];
                        var folio = respuesta[5];
                        var numLote = respuesta[3];
                        $("#txtFolioRespuesta").val(folio);
                        $("#txtNumLote").val(numLote);
                        $("#txtMensajeSEP").val(mensajeSEP);
                        $(".btnDecargaRespuestaSEP").prop("disabled", "disabled");
                        $("#modal-consultaTituloSEP").modal("show");
                    } else if (respuesta[0].toString().trim() === 'noConsultaSQL') {
                        var mensajeSEP = respuesta[2];
                        var folio = respuesta[5];
                        var numLote = respuesta[3];
                        $("#txtFolioRespuesta").val(folio);
                        $("#txtNumLote").val(numLote);
                        $("#txtMensajeSEP").val(mensajeSEP);
                        $(".btnDecargaRespuestaSEP").prop("disabled", "disabled");
                        $("#modal-consultaTituloSEP").modal("show");
                    } else if (respuesta[0].toString().trim() === 'SQL') {
                        swal('¡Upps!', 'Ha ocurrido un error en el servidor de base de datos: ' + resp.split("¬")[1], 'error');
                    }
                }, error: function () {
                    swal('¡Error!', 'Error interno del servidor, contacte a soporte técnico', 'error');
                }, complete: function (jqXHR, textStatus) {
                    $('#loadAction').fadeOut();
                }
            });
        });

        $("#tblTitulos").on("click", ".btnCancelarTituloServicioSepProductivo", function () {
            var idTitulo = $(this).attr("id").split("_")[1];
            $table = $(".js-dataTable-full-pagination-Fixed").DataTable();
            $row = $(this).parents("tr");
            $data = $table.row($row).data();
            $.ajax({
                url: '../Transporte/queryCTitulos.jsp',
                data: '&txtBandera=16&idTitulo=' + idTitulo,
                type: 'POST',
                success: function (resp) {
                    var arregloRespuestas = resp.split("¬");
                    if (arregloRespuestas[0].toString().trim() === "success") {
                        $("#txtFolioControlCancelar").val(arregloRespuestas[1]).trigger("change");
                        $("#lstMotivosCan").val(arregloRespuestas[2]).prop("disabled", true).trigger("chosen:updated");
                        $("#txtMensajeCancelacion").val(arregloRespuestas[3]).trigger("change");
                        $("#btnCancelarTituloElectronico").prop("disabled", true).hide();
                    } else if (arregloRespuestas[0].toString().trim() === "noCancelado") {
                        var folio = $("#FolioControl_" + idTitulo).text();
                        $("#txtFolioControlCancelar").val(folio).trigger("change");
                        $("#lstMotivosCan").val("").prop("disabled", false).trigger("chosen:updated");
                        $("#txtMensajeCancelacion").val("").prop("disabled", true).trigger("change");
                        $("#btnCancelarTituloElectronico").prop("disabled", false).show();
                    }
                    $("#modaltitleCancelarT").html("CANCELAR TÍTULO ELECTRÓNICO");
                }, error: function () {
                    swal('¡Error!', 'Error interno del servidor, contacte a soporte técnico', 'error');
                }, complete: function (jqXHR, textStatus) {
                    $('#loadAction').fadeOut();
                    $("#modal-cancelarT").modal("show");
                    $("#txtTituloCancelar").val(idTitulo);
                }
            });
        });

        $("#tblTitulos").on("click", ".btnLibroFoja", function () {
            var idTitulo = $(this).attr("id").split("_")[1];
            $('#loadAction').fadeIn();
            $.ajax({
                url: '../Transporte/queryCTitulos.jsp',
                data: '&txtBandera=20&idTitulo=' + idTitulo,
                type: 'POST',
                success: function (resp) {
                    var arregloRespuestas = resp.split("¬");
                    if (arregloRespuestas[0].toString().trim() === "success") {
                        $("#txtMatriculaLF").val(arregloRespuestas[1]).trigger("change").attr("disabled", true);
                        $("#txtNombreLF").val(arregloRespuestas[2]).trigger("change").attr("disabled", true);
                        $("#txtCarreraALF").val(arregloRespuestas[3]).trigger("change").attr("disabled", true);
                        $("#txtFolioLF").val(arregloRespuestas[4]).trigger("change").attr("disabled", true);
                        $("#txtLibroTitulo").val(arregloRespuestas[5]).trigger("change");
                        $("#txtFojaTitulo").val(arregloRespuestas[6]).trigger("change");
                        $("#btnLlenarLibroFoja").off("click").on("click", function () {
                            let libro = $("#txtLibroTitulo").val();
                            let foja = $("#txtFojaTitulo").val();

                            if (libro.toString().trim() === "" || foja.toString().trim() === "") {
                                show_swal('¡Información incompleta!', 'Por favor, llena los campos requeridos', 'warning');
                                return;
                            } else {
                                $('#loadAction').fadeIn();
                                $.ajax({
                                    url: '../Transporte/queryCTitulos.jsp',
                                    data: '&txtBandera=21&idTitulo=' + idTitulo + "&txtLibro=" + libro + "&txtFoja=" + foja,
                                    type: 'POST',
                                    success: function (resp) {
                                        if (resp.includes("success")) {
                                            show_swal('¡Proceso completado!', 'Los datos han sido modificados correctamente', 'success');
                                            $("#modal-llenarLibroFoja").modal("hide");
                                        }
                                    }, complete: function (jqXHR, textStatus) {
                                        $('#loadAction').fadeOut();
                                    }
                                });
                            }
                        });
                        $("#modal-llenarLibroFoja").modal("show");
                    } else if (arregloRespuestas[0].toString().trim() === "noTitulo") {
                        show_swal('¡Sin Título!', 'El registro seleccionado no cuenta con un título registrado', 'error');
                    }
                }, error: function () {
                    show_swal('¡Error!', 'Error interno del servidor, contacte a soporte técnico', 'error');
                }, complete: function (jqXHR, textStatus) {
                    $('#loadAction').fadeOut();
                }
            });
        });
    }

    var time;
    $("#btnDescargarXmlMasivo").on("click", function () {
        var cadenaIdTitulos = "";
        $('#loadAction').fadeIn();
        tblTitulos.$(".cbxDescXml").each(function () {
            if ($(this).is(":checked")) {
                let nombre = $(this).attr("data-nombrepdf");
                var id = this.id.split("_")[1];
                cadenaIdTitulos += id + "~" + nombre + "¬";
            }
        }).promise().done(function () {
            $.ajax({
                url: '../Transporte/queryCTitulos.jsp',
                data: '&txtBandera=9&cadenaIdTitulos=' + cadenaIdTitulos,
                type: 'POST',
                success: function (resp) {
                    $("#divDescargaZipMasivo").children("a").remove();
                    $("#divDescargaZipMasivo").hide();
                    if (!resp.includes("error")) {
                        $.notify({
                            // options
                            message: '<div class="text-center">Tu archivo está listo para descargar<br><strong>El archivo dejará de estar disponible en 3 minutos</strong></div>'
                        }, {
                            // settings
                            type: 'success',
                            delay: 15000
                        });
                        clearTimeout(time);
                        $("<a>")
                                .attr("id", "masiveTemp")
                                .attr("class", "btn btn-success btn-sm")
                                .attr("href", resp.trim())
                                .attr("download", "")
                                .attr("style", "color:#fff")
                                .appendTo("#divDescargaZipMasivo");
                        $("<i>").attr("class", "fa fa-file-zip-o").appendTo("#masiveTemp");
                        $("#masiveTemp").append(" Descargar archivo titulos").attr("data-toggle", "tooltip").attr("title", "Descargar archivo titulos");
                        $('[data-toggle="tooltip"]').tooltip();
                        $("#divDescargaZipMasivo").show();
                        time = setTimeout(function () {
                            $("#masiveTemp").tooltip("destroy");
                            $("#divDescargaZipMasivo").children("a").remove();
                            $("#divDescargaZipMasivo").hide();
                            if (!$("#divBotonesDescarga").children("div").is(":visible")) {
                                $("#divBotonesDescarga").hide();
                            }
                            ajustarDivLista();
                        }, 180000);
                    } else {
                        $.notify({
                            // options
                            message: '<div class="text-center">Ocurrió un error al generar tu archivo, intenta de nuevo</div>'
                        }, {
                            // settings
                            type: 'danger'
                        });

                        show_swal("¡Upps!", resp.split('|')[1], "error");
                    }
                }, complete: function () {
                    $('#loadAction').fadeOut();
                    $("#divBotonesDescarga").show();
                    ajustarDivLista();
                }
            });
        });
    });

    var time2;
    $("#btnDescargarPDFMasivo").on("click", function () {
        var cadenaIdTitulos = "";
        swal({
            type: 'warning',
            title: '¿Generar Zip?',
            html: '<p>Se generara un archivo zip con los títulos seleccionados</p>',
            confirmButtonText: 'Sí, ¡Generar!',
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            cancelButtonColor: '#d33',
            showLoaderOnConfirm: true,
            animation: true,
            allowOutsideClick: false,
            allowEscapeKey: false,
            input: "checkbox",
            inputClass: "css-input css-checkbox css-checkbox-primary",
            inputPlaceholder: '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;¿Regenerar PDF creados?'
        }).then(resp => {
            $('#loadAction').fadeIn();
            tblTitulos.$(".cbxDesPdf").each(function () {
                if ($(this).is(":checked")) {
                    let nombre = $(this).attr("data-nombrepdf");
                    var id = this.id.split("_")[1];
                    cadenaIdTitulos += id + "~" + nombre + "¬";
                }
            }).promise().done(function () {
                let regenerar = $("#swal2-checkbox").is(":checked");
                $.ajax({
                    url: '../Transporte/queryCTitulos.jsp',
                    data: '&txtBandera=17&cadenaIdTitulos=' + cadenaIdTitulos + '&genPDF=' + regenerar,
                    type: 'POST',
                    success: function (resp) {
                        $("#divDescargaPdfMasivo").children("a").remove();
                        $("#divDescargaPdfMasivo").hide();
                        if (!resp.includes("error")) {
                            $.notify({
                                // options
                                message: '<div class="text-center">Tu archivo está listo para descargar<br><strong>El archivo dejará de estar disponible en 3 minutos</strong></div>'
                            }, {
                                // settings
                                type: 'success',
                                delay: 15000
                            });
                            clearTimeout(time2);
                            $("<a>")
                                    .attr("id", "masivePDFTemp")
                                    .attr("class", "btn btn-danger btn-sm")
                                    .attr("href", resp.trim())
                                    .attr("download", "")
                                    .attr("style", "color:#fff")
                                    .appendTo("#divDescargaPdfMasivo");
                            $("<i>").attr("class", "fa fa-file-zip-o").appendTo("#masivePDFTemp");
                            $("#masivePDFTemp").append(" Descargar lote de titulos pdf").attr("data-toggle", "tooltip").attr("title", "Descargar lote de titulos pdf");
                            $('[data-toggle="tooltip"]').tooltip();
                            $("#divDescargaPdfMasivo").show();
                            time2 = setTimeout(function () {
                                $("#masivePDFTemp").tooltip("destroy");
                                $("#divDescargaPdfMasivo").children("a").remove();
                                $("#divDescargaPdfMasivo").hide();
                                if (!$("#divBotonesDescarga").children("div").is(":visible")) {
                                    $("#divBotonesDescarga").hide();
                                }
                                ajustarDivLista();
                            }, 180000);
                        } else {
                            $.notify({
                                // options
                                message: '<div class="text-center">Ocurrió un error al generar tu archivo, intenta de nuevo</div>'
                            }, {
                                // settings
                                type: 'danger'
                            });

                            show_swal("¡Upps!", resp.split('|')[1], "error");
                        }
                    }, complete: function () {
                        $('#loadAction').fadeOut();
                        $("#divBotonesDescarga").show();
                        ajustarDivLista();
                    }
                });
            });
        }, function () {

        });
        $(".swal2-checkbox").find("span").remove();
        $(".swal2-checkbox").append("<span></span>¿Regenerar PDF creados?");
    });

    var time3;
    $("#btnDescargarXMLMasivo").on("click", function () {
        var cadenaIdTitulos = "";
        $('#loadAction').fadeIn();
        tblTitulos.$(".cbxDescXmlM").each(function () {
            if ($(this).is(":checked")) {
                let nombre = $(this).attr("data-nombrepdf");
                var id = this.id.split("_")[1];
                cadenaIdTitulos += id + "~" + nombre + "¬";
            }
        }).promise().done(function () {
            $.ajax({
                url: '../Transporte/queryCTitulos.jsp',
                data: '&txtBandera=18&cadenaIdTitulos=' + cadenaIdTitulos,
                type: 'POST',
                success: function (resp) {
                    $("#divDescargaXmlMasivo").children("a").remove();
                    $("#divDescargaXmlMasivo").hide();
                    if (!resp.includes("error")) {
                        $.notify({
                            // options
                            message: '<div class="text-center">Tu archivo está listo para descargar<br><strong>El archivo dejará de estar disponible en 3 minutos</strong></div>'
                        }, {
                            // settings
                            type: 'success',
                            delay: 15000
                        });
                        clearTimeout(time3);
                        //fa fa-file-zip-o
                        $("<a>")
                                .attr("id", "masiveXMLTemp")
                                .attr("class", "btn btn-warning btn-sm")
                                .attr("href", resp.trim())
                                .attr("download", "")
                                .attr("style", "color:#fff")
                                .appendTo("#divDescargaXmlMasivo");
                        $("<i>").attr("class", "fa fa-file-zip-o").appendTo("#masiveXMLTemp");
                        $("#masiveXMLTemp").append(" Descargar lote de titulos xml").attr("data-toggle", "tooltip").attr("title", "Descargar lote de titulos xml");
                        $('[data-toggle="tooltip"]').tooltip();
                        $("#divDescargaXmlMasivo").show();
                        time3 = setTimeout(function () {
                            $("#masiveXMLTemp").tooltip("destroy");
                            $("#divDescargaXmlMasivo").children("a").remove();
                            $("#divDescargaXmlMasivo").hide();
                            if (!$("#divBotonesDescarga").children("div").is(":visible")) {
                                $("#divBotonesDescarga").hide();
                            }
                            ajustarDivLista();
                        }, 180000);
                    } else {
                        $.notify({
                            // options
                            message: '<div class="text-center">Ocurrió un error al generar tu archivo, intenta de nuevo</div>'
                        }, {
                            // settings
                            type: 'danger'
                        });

                        show_swal("¡Upps!", resp.split('|')[1], "error");
                    }
                }, complete: function () {
                    $('#loadAction').fadeOut();
                    $("#divBotonesDescarga").show();
                    ajustarDivLista();
                }
            });
        });
    });

    $("#btnGeneXmlMasivo").on("click", function () {
        var cadenaIdTitulos = "";
        tblTitulos.$(".cbxGenXml").each(function () {
            if ($(this).is(":checked")) {
                var id = this.id.split("_")[1];
                cadenaIdTitulos += id + "¬";
            }
        });

        $('#loadAction').fadeIn();
        $.ajax({
            url: '../Transporte/queryCTitulos.jsp',
            data: '&txtBandera=10&cadenaIdTitulos=' + cadenaIdTitulos,
            type: 'POST',
            success: function (resp) {
                if (resp.includes('success')) {
                    $("#btnGeneXmlMasivo").prop("disabled", true);
                    $("#btnDescargarXmlMasivo").prop("disabled", true);
                    var idCarrera = $("#lstCarreras").val();
                    cargarTabla(idCarrera);
                    show_swal("¡Proceso completado!", resp.split("¬")[1] + resp.split("¬")[2], "info");
                } else if (resp.includes('errorContrasenia')) {
                    show_swal('¡Upps!', 'Ha ocurrido un error, es posible que la contraseña del firmante sea incorrecta.', 'error');
                } else if (resp.includes('sinTimbres')) {
                    show_swal('¡Upps!', 'Se han agotado los timbres disponibles para la generación de títulos, adquiere más para continuar.<br><br><small>Presiona F5 para actualizar el sitio y verificar que archivos XML fueron generados.</small>', 'warning');
                } else if (resp.includes('timbresVencidos')) {
                    show_swal('¡Upps!', 'Los timbres disponibles ya no son vigentes, contacte a soporte técnico para obtener más información.', 'warning');
                } else {
                    show_swal("¡Upps!", resp.split('|')[1], "error");
                }
            }, complete: function () {
                $('#loadAction').fadeOut();
            }
        });
//        } else {
//            swal('¡Upps', 'Este alumno no tiene materias asignadas aún, no es posible generar un certificado electrónico', 'warning');
//            $('#ButtonGenerateXML').prop('disabled', true);
//        }

    });

    $('#ButtonGenerateXML').click(function () {
        var idTitulo = $(this).val();
        var idCarrera = $("#lstCarreraTitulo").val();
        if ($('#txtEdition').val() == "1") {
            $('#loadAction').fadeIn();
            xml = 1;
            $('#ButtonUpdateTitulo').click();
        } else {
            var grados = $('#ButtonGenerateXML').data('grados');
            if (grados == '0' || grados == 0) {
                var interval = setInterval(function () {
                    $('.configurarGrados').click(function () {
                        swal('¡Configurar grados!', 'Diríjase al modal de Claves carrera para establecer los valores en la carrera', 'info');
                    });
                }, 500);

                swal({
                    type: 'warning',
                    title: '¡Upps!',
                    text: 'Los grados de la carrera no se han agregado, ¿deseas generar el XML o regresar a configurar los grados?',
                    showCancelButton: true,
                    confirmButtonText: 'Generar XML',
                    confirmButtonColor: '#dd3333db',
                    cancelButtonText: 'Configurar los grados',
                    cancelButtonColor: '#1b92a7d1',
                    cancelButtonClass: 'configurarGrados'
                }).then((result) => {

                    if (result) {
                        // Generar XML
                        //$('#loadAction').fadeIn();
                        generarXML(idTitulo, idCarrera);
                    }
                    clearInterval(interval, idCarrera);
                });
            } else {
                //$('#loadAction').fadeIn();
                generarXML(idTitulo, idCarrera);
            }
        }
    });


    function generarXML(idTitulo, idCarrera) {
        $("#loadAction").fadeIn();
        $.ajax({
            url: '../Transporte/queryCTitulos.jsp',
            data: '&txtBandera=7&idTitulo=' + idTitulo,
            type: 'POST',
            success: function (resp) {
                if (resp.includes('success')) {
                    swal('¡XML generado!', 'Ya puedes descargar el archivo', 'success');
                    $('#modal-titulosElectronicos').modal('hide');
                } else if (resp.includes('errorContrasenia')) {
                    swal('¡Upps!', 'Ha ocurrido un error, es posible que la contraseña del firmante sea incorrecta', 'error');
                } else if (resp.includes('sinTimbres')) {
                    swal('¡Upps!', 'Se han agotado los timbres disponibles para la generación de títulos, adquiere más para continuar', 'warning');
                } else if (resp.includes('timbresVencidos')) {
                    swal('¡Upps!', 'Los timbres disponibles ya no son vigentes, contacte a soporte técnico para continuar', 'warning');
                } else {
                    show_swal("¡Upps!", resp.split('|')[1], "error");
                }
            }, complete: function () {
                $("#loadAction").fadeOut();
                $("#lstCarreras").val(idCarrera).trigger("chosen:updated");
                cargarTabla(idCarrera);
            }
        });
    }

    function fecha() {
        var today = new Date();
        var yesterday = new Date(today.setDate(today.getDate() - 1));
        var dd, mm, yyyy;
        dd = yesterday.getDate();
        mm = yesterday.getMonth() + 1;
        yyyy = yesterday.getFullYear();

        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        return dd + "-" + mm + "-" + yyyy;
    }

    function CleanInputs() {
        $('#txtMatricula').val('').trigger('change');
        $('#lstCarreraTitulo').find('option').remove().end().append('<option></option>').trigger('chosen:updated');
        $('#txtNombreAlumno').val('').trigger('change');
        $('#txtFolioControl').val('').trigger('change');
        $('#lstModalidadTitulacion').val('').trigger('chosen:updated');
        $('#lstFundamentoLegal').val('').trigger('chosen:updated');
        $('#lstLugarExpedicion').val('').trigger('chosen:updated');
        $('#txtInstitucionProcedencia').val('').trigger('change');
        $('#txtFechaInicio').datepicker('setDate', null);
        $('#txtFechaFin').datepicker('setDate', null);
        $('#txtFechaExpedicion').datepicker().datepicker('setDate', fecha());
        $('#lstCumplioServicio').val('').trigger('chosen:updated');
        $('#txtFechaExamenProfesional').datepicker('setDate', null);
        $('#txtFechaExencionExamenProfesional').datepicker('setDate', null);

        $('#lstEstudioAntecedente').val('').trigger('chosen:updated');
        $('#lstEntidadAntecedente').val('').trigger('chosen:update');
        $('#txtFechaInicioAntecedente').datepicker('setDate', null);
        $('#txtFechaFinAntecedente').datepicker('setDate', null);
        $('#lstFirmantesTitulos').val('').trigger('chosen:updated');
        $('#txtNoCedula').val('').trigger('change');
        $('.has-error').removeClass('has-error');
        $('.help-block').remove();
    }

    function BlockInputs(Cond) {
        $('#txtMatricula').prop('disabled', Cond);
        $('#lstCarreraTitulo').prop('disabled', Cond).trigger('chosen:updated');
        $('#txtNombreAlumno').prop('disabled', Cond);
        $('#txtFolioControl').prop('disabled', true);
        $('#lstModalidadTitulacion').prop('disabled', Cond).trigger('chosen:updated');
        $('#lstFundamentoLegal').prop('disabled', Cond).trigger('chosen:updated');
        $('#lstLugarExpedicion').prop('disabled', Cond).trigger('chosen:updated');
        $('#txtFechaInicio').prop('disabled', Cond);
        $('#txtFechaFin').prop('disabled', Cond);
        $('#txtFechaExpedicion').prop('disabled', Cond);
        $('#lstCumplioServicio').prop('disabled', Cond).trigger('chosen:updated');
        $('#txtFechaExamenProfesional').prop('disabled', Cond);
        $('#txtFechaExencionExamenProfesional').prop('disabled', Cond);
        $('#lstEstudioAntecedente').prop('disabled', Cond).trigger('chosen:updated');
        $('#lstEntidadAntecedente').prop('disabled', Cond).trigger('chosen:updated');
        $('#txtFechaInicioAntecedente').prop('disabled', Cond);
        $('#txtFechaFinAntecedente').prop('disabled', Cond);
        $('#lstFirmantesTitulos').prop('disabled', Cond).trigger('change');
        $('#txtNoCedula').prop('disabled', Cond);
        $('#lstCarreraTitulo').prop('disabled', Cond);
        $('#btnBuscarAlumno').prop('disabled', Cond);
    }

    $("#lstCarreraTitulo").on('change', function () {
        document.getElementById("DivLstCarreraTitulo").className = document.getElementById("DivLstCarreraTitulo").className.replace(/(?:^|\s)has-error(?!\S)/g, '');
        document.getElementById("DivLstCarreraTitulo").className = document.getElementById("DivLstCarreraTitulo").className.replace(/(?:^|\s)form-material-primary(?!\S)/g, '');
        document.getElementById("DivLstCarreraTitulo").className += " form-material-primary";
        $('#lstCarreraTitulo-error').remove();
    });
    $("#lstModalidadTitulacion").on('change', function () {
        document.getElementById("DivLstModalidadTitulacion").className = document.getElementById("DivLstModalidadTitulacion").className.replace(/(?:^|\s)has-error(?!\S)/g, '');
        document.getElementById("DivLstModalidadTitulacion").className = document.getElementById("DivLstModalidadTitulacion").className.replace(/(?:^|\s)form-material-primary(?!\S)/g, '');
        document.getElementById("DivLstModalidadTitulacion").className += " form-material-primary";
        $('#lstModalidadTitulacion-error').remove();
    });
    $("#lstFundamentoLegal").on('change', function () {
        document.getElementById("DivLstFundamentoLegal").className = document.getElementById("DivLstFundamentoLegal").className.replace(/(?:^|\s)has-error(?!\S)/g, '');
        document.getElementById("DivLstFundamentoLegal").className = document.getElementById("DivLstFundamentoLegal").className.replace(/(?:^|\s)form-material-primary(?!\S)/g, '');
        document.getElementById("DivLstFundamentoLegal").className += " form-material-primary";
        $('#lstFundamentoLegal-error').remove();
    });
    $("#lstLugarExpedicion").on('change', function () {
        document.getElementById("DivLstLugarExpedicion").className = document.getElementById("DivLstLugarExpedicion").className.replace(/(?:^|\s)has-error(?!\S)/g, '');
        document.getElementById("DivLstLugarExpedicion").className = document.getElementById("DivLstLugarExpedicion").className.replace(/(?:^|\s)form-material-primary(?!\S)/g, '');
        document.getElementById("DivLstLugarExpedicion").className += " form-material-primary";
        $('#lstLugarExpedicion-error').remove();
    });
    $("#lstCumplioServicio").on('change', function () {
        document.getElementById("DivLstCumplioServicio").className = document.getElementById("DivLstCumplioServicio").className.replace(/(?:^|\s)has-error(?!\S)/g, '');
        document.getElementById("DivLstCumplioServicio").className = document.getElementById("DivLstCumplioServicio").className.replace(/(?:^|\s)form-material-primary(?!\S)/g, '');
        document.getElementById("DivLstCumplioServicio").className += " form-material-primary";
        $('#lstCumplioServicio-error').remove();
    });
    $("#lstEstudioAntecedente").on('change', function () {
        document.getElementById("DivLstEstudioAntecedente").className = document.getElementById("DivLstEstudioAntecedente").className.replace(/(?:^|\s)has-error(?!\S)/g, '');
        document.getElementById("DivLstEstudioAntecedente").className = document.getElementById("DivLstEstudioAntecedente").className.replace(/(?:^|\s)form-material-primary(?!\S)/g, '');
        document.getElementById("DivLstEstudioAntecedente").className += " form-material-primary";
        $('#lstEstudioAntecedente-error').remove();
    });
    $("#lstEntidadAntecedente").on('change', function () {
        document.getElementById("DivLstEntidadAntecedente").className = document.getElementById("DivLstEntidadAntecedente").className.replace(/(?:^|\s)has-error(?!\S)/g, '');
        document.getElementById("DivLstEntidadAntecedente").className = document.getElementById("DivLstEntidadAntecedente").className.replace(/(?:^|\s)form-material-primary(?!\S)/g, '');
        document.getElementById("DivLstEntidadAntecedente").className += " form-material-primary";
        $('#lstEntidadAntecedente-error').remove();
    });

    $("#btnCopiarCadena").click(function () {
        $("#txtACadenaOriginal").attr("disabled", false);
        $("#txtACadenaOriginal").select();
        document.execCommand("copy");
        $("#txtACadenaOriginal").attr("disabled", true);
        $.notify({
            // options
            message: '¡Copiado al portapapeles!'
        }, {
            // settings
            type: 'info',
            delay: 3000,
            placement: {
                from: "bottom",
                align: "left"
            },
            z_index: 10310
        });
    });

    function descargaRespuestaSEP(e) {
        $(".btnDecargaRespuestaSEP").off("click").on("click", function () {
            var a = document.createElement('a');
            var linkText = document.createTextNode("Descarga");
            a.appendChild(linkText);
            a.id = "linkDescarga";
            a.style.display = "none";
            a.title = "my title text";
            a.href = e;
            a.download = "";
            document.body.appendChild(a);
            a.click();
            document.getElementById("linkDescarga").remove();
            console.clear();
        });
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
                    cargaInicio();
                } else if (resp[0].includes("acceso")) {
                    let stringStepFirst = resp[0].split("°")[1];
                    if (stringStepFirst.split("¬")[0].includes("1")) {
                        cargaInicio();
                        //IMPORTAR REGISTROS
                        if (stringStepFirst.split("¬")[1].includes("0")) {
                            $("#btnNuevoTitulo").remove();
                            $("#btnDescargarFormato").parent("div").parent("div").remove();
                        }
                        if (stringStepFirst.split("¬")[5].includes("0")) {
                            $("#ButtonGenerateXML").parent().remove();
                            $("#btnGeneXmlMasivo").parent().remove();
                        }
                        //NO DESCARGAS
                        if (stringStepFirst.split("¬")[6].includes("0")) {
                            $("#btnDescargarXMLMasivo").parent().remove();
                            $("#btnDescargarXmlMasivo").parent().remove();
                            $("#btnDescargarPDFMasivo").parent().remove();
                        }
                        //NO CARGA MASIVA
                        if (stringStepFirst.split("¬")[8].includes("0")) {
                            $("#btn-up-pruebas").parent().remove();
                            $("#btn-up-prod").parent().remove();
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

    $("#btnCancelarTituloElectronico").on("click", function () {
        var motCancelacion = $("#lstMotivosCan").val();
        if (motCancelacion == null || motCancelacion === '') {
            show_swal("¡Completa la información!", "¡Selecciona el motivo de cancelación!", "warning");
            return;
        }
        var idTitulo = $("#txtTituloCancelar").val();
        var matricula = $("#tblTitulos #Matricula_" + idTitulo).text();
        var folioControl = $("#tblTitulos #FolioControl_" + idTitulo).text();

        swal({
            type: 'warning',
            title: '¿Estás seguro?',
            html: '<p>Al confirmar, el folio del título electrónico será cancelado en el <b>ambiente productivo.</b></p>Matrícula del profesionista: <b> ' + matricula + '</b><br>Folio: <b>' + folioControl + '</b>',
            confirmButtonText: 'Sí, ¡Enviar al servicio!',
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            cancelButtonColor: '#d33',
            showLoaderOnConfirm: true,
            animation: true,
            allowOutsideClick: false,
            allowEscapeKey: false
        }).then(function () {
            $('#loadAction').fadeIn();
            $.ajax({
                url: '../Transporte/queryCTitulos.jsp',
                data: '&txtBandera=15&idTitulo=' + idTitulo + '&motCancelacion=' + motCancelacion,
                type: 'POST',
                success: function (data, textStatus, jqXHR) {
                    var respuesta = data.split("¬");
                    var estadoConsulta = respuesta[0].toString().trim();
                    var estadoSOAP = respuesta[1].toString().trim();
                    var mensaje = respuesta[2];

                    if (estadoConsulta === "noCargaSEP") {
                        show_swal("¡Lo sentimos!", "Ocurrió un error al consultar el número de lote del título electrónico. Para mayor información, contacte a soporte técnico.", "error");
                    } else if (estadoConsulta === "success") {
                        if (estadoSOAP === "canceladoSQL") {
                            $("#txtMensajeCancelacion").val(mensaje).trigger("change");
                            swal({
                                type: 'success',
                                title: '¡Cancelado!',
                                html: '<p>El folio <b>' + folioControl + '</b> fue cancelado correctamente tanto ante la <b>SEP</b> como en <b>Digi-SEP</b>.</p>',
                                confirmButtonText: 'Ok',
                                showCancelButton: false,
                                animation: true,
                                allowOutsideClick: false,
                                allowEscapeKey: false
                            });
                            $("#btnCancelarTituloElectronico").prop("disabled", true).hide();
                            $("#lstMotivosCan").prop("disabled", true).trigger("chosen:updated");
                            $data[7] = '<span class="label label-danger">CANCELADO EN PRODUCTIVO.</span>';
                            $table.row($row).data($data).invalidate();
                            tblTitulos.$($row).find("button.btnConsultarRespuestaServicioSepProductivo").remove();
                            tblTitulos.$($row).find("button.btnCancelarTitulo").remove();
                            tblTitulos.$('[data-toggle="tooltip"]').tooltip({
                                container: 'body',
                                animation: false,
                                trigger: 'hover'
                            });
                            console.log($table.row($row).data()[8]);
                        } else if (estadoSOAP === "errorSQL") {
                            $("#txtMensajeCancelacion").val(mensaje).trigger("change");
                            swal({
                                type: 'warning',
                                title: '¡Verificar!',
                                html: '<p>El folio <b>' + folioControl + '</b> fue cancelado correctamente en el servicio de la SEP, pero por alguna razón no fue cancelado en el sistema <b>Digi-SEP</b>.<br>Contacta a soporte técnico.</p>',
                                confirmButtonText: 'Ok',
                                showCancelButton: false,
                                animation: true,
                                allowOutsideClick: false,
                                allowEscapeKey: false
                            });
                            $("#btnCancelarTituloElectronico").prop("disabled", true).hide();
                            $("#lstMotivosCan").prop("disabled", true).trigger("chosen:updated");
                        } else if (estadoSOAP === "noCanceladoSOAP") {
                            $("#txtMensajeCancelacion").val(mensaje).trigger("change");
                            swal({
                                type: 'error',
                                title: '¡No cancelado!',
                                html: '<p>El folio <b>' + folioControl + '</b> no fue cancelado dentro del servicio <b>SEP</b>.</p><p>Consulta el apartado <b>mensaje de respuesta</b> para más detalles.</p>',
                                confirmButtonText: 'Ok',
                                showCancelButton: false,
                                animation: true,
                                allowOutsideClick: false,
                                allowEscapeKey: false
                            });
                            $("#btnCancelarTituloElectronico").prop("disabled", false).show();
                        }
                    } else if (estadoConsulta === "noConsultaSEP") {
                        $("#txtMensajeCancelacion").val("NO FUE POSIBLE COMPLETAR EL PROCESO DE CANCELACIÓN MEDIANTE EL SERVICIO SEP.\n\nINTENTA DE NUEVO.").trigger("change");
                        swal({
                            type: 'error',
                            title: '¡Ocurrió un error!',
                            html: mensaje,
                            confirmButtonText: 'Ok',
                            showCancelButton: false,
                            animation: true,
                            allowOutsideClick: false,
                            allowEscapeKey: false
                        });
                    } else if (estadoConsulta === "noConsultaSQL") {
                        show_swal("¡Lo sentimos!", "No fue posible encontrar en el servidor de base de datos el título seleccionado. \n\
                                            Intente nuevamente, si el problema persiste contacte a soporte técnico.", "error");
                        $("#txtMensajeCancelacion").val("No fue posible encontrar en el servidor de base de datos el título seleccionado. Intente nuevamente, si el problema persiste contacte a soporte técnico.").trigger("change");
                    } else {
                        show_swal("¡Lo sentimos!", "Ocurrió un error interno en el servidor. Para mayor información, contacte a soporte técnico.", "error");
                        $("#txtMensajeCancelacion").val(mensaje).trigger("change");
                    }
                },
                complete: function () {
                    $('#loadAction').fadeOut();
                }
            });
        }, function () {

        });

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
    resize();
    function resize() {
        window.onresize = function () {
            ajustarComponentesModal();
        };

        window.onload = function () {
            ajustarComponentesModal();
        };

        function ajustarComponentesModal() {
            if (window.innerWidth < 1200 && window.innerWidth > 1107) {
                $("#DivLstCarreras").css("margin-top", "");
                $("#divBotonesDescarga").removeClass("push-50-t").removeClass("push-100-t").removeClass("push-150-t").addClass("push-30-t");
            } else if (window.innerWidth < 1108 && window.innerWidth > 991) {
                $("#DivLstCarreras").css("margin-top", "30px");
                $("#divBotonesDescarga").removeClass("push-30-t").removeClass("push-100-t").removeClass("push-150-t").addClass("push-50-t");
            } else if (window.innerWidth < 992 && window.innerWidth > 468) {
                if (window.innerWidth < 807 && window.innerWidth > 767) {
                    $("#divBotonesDescarga").removeClass("push-30-t").removeClass("push-100-t").removeClass("push-150-t").addClass("push-50-t");
                } else if (window.innerWidth < 768 && window.innerWidth > 657) {
                    $("#DivLstCarreras").css("margin-top", "30px");
                    $("#divBotonesDescarga").children("div").removeClass("col-xs-12").addClass("col-xs-4").last().removeClass("push-5-t");
                    ;
                } else if (window.innerWidth < 656 && window.innerWidth > 487) {
                    $("#divBotonesDescarga").children("div").removeClass("col-xs-4").addClass("col-xs-6").last().addClass("push-5-t");
                    if (window.innerWidth < 620 && window.innerWidth >= 514) {
                        $("#DivLstCarreras").css("margin-top", "70px");
                        $("#divBotonesDescarga").removeClass("push-30-t").removeClass("push-150-t").removeClass("push-50-t").addClass("push-100-t");
                        if (window.innerWidth < 496) {
                            $("#DivLstCarreras").css("margin-top", "70px");
                        }
                    }
                } else if (window.innerWidth < 486) {
                    $("#divBotonesDescarga").removeClass("push-100-t").removeClass("push-50-t").removeClass("push-30-t").addClass("push-150-t");
                    $("#DivLstCarreras").css("margin-top", "70px");
                }
            } else if (window.innerWidth < 469 && window.innerWidth > 334) {
                if ($("#divBotonesDescarga").children("div").is(":visible"))
                    $("#DivLstCarreras").css("margin-top", "");
                else
                    $("#DivLstCarreras").css("margin-top", "95px");
                $("#divBotonesDescarga").removeClass("push-50-t").removeClass("push-100-t").removeClass("push-30-t").addClass("push-150-t");
                $("#divDescargaPdfMasivo").css("margin-left", "");
            } else {
                $("#DivLstCarreras").css("margin-top", "");
                //$("#divBotonesDescarga").children("div").children("a").addClass("btnDescargas");
            }

            if (window.innerWidth <= 545 && window.innerWidth >= 335) {
                $(".li-buttons").parent("li").show();
                $(".js-dataTable-full-pagination-Fixed").find("th:nth-child(10),td:nth-child(10)").show();
            } else if (window.innerWidth <= 334) {
                $(".li-buttons").parent("li").hide();
                $("#divBotonesDescarga").hide();
                $(".js-dataTable-full-pagination-Fixed").find("th:nth-child(10),td:nth-child(10)").hide();
                $("#divTblTitulos").parent().css("margin-top", "");
            } else {
                $("#divTblTitulos").parent().css("margin-top", "-15px");
                $(".js-dataTable-full-pagination-Fixed").find("th:nth-child(10),td:nth-child(10)").show();
            }
        }
    }

    $(".cerrarFirmantes").on("click", function () {
        setTimeout(function () {
            $('body').addClass('modal-open');
        }, 400);
    });

    function cargarTabla(idCarrera) {
        $("#loadAction").fadeIn();
        $.ajax({
            url: '../Transporte/queryCTitulos.jsp',
            data: '&txtBandera=19&idCarrera=' + idCarrera.toString().trim(),
            type: 'POST',
            success: function (resp) {
                if (resp.includes('success')) {
                    $("#divTblTitulos").html(resp.split("|")[1]);
                }
            }, complete: function () {
                $("#loadAction").fadeOut();
                $(".li-buttons").attr("disabled", true);
                initTable();
                TableActions();
            }
        });
    }

    $("#btnFiltrarTitulos").on("click", function () {
        let idCarrera = $("#lstCarreras").val();
        if (idCarrera.toString().trim() === 'todos') {
            swal({
                type: 'warning',
                title: '¿Estás seguro?',
                text: 'El proceso de carga va demorar en relación a la cantidad de titulos registrados en el sistema',
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
                cargarTabla(idCarrera);
            }, function () {

            });
        } else {
            $("#loadAction").fadeIn();
            cargarTabla(idCarrera);
        }
    });

    function ajustarDivLista() {
        if (window.innerWidth < 469 && window.innerWidth > 334) {
            if ($("#divBotonesDescarga").children("div").is(":visible"))
                $("#DivLstCarreras").css("margin-top", "");
            else
                $("#DivLstCarreras").css("margin-top", "95px");
        }
    }

    $("#btnImportarMasivo").click(function () {
        $("#fileTitulos").click();
    });

    $('#fileTitulos').on('change', function () {
        var archivo = $(this).val();

        if (archivo != null && archivo.toString() != "undefined") {
            if (archivo.toString().endsWith('.xls') || archivo.toString().endsWith('.xlsx')) {
                swal('¡Cargando información!', 'Se están registrando los titulos en el sistema', 'info').then(function () {
                    $('#loadAction').fadeIn();
                });
                $('#importarArchivo').click();
            } else {
                show_swal('¡Upps!', 'Debes seleccionar el formato predeterminado con la información de los titulos', 'warning');
                $('#fileTitulos').val('');
            }
        }
    });

    $('.btnAccionesTitulos').click(function () {
        $("form[name='form-importar-titulos-masivos']").submit(function (e) {
            e.preventDefault();
        }).validate({
            ignore: [],
            errorClass: 'help-block text-right animated fadeInDown',
            errorElement: 'div',
            rules: {
                fileTitulos: {
                    required: true,
                    extension: "xls|xlsx"
                }
            },
            messages: {
                'fileTitulos': {
                    required: function () {
                        show_swal('¡Upps!', 'Selecciona el archivo predeterminado con la información de los alumnos', 'warning');
                    },
                    extension: function () {
                        show_swal('¡Upps!', 'Selecciona el archivo excel con la información de los alumnos', 'warning');
                    }
                }
            },
            submitHandler: function (form) {
                $.ajax({
                    url: '../Transporte/queryCTitulos.jsp',
                    type: 'POST',
                    data: new FormData(form),
                    processData: false,
                    contentType: false,
                    success: function (resp) {
                        if (resp.toString().includes('success')) {
                            var split = resp.split("||");
                            show_swal('¡Proceso completado!', 'La importación de los títulos se ha completado con éxito.', 'success');
                            //Procedemos a cargar los titulos recien importados.
                            cargarTabla(split[1]);
                            $.notify({
                                // options
                                message: 'Se cargaran en la tabla los títulos importados...'
                            }, {
                                // settings
                                type: 'success',
                                delay: 7000,
                                placement: {
                                    from: "top",
                                    align: "right"
                                },
                                z_index: 10310
                            });
						} else if (resp.toString().includes('formatoInvalido')) {
                            var split = resp.split("||");
                            show_swal('¡Formato incorrecto!', split[1], 'warning');
                        } else if (resp.toString().includes('infoTituloIncompleta')) {
                            var split = resp.split("||");
                            swal('¡Información incompleta!', split[1], 'warning');
                        } else if (resp.toString().includes('noAlumno')) {
                            var split = resp.split('||');
                            show_swal('¡No se encontró el alumno!', split[1] + '<strong>Los registros posteriores NO fueron realizados.</strong>', 'warning');
                        } else if (resp.includes('tituloActivo')) {
                            var split = resp.split('||');
                            show_swal('¡Título Activo!', split[1] + '<strong>Los registros posteriores NO fueron realizados.</strong>', 'warning');
                        } else if (resp.includes('noCarrera')) {
                            var split = resp.split('||');
                            show_swal('¡Carrera no encontrada!', split[1] + '<strong>Los registros posteriores NO fueron realizados.</strong>', 'warning');
                        } else if (resp.toString().includes('noFirmante')) {
                            var split = resp.split('||');
                            show_swal('¡Firmante no encontrado!', split[1] + '<strong>Los registros posteriores NO fueron realizados.</strong>', 'warning');
                        } else if (resp.toString().includes('sinRegistros')) {
                            var split = resp.split('||');
                            show_swal('¡Archivo en blanco!', split[1] + '<strong>Los registros posteriores NO fueron realizados.</strong>', 'warning');
                        } else if (resp.toString().includes('fechasExamenInvalidas')) {
                            var split = resp.split('||');
                            show_swal('¡Fechas Examen No Válidas!', split[1] + '<br><strong>Los registros posteriores NO fueron realizados.</strong>', 'warning');
                        } else if (resp.toString().includes('errorFirmantes')) {
                            var split = resp.split('||');
                            show_swal('¡Upps!', 'Ocurrió un error al registrar los firmantes con el título de la hoja '
                                    + split[1] + '. <br><p>Registro Firmante: '
                                    + split[2] + "<br><strong><small>Contacta a soporte técnico</small></strong>", 'error');
						} else {
                            show_swal("¡Upps!", resp.split('||')[1], "error");
                        }
                    }, complete: function () {
                        $('#fileTitulos').val('');
                        $('#loadAction').fadeOut();
                    }
                });
            }
        });
    });

});