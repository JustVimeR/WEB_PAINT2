const connection = new signalR.HubConnectionBuilder()
    .withUrl("/drawingBoardHub")
    .build();

connection.on("BoardCleared", function () {
    context.clearRect(0, 0, canvas.width, canvas.height);
});

connection.start().catch(err => console.error(err.toString()));

let canvas = document.getElementById("drawingCanvas");
let context = canvas.getContext("2d");

canvas.addEventListener("mousedown", function (event) {
    draw(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
});

canvas.addEventListener("mousemove", function (event) {
    if (event.buttons === 1) {
        let lineWidth = document.getElementById("lineWidthSelect").value;
        let r = document.getElementById("redRange").value;
        let g = document.getElementById("greenRange").value;
        let b = document.getElementById("blueRange").value;
        let color = `rgb(${r},${g},${b})`;
        draw(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop, lineWidth, color);
        connection.invoke("SendDrawing", (event.clientX - canvas.offsetLeft) + "," + (event.clientY - canvas.offsetTop) + "," + lineWidth + "," + color).catch(err => console.error(err.toString()));

    }
});


connection.on("ReceiveDrawing", function (data) {
    let parts = data.split(",");
    let x = parseFloat(parts[0]);
    let y = parseFloat(parts[1]);
    let receivedLineWidth = parseFloat(parts[2]);
    let receivedColor = parts[3];
    draw(x, y, receivedLineWidth, receivedColor);
});



function draw(x, y, lineWidth, color) {
    context.lineWidth = lineWidth;
    context.strokeStyle = color;
    context.fillStyle = color;
    context.lineJoin = "round";
    context.lineCap = "round";
    context.beginPath();
    context.arc(x, y, lineWidth / 2, 0, 2 * Math.PI);
    context.fill();
    context.moveTo(x, y);
    context.lineTo(x, y);
    context.stroke();
}

document.getElementById("clearButton").addEventListener("click", function () {
    context.clearRect(0, 0, canvas.width, canvas.height);
    connection.invoke("ClearBoard").catch(err => console.error(err.toString()));
});

function updateColorDisplay() {
    let r = document.getElementById("redRange").value;
    let g = document.getElementById("greenRange").value;
    let b = document.getElementById("blueRange").value;
    let color = `rgb(${r},${g},${b})`;
    document.getElementById("colorDisplay").style.backgroundColor = color;
}

document.getElementById("redRange").addEventListener("input", updateColorDisplay);
document.getElementById("greenRange").addEventListener("input", updateColorDisplay);
document.getElementById("blueRange").addEventListener("input", updateColorDisplay);
