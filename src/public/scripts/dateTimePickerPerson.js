$(function () {
    $('input[name="birthdate"]').daterangepicker({
        singleDatePicker: true,
        showDropdowns: true,
        minYear: 1901,
        opens: 'center',
        startDate: moment().subtract(18, 'year'),
        maxYear: parseInt(moment().format('YYYY')) - 17,
        "locale": {
            format: 'YYYY/MM/DD',
            "separator": " - ",
            "applyLabel": "Apply",
            "cancelLabel": "Cancel",
            "fromLabel": "From",
            "toLabel": "To",
            "customRangeLabel": "Custom",
            "weekLabel": "W",
            "daysOfWeek": [
                "Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"
            ],
            "monthNames": [
                "Enero", "Fenrero", "Marzo", "Abril", "Mayo",
                "Junio", "Julio", "Augosto", "Septiembre", "Octubre",
                "Noviembre", "Diciembre"
            ],
            "firstDay": 1
        },
    }, function (start, end, label) {
        var years = moment().diff(start, 'years');
        console.log("You are " + years + " years old!");
        console.log(parseInt(moment().format('YYYY')) + 18);
    });
});