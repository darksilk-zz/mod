$(function () {
    $('input[name="dateRange"]').daterangepicker({
        opens: 'center',
        timePicker: true,
        showDropdowns: true,
        timePicker24Hour: true,
        timePickerIncrement: 1,
        minDate: moment().add(24, 'hour').startOf('day'),
        startDate: moment().add(24, 'hour').startOf('day'),
        endDate: moment().startOf('day').add(48, 'hour'),
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
        console.log('New date range selected: ' + start.format('YYYY-MM-DD HH:mm') + ' to ' + end.format('YYYY-MM-DD HH:mm') + ' (predefined range: ' + label + ')');
        
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