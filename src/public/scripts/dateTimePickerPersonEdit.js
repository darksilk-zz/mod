/*Date in format: Tue Apr 16 2019 00:00:00 GMT-0500 (GMT-05:00)
Birthdate split to get index 03(year), 01(month), 02(day)*/

var birthdate = ($('#birthdate').val()).split(" ");
console.log($('#birthdate').val());

var mm = birthdate[1];

if (birthdate[1] == "Jan") { mm = '01';}
else if (mm == "Feb") { mm = '02';}
else if (mm == "Mar") { mm = '03';}
else if (mm == "Apr") { mm = '04';}
else if (mm == "May") { mm = '05';}
else if (mm == "Jun") { mm = '06';}
else if (mm == "Jul") { mm = '07';}
else if (mm == "Aug") { mm = '08';}
else if (mm == "Sep") { mm = '09';}
else if (mm == "Oct") { mm = '10';}
else if (mm == "Nov") { mm = '11';}
else if (mm == "Dec") { mm = '12';}

var date = birthdate[3] + '/' + mm + '/' + birthdate[2]

console.log(date);

$(function () {
    $('input[name="birthdate"]').daterangepicker({
        singleDatePicker: true,
        showDropdowns: true,
        minYear: 1901,
        opens: 'center',
        startDate: date,
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