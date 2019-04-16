$("#CURP").focus();

const URI = '/users/validateCURP';
function checkCURP() {
    var curp = $("#CURP").val();
    $.ajax({
        url: `${URI}/${curp}`,
        method: 'put',
        data: { curp: curp },
    }).done(function (idPerson) {
        if (idPerson.idPerson.length == 0) {
            $("#id_person").val('');
            $("#password").prop('disabled', true);
            $("#username").prop('disabled', true);
            alert("CURP no existe. Primero registrar persona");
        }
        else {
            $("#id_person").val(idPerson.idPerson[0].id);
            $("#password").prop('disabled', false);
            $("#username").prop('disabled', false);
        }
    });
}