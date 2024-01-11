const express = require('express')
const path = require('path')
const app = require('express')()
const server = require('http').createServer(app)
const io = require('socket.io')(server, {
        cors: {
                origin: "*",
        },
})
const mongoose = require('mongoose');
let connectionString = "mongodb+srv://dbUser:dPPEbgZLe0oPy8Oh@atlascluster.swmtc.mongodb.net/?retryWrites=true&w=majority"
mongoose.connect(connectionString).then(() =>
{
        console.log('Connected to the database ')
})
        .catch((err) =>
        {
                console.error(`Error connecting to the database. n${err}`);
        })
const usersModel = require('./public/models/schemas')
let id = undefined
let connectedRooms = {}




app.get('/', (req, res) =>
{
        res.sendFile(__dirname + '/public/indexFiles/html/index.html');
});

app.set('views engine', 'ejs')
app.use('/indexFiles', express.static('public/indexFiles'))
app.use('/roomSettingsFiles', express.static('public/roomSettingsFiles'))
app.use('/roomDashboardFiles', express.static('public/roomDashboardFiles'))
app.use('/gameFiles', express.static('public/gameFiles'))
app.use('/statsFiles', express.static('public/statsFiles'))
app.use('/globalFiles', express.static('public/globalFiles'))


io.on("connection", (socket) =>
{


        socket.on("create room", (roomId, userProfileInformation) =>
        {
                connectedRooms[roomId] =
                {

                        "connectedPlayersDetails":
                        {

                                [socket.id]:
                                {

                                        googleId: userProfileInformation["googleId"],
                                        name: userProfileInformation["name"],
                                        readyState: false,
                                        gameOver: false,
                                        playerNumber: undefined,
                                        score: 0,

                                }
                        },
                        "connectedPlayers": 0,
                        "joinedPlayers": 1,
                        "gameStarted": false,
                        "matchTypeValue": 1,
                        "admin": socket.id
                }

                socket.join(roomId)


        })


        socket.on("join room", (roomId, userProfileInformation) =>
        {


                if (connectedRooms.hasOwnProperty(roomId))
                {
                        if (connectedRooms[roomId]["joinedPlayers"] < connectedRooms[roomId]["matchTypeValue"])
                        {


                                connectedRooms[roomId]["connectedPlayersDetails"][socket.id] =
                                {
                                        googleId: userProfileInformation["googleId"],
                                        name: userProfileInformation["name"],
                                        readyState: false,
                                        gameOver: false,
                                        playerNumber: undefined,
                                        score: 0

                                }
                                connectedRooms[roomId]["joinedPlayers"]++
                                socket.join(roomId)
                                io.to(socket.id).emit("joined room", connectedRooms[roomId]["matchTypeValue"])
                                socket.broadcast.in(roomId).emit("player joined", userProfileInformation.name)
                        }
                        else
                        {
                                io.to(socket.id).emit("joining error", "room is full")
                        }

                }
                else
                {
                        io.to(socket.id).emit("joining error", "room does not exist")

                }
        })


        socket.on("connect player", (roomId, playerIndex, matchTypeValue, userProfileInformation) =>
        {
                id = roomId

                // if (!connectedRooms.hasOwnProperty(roomId))
                // {

                //         connectedRooms[roomId] = {

                //                 "connectedPlayersDetails": {},
                //                 "connectedPlayers": 0,
                //                 "gameStarted": false,
                //                 "matchTypeValue": matchTypeValue,
                //         }
                // }

                // connectedRooms[roomId]["connectedPlayersDetails"][socket.id] = {
                //         googleId: userProfileInformation["googleId"],
                //         name: userProfileInformation["name"],
                //         readyState: false,
                //         gameOver: false,
                //         playerNumber: playerIndex,
                //         score: 0

                // }

                connectedRooms[roomId]["connectedPlayersDetails"][socket.id]["playerNumber"] = playerIndex
                connectedRooms[roomId]["connectedPlayers"]++
                io.to(socket.id).emit("connected player", playerIndex, connectedRooms[roomId]["connectedPlayers"], true)
                socket.broadcast.in(roomId).emit("connected player", playerIndex, connectedRooms[roomId]["connectedPlayers"], false)

        })


        socket.on("disconnect player number", (roomId, playerIndex) =>
        {

                connectedRooms[roomId]["connectedPlayersDetails"][socket.id]["playerNumber"] = undefined
                connectedRooms[roomId]["connectedPlayers"]--
                io.to(socket.id).emit("disconnected player number", playerIndex, true)
                socket.broadcast.in(id).emit("disconnected player number", playerIndex, false)
                console.log("hi")

        })

        socket.on("disconnecting", () =>
        {

                let roomId = [...socket.rooms][1]
                if (roomId != undefined)
                {
                        connectedRooms[roomId]["connectedPlayers"] = 0
                        connectedRooms[roomId]["joinedPlayers"]--
                        connectedRooms[roomId]["matchTypeValue"] = 1
                        delete connectedRooms[roomId]["connectedPlayersDetails"][socket.id]

                        if (connectedRooms[roomId]["JoinedPlayers"] == 0)
                        {
                                delete connectedRooms[roomId]
                        }
                        socket.broadcast.in(roomId).emit("player disconnected")
                }
        })

        socket.on("anyone joined", (roomId) =>
        {
                let values = Object.values(connectedRooms[roomId]["connectedPlayersDetails"])
                let players = []
                values.forEach(element =>
                {
                        players.push(element["name"])
                })
                io.to(socket.id).emit("anyone joined", players)

        })

        socket.on("can i apply settings", (roomId, matchTypeValue) =>
        {
                if (connectedRooms[roomId]["joinedPlayers"] <= matchTypeValue)
                {

                        connectedRooms[roomId]["connectedPlayers"] = 0
                        connectedRooms[roomId]["matchTypeValue"] = matchTypeValue
                        io.to(roomId).emit("yes you can apply settings", matchTypeValue)
                }
                else
                {
                        io.to(socket.id).emit("settings apply error")
                }
        })

        socket.on("player exited game arena", (roomId) =>
        {

                socket.broadcast.in(roomId).emit("player exited game arena")
        })



        socket.on("toggleClass", (roomId, coordinates, hover, playerNumber, blockColor) =>
        {


                socket.broadcast.in(id).emit("toggleClass", coordinates, hover, playerNumber, blockColor)
        })
        socket.on("addClass", (roomId, previous, currentDpTrueCoordinates, playerNumber) =>
        {

                socket.broadcast.in(id).emit("addClass", previous, currentDpTrueCoordinates, playerNumber)

        })

        socket.on("laserBeamRow", (roomId, playerNumber, row, width) =>
        {

                socket.broadcast.in(id).emit("laserBeamRow", playerNumber, row, width)
        })

        socket.on("destroy", (roomId, fullRows, arrayOftotalNoOfBlocksInEachRow, playerNumber, flag) =>
        {

                socket.broadcast.in(id).emit("destroy", fullRows, arrayOftotalNoOfBlocksInEachRow, playerNumber, flag)
        })

        socket.on("anyone connected", (roomId) =>
        {

                if (connectedRooms[roomId]["connectedPlayers"] > 0)
                {
                        let playerIndexes
                        if (connectedRooms[roomId] != undefined)
                        {
                                console.log(Object.values(connectedRooms[roomId]["connectedPlayersDetails"]))
                                playerIndexes = Object.values(connectedRooms[roomId]["connectedPlayersDetails"]).map(element => element["playerNumber"])
                        }
                        io.to(socket.id).emit("anyone connected", playerIndexes)
                }
        })

        socket.on("game over", (roomId, playerIndexValue, score) =>
        {

                connectedRooms[roomId]["connectedPlayersDetails"][socket.id]["gameOver"] = true
                connectedRooms[roomId]["connectedPlayersDetails"][socket.id]["score"] = score
                socket.broadcast.in(roomId).emit("game over", playerIndexValue)

                let values = Object.values(connectedRooms[roomId]["connectedPlayersDetails"])
                let isTrue = values.every(element =>
                {
                        return element["gameOver"]
                })
                if (isTrue)
                {

                        saveToDatabase(roomId)

                }
        })

        socket.on("can i reset", (roomId) =>
        {

                let values = Object.values(connectedRooms[roomId]["connectedPlayersDetails"])
                let isTrue = values.every(element =>
                {

                        return element["gameOver"]
                })
                io.to(roomId).emit("can i reset", isTrue)

                if (isTrue)
                {

                        values.forEach(element =>
                        {
                                element["gameOver"] = false
                                element["readyState"] = false
                        })
                        connectedRooms[roomId]["gameStarted"] = false
                }
        })

        socket.on("update score", (roomId, playerIndexValue, score) =>
        {

                socket.broadcast.in(roomId).emit("update score", playerIndexValue, score)
        })

        socket.on("generatedBlockProperties", (roomId, arrayOfObjectsOfBlockProperties) =>
        {

                socket.broadcast.in(id).emit("generatedBlockProperties", arrayOfObjectsOfBlockProperties)
        })

        socket.on("enter the game arena", (roomId) =>
        {

                socket.broadcast.in(roomId).emit("enter the game arena")
        })

        socket.on("can i start the game", (roomId) =>
        {
                let values = Object.values(connectedRooms[roomId]["connectedPlayersDetails"])

                let areAllPlayersReady = values.every((element) =>
                {
                        if (element["playerNumber"] == 0)
                        {
                                return true
                        }
                        return element["readyState"]
                })
                let isGameStarted = connectedRooms[roomId]["gameStarted"]


                if (!isGameStarted && areAllPlayersReady)
                {

                        connectedRooms[roomId]["gameStarted"] = true
                        io.to(roomId).emit("you can start the game")
                }
        })

        socket.on("can i toggle player ready state", (roomId, playerIndex) =>
        {


                if (!connectedRooms[roomId]["gameStarted"])
                {
                        connectedRooms[roomId]["connectedPlayersDetails"][socket.id]["readyState"] = !connectedRooms[roomId]["connectedPlayersDetails"][socket.id]["readyState"]
                        io.to(roomId).emit("you can toggle player ready state", playerIndex)
                }
                console.log(connectedRooms[roomId]["connectedPlayersDetails"])
        })

        socket.on("retrieve stats data", (googleId) =>
        {
                usersModel.findById(googleId).then(data =>
                {
                        socket.emit("take your data", data)
                })
        })

})


const port = process.env.PORT || 3000

server.listen(port, () =>
{
        console.log(`listening at ${port}`)
})



function saveToDatabase(roomId)
{


        let values = Object.values(connectedRooms[roomId]["connectedPlayersDetails"])
        let game = {
                matchType: connectedRooms[roomId]["matchTypeValue"],
                playersDetails: []
        }
        values.forEach(element =>
        {
                game.playersDetails.push({
                        name: element["name"],
                        playerNumber: element["playerNumber"],
                        score: element["score"]
                })
        })

        values.forEach(element =>
        {


                usersModel.findById(element["googleId"]).then(data =>
                {
                        if (data == null)
                        {
                                let totalData = new usersModel({
                                        _id: element["googleId"],
                                        name: element["name"],
                                        games: [game]
                                });

                                totalData.save().then(data => console.log(data, "ji"))
                        }
                        else
                        {
                                usersModel.findOneAndUpdate({ _id: element["googleId"] }, { $push: { games: game } }, { new: true }).then(data => console.log(data))
                        }
                })

        })



}


