/*
 *  Document   : base_pages_login.js
 *  Author     : pixelcave
 *  Description: Custom JS code used in Login Page
 */

var BasePagesLogin = function() {
    // Init Login Form Validation, for more examples you can check out https://github.com/jzaefferer/jquery-validation
    var initValidationLogin = function(){
        jQuery('.js-validation-login').validate({
            errorClass: 'help-block text-right animated fadeInDown',
            errorElement: 'div',
            errorPlacement: function(error, e) {
                jQuery(e).parents('.form-group > div').append(error);
            },
            highlight: function(e) {
                jQuery(e).closest('.form-group').removeClass('has-error').addClass('has-error');
                jQuery(e).closest('.help-block').remove();
            },
            success: function(e) {
                jQuery(e).closest('.form-group').removeClass('has-error');
                jQuery(e).closest('.help-block').remove();
            },
            rules: {
                'txtLogUsuario': {
                    required: true
                },
                'txtLogPass': {
                    required: true
                }
            },
            messages: {
                'txtLogUsuario': {
                    required: 'Por favor ingresa tu usuario'
                },
                'txtLogPass': {
                    required: 'Por favor ingresa tu contraseña'
                }
            }
        });
    };

    return {
        init: function () {
            // Init Login Form Validation
            initValidationLogin();
        }
    };
}();

// Initialize when page loads
jQuery(function(){ BasePagesLogin.init(); });