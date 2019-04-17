var dateStart = $('#start').val();
var dateEnd = $('#end').val();
console.log(dateStart + "   " + dateEnd)
$(function () {
    $('input[name="dateRange"]').daterangepicker({
        opens: 'center',
        timePicker: true,
        showDropdowns: true,
        timePicker24Hour: true,
        timePickerIncrement: 60,
        minDate: moment(),
        startDate: moment(dateStart, "DD-MM-YYYY HH:mm"),
        endDate: moment(dateEnd, "DD-MM-YYYY HH:mm"),
        locale: {
            separator: "-",
            format: 'DD/MM/YYYY HH:mm',
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
        console.log("Date range: " + start.format('DD/MM/YYYY HH:mm') + ' to ' + end.format('DD/MM/YYY HH:mm'));
        var date = start.format('YYYY-MM-DDTHH:mm') + ' - ' + end.format('YYYY-MM-DDTHH:mm')
        var date = date.split(" - ");
        var dateStart = date[0];
        var dateEnd = date[1];
        var epochStart = moment(dateStart, "DD-MM-YYYY HH:mm").unix();
        var epochEnd = moment(dateEnd, "DD-MM-YYYY HH:mm").unix();
        console.log(epochStart);
        console.log(epochEnd);
        console.log(dateStart);
        console.log(dateEnd);
    });
});