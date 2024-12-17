$(document).ready(function () {
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
                txtBandera: 1
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
                        swal("¡Proceso completado!", "<p>Las carreras han sido descargadas correctamente. Se descargaron: <b>" + contador + "</b> carreras</p><small><strong>La tabla de contenido se actualizará</strong></small>", "success").then(resp => {
                            LoadTable();
                            clearTimeout(time);
                            $("#modal-upaep-carreras").modal("hide");
                        });
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
                    } else if (bandera === "empty") {
                        swal("¡Proceso no completado!",
                                "El web service no está enviando uno o más de los datos esperados, interrumpiendo la descarga de la información.\n\
        <br><strong><b>Contacte a su área técnica para corroborar dicha información.</b></strong>\n\
<br><small>Actualice la página para visualizar la información descargada.</small>", "error");
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
            },
            error: function (jqXHR, textStatus, errorThrown) {
                clearTimeout(time);
            }
        });
    });
    var time;
    function randomProgress() {
        time = setTimeout(function () {
            let $this = $("#progress-loader");
            let _prev;
            $this.fadeIn();
            let progress = $($this).find(".progress-bar");
            _prev = Math.floor((Math.random() * 95 - prev) + prev);
            if (_prev < prev) {
                let $random = 99 + '%';
                progress.css('width', $random);
                progress.html($random);
            } else {
                let $random = _prev + '%';
                progress.css('width', $random);
                progress.html($random);
            }
        }, 1000);
    }
});
