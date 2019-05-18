const socket = io.connect('http://localhost:8080')

socket.on('connected', () => {
    console.log('Socket Connected')
    console.log(window.location.pathname)
    if (window.location.pathname == '/fingerprint/login') {
        socket.emit('estado', 1);
    } else {
        alert("Sin acciones");
    }
})

socket.on('disconnect', () => {
    console.log('Socket Disconnected')
})

socket.on('data', data => {
    console.log(data);
    if(data.search("Esperando estado")){
        document.getElementById('monitor').innerHTML = data;
    }
})