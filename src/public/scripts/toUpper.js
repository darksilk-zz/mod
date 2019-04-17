$('#submit').click(function () {
    $(":input").each(function () {
        this.value = this.value.toUpperCase();
    });
});
