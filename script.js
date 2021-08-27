const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth * 0.98;
canvas.height = window.innerHeight * 0.99;

canvas.onmousedown = canvasClick;
window.onmouseup = mouseUp;
canvas.onmousemove = dragCircle;

let previousSelectedFigure;
let isEnter;
let isDragging = false;
let initialState = [{
    x: window.innerWidth * 0.2,
    y: window.innerHeight * 0.25,
    radiusX: 100,
    radiusY: 50,
    isSelected: false,
    figure: 'elipse'
}, {
    x: window.innerWidth * 0.15,
    y: window.innerHeight * 0.4,
    w: 200,
    h: 100,
    isSelected: false,
    figure: 'rect'
}];

if (localStorage.figures) {
    figures = JSON.parse(localStorage.figures)
    figures.forEach(figure => {
        if (figure.isSelected) {
            figure.isSelected = false
        }
    })
} else figures = [{ ...initialState[0] }, { ...initialState[1] }]

drawFigures();

function canvasClick(event) {
    let clickX = event.pageX - canvas.offsetLeft;
    let clickY = event.pageY - canvas.offsetTop;
    for (let i = figures.length - 1; i >= 0; i--) {
        let figure = figures[i];
        if (figure.figure == 'elipse') {
            let e = Math.sqrt(1 - Math.pow(figure.radiusY, 2) / Math.pow(figure.radiusX, 2))
            let clickDistanceFromCenter = Math.sqrt(Math.pow(figure.x - clickX, 2) + Math.pow(figure.y - clickY, 2))
            let accessDistanceFromCenter = figure.radiusY / Math.sqrt(1 - Math.pow(e, 2) * Math.pow((figure.x - clickX) / clickDistanceFromCenter, 2))
            if (clickDistanceFromCenter <= accessDistanceFromCenter) {
                isDragging = true;
                if (previousSelectedFigure != null) previousSelectedFigure.isSelected = false;
                previousSelectedFigure = figure;
                previousSelectedFigure.isSelected = true;
                figures = figures.filter(item => item.isSelected == false)
                figures.push(figure)
                if (i == 0) {
                    figures.splice(0, 1, { ...initialState[0] }, { ...initialState[1] })
                }
                drawFigures();
                return;
            }
        } else {
            if (clickX > figure.x && figure.x + figure.w > clickX && clickY > figure.y && figure.y + figure.h > clickY) {
                isDragging = true;
                if (previousSelectedFigure != null) previousSelectedFigure.isSelected = false;
                previousSelectedFigure = figure;
                previousSelectedFigure.isSelected = true;

                figures = figures.filter(item => item.isSelected == false)
                figures.push(figure)
                if (i == 1) {
                    figures.splice(0, 1, { ...initialState[0] }, { ...initialState[1] })
                }
                console.log(figures)
                drawFigures();
                return;
            }
        }
    }
}

function mouseUp() {
    isDragging = false;
    if (isEnter == false) {
        figures = figures.filter(item => item.isSelected == false)
        drawFigures();
    }
}

document.addEventListener('keydown', event => {
    if (event.key == 'Delete') {
        figures = figures.filter(item => item.isSelected == false)
        drawFigures();
    }
})

function dragCircle(event) {
    if (previousSelectedFigure != null) {
        if (previousSelectedFigure.figure == 'elipse') {
            if (event.pageX - canvas.offsetLeft < window.innerWidth * 0.3 + previousSelectedFigure.radiusX ||
                event.pageX - canvas.offsetLeft > window.innerWidth * 0.9 - previousSelectedFigure.radiusX ||
                event.pageY - canvas.offsetTop < window.innerHeight * 0.15 + previousSelectedFigure.radiusY ||
                event.pageY - canvas.offsetTop > window.innerHeight * 0.9 - previousSelectedFigure.radiusY) {
                isEnter = false;
            } else isEnter = true;
        } else {
            if (event.pageX - canvas.offsetLeft < window.innerWidth * 0.3 ||
                event.pageX - canvas.offsetLeft > window.innerWidth * 0.9 - previousSelectedFigure.w ||
                event.pageY - canvas.offsetTop < window.innerHeight * 0.15 ||
                event.pageY - canvas.offsetTop > window.innerHeight * 0.9 - previousSelectedFigure.h) {
                isEnter = false;
            } else isEnter = true;
        }
    }

    if (isDragging == true) {
        if (previousSelectedFigure != null) {
            const x = event.pageX - canvas.offsetLeft;
            const y = event.pageY - canvas.offsetTop;
            previousSelectedFigure.x = x;
            previousSelectedFigure.y = y;
            drawFigures();
        }
    }
}

function drawFigures() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    frame();

    figures.forEach(figure => {
        if (figure.figure == 'elipse') {
            ctx.beginPath();
            ctx.ellipse(figure.x, figure.y, figure.radiusX, figure.radiusY, 0, Math.PI * 2, false);
            ctx.fillStyle = 'blue';
            ctx.strokeStyle = "black";
            if (figure.isSelected) {
                ctx.lineWidth = 5;
            }
            else {
                ctx.lineWidth = 1;
            }
            ctx.fill();
            ctx.stroke();
        } else {
            ctx.beginPath();
            ctx.rect(figure.x, figure.y, figure.w, figure.h);
            ctx.fillStyle = 'green';
            ctx.strokeStyle = "black";
            if (figure.isSelected) {
                ctx.lineWidth = 5;
            }
            else {
                ctx.lineWidth = 1;
            }
            ctx.fill();
            ctx.stroke();
        }
    })
    localStorage.setItem('figures', JSON.stringify(figures));
}

function frame() {
    ctx.beginPath();
    ctx.rect(window.innerWidth * 0.1, window.innerHeight * 0.1, window.innerWidth * 0.8, window.innerHeight * 0.05);
    ctx.fillStyle = "#ADD8E6";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fill();

    ctx.beginPath();
    ctx.rect(window.innerWidth * 0.1, window.innerHeight * 0.1, window.innerWidth * 0.8, window.innerHeight * 0.8);
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(window.innerWidth * 0.3, window.innerHeight * 0.1);
    ctx.lineTo(window.innerWidth * 0.3, window.innerHeight * 0.9);
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.font = '20px serif'
    ctx.fillStyle = 'black';
    ctx.fillText('Figures', window.innerWidth * 0.18, window.innerHeight * 0.13)

    ctx.font = '20px serif'
    ctx.fillStyle = 'black';
    ctx.fillText('Canvas', window.innerWidth * 0.6, window.innerHeight * 0.13)
}