const socket = io.connect('http://localhost:8080')

socket.on('connected', () => {
    console.log('Socket Connected')
    console.log(window.location.pathname)
    if (window.location.pathname == '/fingerprint/login') {
        socket.emit('estado', 1);
    } else if (window.location.pathname == '/fingerprint/add') {
        socket.emit('estado', 2);
        socket.emit('estado', document.getElementById('fingerprint').value);
    } else {
        alert("Sin acciones");
    }
})

socket.on('disconnect', () => {
    console.log('Socket Disconnected')
})

socket.on('data', data => {
    if(!data.includes("Esperando estado")){
        document.getElementById('monitor').innerHTML = data;
        if(data.includes("Found ID")){
            var id = data.split("#");
            document.getElementById("fingerprint").value = id[1];
            document.getElementById("imageFingerForm").submit();
        }
    }
});