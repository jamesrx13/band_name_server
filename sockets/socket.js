const { io } = require('../index');
const Band = require('../models/band');
const Bands = require('../models/bands');

const bands = new Bands();

bands.addBand(new Band('MC/CD'));
bands.addBand(new Band('One Direction'));
bands.addBand(new Band('Metallica'));
bands.addBand(new Band('Mago de Oz'));

// Mensajes de Sockets
io.on('connection', client => {
    console.log('Cliente conectado');
    client.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
    // Enviar todas las bandas al cliente que se acaba de conectar
    client.emit('active-bands', bands.getBands());
    // Canal para votar por una banda
    client.on('vote-band', (payload) => {
        bands.voteBand(payload.id);
        io.emit('active-bands', bands.getBands());
    });
    // Agregar una nueva banda
    client.on('add-new-band', payload => {
        bands.addBand(new Band(payload.name));
        io.emit('active-bands', bands.getBands());
    });
    // Eliminar una nueva banda
    client.on('delete-band', payload => {
        bands.deleteBand(payload.id);
        io.emit('active-bands', bands.getBands());
    });
    // client.on('emitir-mensaje', payload => {
    //     // io.emit('new-message', payload); //Emite a todos 
    //     console.log('Mensaje: ', payload);
    //     client.broadcast.emit('flutter-message', payload); //Emite a todos menos al que emitió
    // });
});