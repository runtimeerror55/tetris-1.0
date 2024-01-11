let socket = io()
socket.on("connect", () =>
{
    console.log(socket.id)
    socketId = socket.id
})

socket.on("take your data", (payload) =>
{
    insertStatsHtml(payload)
    transitionClose()
})