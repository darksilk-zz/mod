$(function () {
    $('input[name="dateRange"]').daterangepicker({
        opens: 'center',
        timePicker: true,
        showDropdowns: true,
        timePicker24Hour: true,
        minDate: moment(),
        startDate: moment().startOf('hour'),
        endDate: moment().startOf('hour').add(32, 'hour'),
        locale: {
            separator: "-",
            format: 'DD/MM/YYYY HH:MM',
            "daysOfWeek": [
                "Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"
            ],
            "monthNames": [
                "Enero", "Fenrero", "Marzo", "Abril", "Mayo",
                "Junio", "Julio", "Augosto", "Septiembre", "Octubre",
                "Noviembre", "Diciembre"
            ],
            "firstDay": 1
        }
    }, function (start, end, label) {
        console.log("Date range: " + start.format('DD/MM/YYYY HH:MM') + ' to ' + end.format('DD/MM/YYY HH:MM'));
        var date = start.format('YYYY-MM-DDTHH:MM') + ' - ' + end.format('YYYY-MM-DDTHH:MM')
        var date = date.split(" - ");
        var dateStart = date[0];
        var dateEnd = date[1];
        var epochStart = moment(dateStart, "DD-MM-YYYY HH:MM").unix();
        var epochEnd = moment(dateEnd, "DD-MM-YYYY HH:MM").unix();
        console.log(epochStart);
        console.log(epochEnd);
        console.log(dateStart);
        console.log(dateEnd);
    });
});