
const qrCodeEvents = (socket, io) => {

    socket.on('displayQrCode', async(data) => {
        socket.join('QrCodePage')
    })

    socket.on('absenSuccess', async(data) => {
        socket.to('QrCodePage').emit('regenerate')
    })
}

module.exports = qrCodeEvents