$(document).ready(function () {
    $("#lst-carrera-service").chosen({width: "100%", disable_search_threshold: 4});
    var prev;
    $("#btn-cargar-servicio").on("click", function () {
        var $this = $("#progress-loader");
        $this.hide();
        var progress = $($this).find(".progress-bar");
        progress.css('width', "0%");
        progress.html("0%");
        $("#modal-upaep-carreras").modal("show");
        $("#btn-fire-service").attr("disabled", false);
        $("#btn-cancelar-servicio").attr("disabled", false);
    });

    $("#btn-fire-service").on("click", function () {
        $.ajax({
            url: '../Transporte/queryCService.jsp',
            type: 'POST',
            data: {
                txtBandera: 2,
                value: $("#lst-carrera-service").val()
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
                $("#modal-upaep-carreras-draggable .block-options").find("button").attr("disabled", true);
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
                        let serviceOption = $("#lst-carrera-service").val();
                        if (serviceOption.includes("todos")) {
                            swal("¡Proceso completado!", "<p>Las asignaturas han sido descargadas correctamente. Se descargaron: <b>" + contador + "</b> asignaturas</p><small><strong>Consulta la carrera que desees.</strong></small>", "success").then(resp => {
                                $("#modal-upaep-carreras").modal("hide");
                            });
                        } else {
                            swal("¡Proceso completado!", "<p>Las asignaturas han sido descargadas correctamente. Se descargaron: <b>" + contador + "</b> asignaturas</p>", "success").then(resp => {
                                $("#lstCarreras").val(serviceOption).trigger("chosen:updated");
                                $("#btnFiltrarMaterias").trigger("click");
                                $("#modal-upaep-carreras").modal("hide");
                            });
                        }
                    } else if (bandera === "error") {
                        let jsonError = JSON.parse(data.split("¬")[1].toString().trim());
                        swal("¡Proceso no completado!",
                                "El web service arrojó un error al procesar la solicitud.<p>Cryptdata: <i class='text-danger'>" + jsonError['cryptdata'] + "</i></p><p>Descripción del mensaje: <i class='text-danger'>" + jsonError['message'] + "</i></p><p><small>Verifica la información ingresada e intenta de nuevo.</small></p>", "error");
                        $("#progress-loader").hide();
                        var progress = $("#progress-loader").find(".progress-bar");
                        progress.css('width', "0%");
                        progress.html("0%");
                        $("#btn-fire-service").attr("disabled", false);
                        $("#btn-cancelar-servicio").attr("disabled", false);
                    } else if (bandera === "jsonCarrera") {
                        swal("¡Proceso no completado!",
                                "El web service no está enviando el identificador de carrera, interrumpiendo la descarga de la información.\n\
        <br><strong><b>Contacte a su área técnica para corroborar dicha información.</b></strong>\n\
<br><small>Actualice la página para visualizar la información descargada.</small>", "error");
                        $("#progress-loader").hide();
                        var progress = $("#progress-loader").find(".progress-bar");
                        progress.css('width', "0%");
                        progress.html("0%");
                        $("#btn-fire-service").attr("disabled", false);
                        $("#btn-cancelar-servicio").attr("disabled", false);
                    } else if (bandera === "noCarrera") {
                        let mensaje = data.split("¬")[1].toString().trim();
                        swal("¡Proceso no completado!", mensaje, "error");
                        $("#progress-loader").hide();
                        var progress = $("#progress-loader").find(".progress-bar");
                        progress.css('width', "0%");
                        progress.html("0%");
                        $("#btn-fire-service").attr("disabled", false);
                        $("#btn-cancelar-servicio").attr("disabled", false);
                    } else if (bandera === "null") {
                        let mensaje = data.split("¬")[1].toString().trim();
                        let contador = data.split("¬")[2].toString().trim();
                        swal("¡Proceso completado!", "<p>Las asignaturas han sido descargadas correctamente. " + mensaje + " Se descargaron: <b>" + contador + "</b> asignaturas</p><small><strong>Consulta la carrera que desees.</strong></small>", "success").then(resp => {
                            $("#modal-upaep-carreras").modal("hide");
                        });
                    } else if (bandera === "nulos") {
                        let mensaje = data.split("¬")[1].toString().trim();
                        swal("¡Proceso no completado!", mensaje, "error");
                        $("#progress-loader").hide();
                        var progress = $("#progress-loader").find(".progress-bar");
                        progress.css('width', "0%");
                        progress.html("0%");
                        $("#btn-fire-service").attr("disabled", false);
                        $("#btn-cancelar-servicio").attr("disabled", false);
                    } else {
                        swal("¡Lo sentimos!", "Ocurrió un error al procesar la solicitud.<p>Comprueba tu conexión a internet e intenta de nuevo</p>", "error");
                    }
                });
            },
            complete: function (jqXHR, textStatus) {
                $("#modal-upaep-carreras-draggable .block-options").find("button").attr("disabled", false);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                clearTimeout(time);
                clearTimeout(time2);
                $("#modal-upaep-carreras-draggable .block-options").find("button").attr("disabled", false);
                swal("¡Lo sentimos!", "Ocurrió un error al procesar la solicitud.<p>Intente de nuevo</p>", "error");
            }
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
        }, 2000);
        time2 = setTimeout(function () {
            let $this = $("#progress-loader");
            $this.fadeIn();
            let progress = $($this).find(".progress-bar");
            let $random = 99 + '%';
            progress.css('width', $random);
            progress.html($random);
        }, 5000);
    }
});


