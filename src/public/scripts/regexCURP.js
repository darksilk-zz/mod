function regexCURP() {
    var curp = $('#curp').val();
    var regex = new RegExp("^[a-zA-Z]{4}[0-9]{6}[a-zA-Z]{6}[0-9]{2}$");
    if (!regex.test(curp)) {
        $('#curp').val("");
        alert("Formato de CURP invalido!");
        return false;
    }
}