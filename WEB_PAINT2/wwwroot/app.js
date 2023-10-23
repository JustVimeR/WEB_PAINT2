const connection = new signalR.HubConnectionBuilder()
    .withUrl("/drawingBoardHub")
    .build();

connection.start().catch(err => console.error(err.toString()));

let canvas = document.getElementById("drawingCanvas");
let context = canvas.getContext("2d");

canvas.addEventListener("mousedown", function (event) {
    draw(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
});

canvas.addEventListener("mousemove", function (event) {
    if (event.buttons === 1) {
        draw(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
        connection.invoke("SendDrawing", (event.clientX - canvas.offsetLeft) + "," + (event.clientY - canvas.offsetTop)).catch(err => console.error(err.toString()));
    }
});

connection.on("ReceiveDrawing", function (data) {
    let coordinates = data.split(",");
    draw(coordinates[0], coordinates[1]);
});

function draw(x, y) {
    context.beginPath();
    context.arc(x, y, 5, 0, 2 * Math.PI);
    context.fill();
}
