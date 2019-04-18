document.getElementById('name').focus();

const URI = '/person/getMunicipio';

$(document).ready(function () {
    $("#estado").change(function () {
        var aid = $("#estado").val();
        $.ajax({
            url: `${URI}/${aid}`,
            method: 'put',
            data: 'aid=' + aid
        }).done(function (arrayMunicipios) {
            $('#municipio').empty();
            arrayMunicipios.arrayMunicipios.forEach(function (municipios) {
                $('#municipio').append('<option value="' + municipios.id + '">' + municipios.nombre + '</option>')
            });
        });
    });
});
