document.getElementById('title').focus();

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
            /*$.each(arrayMunicipios.arrayMunicipios, function (i, p) {
                $('#municipios').append('<option>' + p.nombre + '</option>')
            });*/
            arrayMunicipios.arrayMunicipios.forEach(function (municipios) {
                $('#municipio').append('<option value="' + municipios.id + '">' + municipios.nombre + '</option>')
            });
        });
    });
});
