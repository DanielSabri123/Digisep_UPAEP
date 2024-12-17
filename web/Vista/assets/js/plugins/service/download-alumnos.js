$(document).ready(function () {
    initTable();
    var tblAgrupado;
    function initTable() {
        tblAgrupado = $('#tbl-alumno').dataTable({
            ordering: true,
            orderable: false,
            paging: true,
            searching: true,
            info: true,
            pagingType: "full_numbers",
            columnDefs: [{orderable: false, targets: 2}],
            pageLength: 5,
            aaSorting: [],
            lengthMenu: [[5, 10], [5, 10]],
            createdRow: function (row, data, dataIndex) {
                // Set the data-status attribute, and add a class
                $(row).find('td:eq(2)')
                        .addClass('text-center');
            },
            rowId: function (a) {
                return a[0] + "_" + a[1];
            }
        });
    }
    var table = $('#tbl-alumno').DataTable();

    $("#btn-add-tbl").on("click", function () {
        var texto = $("#text-data").val();
        if (texto.toString().trim() == "") {
            swal("¡Información Incompleta!", "Completa la información a consultar", "warning");
            return false;
        } else {
            $("#loadAction").fadeIn();
            var rows = texto.split("\n");
            rows.map(function (e, index) {
                if (e.toString().trim() !== "") {
                    let cols = e.toString().trim().includes("\t") ? e.toString().trim().split("\t") : e.toString().trim().split(" ");
                    if (cols[0] !== "" && cols[1].toString().trim() !== "") {
                        table.row.add([
                            cols[0],
                            cols[1].toString().trim(),
                            '<div class="btn-group"><button class="btn btn-default btn-xs" id="' + cols[0] + '_' + cols[1].toString().trim() + '"><i class="fa fa-times"></i></button></div>'
                        ]).draw(false);
                    }
                }
            });
            $("#loadAction").fadeOut();
            $("#text-data").val("");
        }
    });

    var prev;
    $("#btn-cargar-servicio").on("click", function () {
        $(".nav-tabs").find("a").first().trigger("click");
        var $this = $("#progress-loader");
        $this.hide();
        var progress = $($this).find(".progress-bar");
        progress.css('width', "0%");
        progress.html("0%");
        $("#modal-upaep-alumnos").modal("show");
        $("#btn-fire-service").attr("disabled", false);
        $("#btn-cancelar-servicio").attr("disabled", false);
        $("#txt-id").val("").trigger("change");
        $("#txt-matricula").val("").trigger("change");
        $("#text-data").val("").trigger("change");
        table.rows().remove().draw();
    });

    $("#btn-fire-service").on("click", function () {
        let alumno = new Promise((resolve, reject) => {
            let opt = $("#opt").val();
            let resp = [];
            let object = {};
            if (opt == 1) {
                let id = $("#txt-id").val().toString().trim();
                let mat = $("#txt-matricula").val().toString().trim();
                if (id == "" || mat == "") {
                    reject("Completa la información requerida para consultar");
                } else {
                    object.id = id;
                    object.mat = mat;
                    resp.push(object);
                    resolve(resp);
                }
            } else if (opt == 2) {
                table.rows().every(function (rowIdx, tableLoop, rowLoop) {
                    var data = this.data();
                    let object = {};
                    object.id = data[0];
                    object.mat = data[1];
                    resp.push(object);
                });
                resolve(resp);
            } else {
                reject("La opción no es válida");
            }
        });
        alumno.then(resp => {
            if (resp.length == 0) {
                swal("¡Lo sentimos!", "Completa la información requerida para consultar", "warning");
            } else {
                $.ajax({
                    url: '../Transporte/queryCService.jsp',
                    type: 'POST',
                    data: {
                        txtBandera: 3,
                        value: JSON.stringify(resp)
                    },
                    beforeSend: function (xhr) {
                        var $this = $("#progress-loader");
                        $this.fadeIn();
                        var progress = $($this).find(".progress-bar");
                        prev = Math.floor((Math.random() * 25) + 0);
                        var $random = prev + '%';
                        progress.css('width', $random);
                        progress.html($random);
                        randomProgress();
                        $("#btn-fire-service").attr("disabled", true);
                        $("#btn-cancelar-servicio").attr("disabled", true);
                    },
                    success: function (data, textStatus, jqXHR) {
                        clearTimeout(time);
                        clearTimeout(time2);
                        let completeProgress = new Promise((resolve, reject) => {
                            let $this = $("#progress-loader");
                            let progress = $($this).find(".progress-bar");
                            progress.css('width', "100%");
                            progress.html("100%");
                            resolve("complete...");
                        });
                        completeProgress.then(resp => {
                            let bandera = data.split("¬")[0].toString().trim();
                            if (bandera === "success") {
                                let contador = data.split("¬")[1].toString().trim();
                                swal("¡Proceso completado!", "<p>Las alumnos han sido descargados correctamente. Se descargaron: <b>" + contador + "</b> alumnos</p><small><strong>Consulta la carrera que desees.</strong></small>", "success").then(resp => {
                                    $("#modal-upaep-alumnos").modal("hide");
                                });
                            } else if (bandera === "error") {
                                let indicador = data.split("¬")[1].toString().trim();
                                if (indicador == 0) {
                                    let jsonError = JSON.parse(data.split("¬")[2].toString().trim());
                                    swal("¡Proceso no completado!",
                                            "El web service arrojó un error al procesar la solicitud.<p>Cryptdata: <i class='text-danger'>" + jsonError['cryptdata'] + "</i></p><p>Descripción del mensaje: <i class='text-danger'>" + jsonError['message'] + "</i></p><p><small>Verifica la información ingresada e intenta de nuevo.</small></p>", "error");
                                } else {
                                    let mensaje = data.split("¬")[2].toString().trim();
                                    let id = data.split("¬")[3].toString().trim();
                                    swal("¡Proceso no completado!", mensaje, "error");
                                    let i = table.row("#" + id).index();
                                    for (var x = 0; x < i; x++) {
                                        table.row(0).remove().draw();
                                    }
                                    tblAgrupado.$("#" + id).parents('tr').css("background-color", "#6bc8c4");
                                }
                                $("#progress-loader").hide();
                                var progress = $("#progress-loader").find(".progress-bar");
                                progress.css('width', "0%");
                                progress.html("0%");
                                $("#btn-fire-service").attr("disabled", false);
                                $("#btn-cancelar-servicio").attr("disabled", false);
                            } else if (bandera === "sinCarrera") {
                                let id = data.split("¬")[1].toString().trim();
                                let mat = data.split("¬")[3].toString().trim();
                                let nombre = data.split("¬")[2].toString().trim();
                                let cve = data.split("¬")[3].toString().trim();
                                swal('¡Upps!',
                                        'El id de la carrera asignada al alumno <b>' + nombre + "</b> con matrícula <b>" + mat +
                                        "</b> no está registrada en el sistema, por favor rectifique la clave (<b>" + cve + "</b>) o registre la carrera para continuar. \n" +
                                        "Los registros posteriores a este alumno no se realizaron", 'warning');
                                $("#progress-loader").hide();
                                var progress = $("#progress-loader").find(".progress-bar");
                                progress.css('width', "0%");
                                progress.html("0%");
                                $("#btn-fire-service").attr("disabled", false);
                                $("#btn-cancelar-servicio").attr("disabled", false);
                                let i = table.row("#" + id).index();
                                for (var x = 0; x < i; x++) {
                                    table.row(0).remove().draw();
                                }
                                tblAgrupado.$("#" + id).parents('tr').css("background-color", "#6bc8c4");
                            } else if (bandera === "certificadoActivo") {
                                let id = data.split("¬")[1].toString().trim();
                                let mat = data.split("¬")[3].toString().trim();
                                let nombre = data.split("¬")[2].toString().trim();
                                swal('¡Upps!',
                                        'El alumno(a) <b>' + nombre + '</b> con matrícula <b>' + mat +
                                        '</b> tiene un certificado electrónico activo, por lo que no es posible modificar su información. Los registros posteriores no fueron realizados', 'warning');
                                $("#progress-loader").hide();
                                var progress = $("#progress-loader").find(".progress-bar");
                                progress.css('width', "0%");
                                progress.html("0%");
                                $("#btn-fire-service").attr("disabled", false);
                                $("#btn-cancelar-servicio").attr("disabled", false);
                                let i = table.row("#" + id).index();
                                for (var x = 0; x < i; x++) {
                                    table.row(0).remove().draw();
                                }
                                tblAgrupado.$("#" + id).parents('tr').css("background-color", "#6bc8c4");
                            } else if (bandera === "tituloActivo") {
                                let id = data.split("¬")[1].toString().trim();
                                let mat = data.split("¬")[3].toString().trim();
                                let nombre = data.split("¬")[2].toString().trim();
                                swal('¡Upps!',
                                        'El alumno(a) <b>' + nombre + '</b> con matrícula <b>' + mat +
                                        '</b> tiene un título electrónico activo, por lo que no es posible modificar su información. Los registros posteriores no fueron realizados', 'warning');
                                $("#progress-loader").hide();
                                var progress = $("#progress-loader").find(".progress-bar");
                                progress.css('width', "0%");
                                progress.html("0%");
                                $("#btn-fire-service").attr("disabled", false);
                                $("#btn-cancelar-servicio").attr("disabled", false);
                                let i = table.row("#" + id).index();
                                for (var x = 0; x < i; x++) {
                                    table.row(0).remove().draw();
                                }
                                tblAgrupado.$("#" + id).parents('tr').css("background-color", "#6bc8c4");
                            } else {
                                swal("¡Lo sentimos!", "Ocurrió un error al procesar la solicitud.<p>Comprueba tu conexión a internet e intenta de nuevo</p>", "error");
                            }
                        });
                    },
                    complete: function (jqXHR, textStatus) {
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        clearTimeout(time);
                        clearTimeout(time2);
                    }
                });
            }
        }, function (resp) {
            swal("¡Lo sentimos!", resp, "warning");
        });
    });
    var time;
    var time2;
    function randomProgress() {
        time = setTimeout(function () {
            let $this = $("#progress-loader");
            let _prev;
            $this.fadeIn();
            let progress = $($this).find(".progress-bar");
            _prev = Math.floor((Math.random() * 75 - prev) + prev);
            if (_prev < prev) {
                let $random = 98 + '%';
                progress.css('width', $random);
                progress.html($random);
            } else {
                let $random = _prev + '%';
                progress.css('width', $random);
                progress.html($random);
            }
        }, 3000);

        time2 = setTimeout(function () {
            let $this = $("#progress-loader");
            let progress = $($this).find(".progress-bar");
            let $random = 98 + '%';
            progress.css('width', $random);
            progress.html($random);

        }, 6000);
    }
    $('#tbl-alumno tbody').on('click', '.btn-default', function () {
        table.row($(this).parents('tr')).remove().draw();
    });

    function noPrecedingOrDoubleSpace(eID) {
        var elmt = document.getElementById(eID);
        elmt.addEventListener("keydown", function (e)
        {
            var strg = elmt.value;
            var lastChar = strg.charAt(strg.length - 1);

            if (e.which === 13 && !e.shiftKey) {
                e.preventDefault();
                return false;
            }

            if ((lastChar === " ") || (lastChar === "&nbsp;") || (strg === ""))
            {
                if (e.which === 32)
                {
                    e.preventDefault();
                }
            }
            ;
        });
    }
    $("textarea").on('focus', function () {
        noPrecedingOrDoubleSpace("text-data");
    })
});

