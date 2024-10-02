const canvas = document.querySelector("canvas"),
toolBtns = document.querySelectorAll(".tool"),
fillcolor = document.querySelector("#fill-color"),
sizeslider= document.querySelector("#size-slider"),
colorBtns = document.querySelectorAll(".colors .option"),
colorPicker= document.querySelector("#color-picker"),
clearcanvas= document.querySelector(".clear-canvas"),
saveImage= document.querySelector(".save-image"),
ctx = canvas.getContext("2d");

let prevmouseX,prevmouseY, snapshot,
isDrawing=false,
selectedTool="brush",
brushWidth=3
selectedColor="#000";

const setCanvasbackground=()=>{
    ctx.fillStyle="#fff";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle=selectedColor;
}

window.addEventListener("load",()=>{
    canvas.width=canvas.offsetWidth;
    canvas.height=canvas.offsetHeight;
    setCanvasbackground();
})

const drawRect=(e)=>{
    if(!fillcolor.checked){
        return ctx.strokeRect( e.offsetX, e.offsetY, prevmouseX - e.offsetX, prevmouseY - e.offsetY);
    }
    ctx.fillRect( e.offsetX, e.offsetY, prevmouseX - e.offsetX, prevmouseY - e.offsetY);
}

const drawCircle=(e)=>{
    ctx.beginPath();
    let radius=Math.sqrt(Math.pow((prevmouseX-e.offsetX),2)+Math.pow((prevmouseY-e.offsetY),2));
    ctx.arc(prevmouseX,prevmouseY,radius,0,2*Math.PI);
    fillcolor.checked?ctx.fill():ctx.stroke();
}

const drawTri=(e)=>{
    ctx.beginPath();
    ctx.moveTo(prevmouseX,prevmouseY);
    ctx.lineTo(e.offsetX,e.offsetY);
    ctx.lineTo(prevmouseX*2-e.offsetX,e.offsetY);
    ctx.closePath();
    fillcolor.checked?ctx.fill():ctx.stroke();
}

const startDraw=(e)=>{
    isDrawing=true;
    prevmouseX = e.offsetX;
    prevmouseY = e.offsetY;
    ctx.beginPath();
    ctx.strokeStyle=selectedColor;
    ctx.fillStyle=selectedColor;
    ctx.lineWidth=brushWidth;
    snapshot=ctx.getImageData(0,0,canvas.width,canvas.height);
}

const drawing =(e)=>{
    if(!isDrawing) return;
    ctx.putImageData(snapshot,0,0);
    if(selectedTool==="brush" || selectedTool==="eraser"){
        ctx.strokeStyle=selectedTool==="eraser"? "#fff":selectedColor;
        ctx.lineTo(e.offsetX,e.offsetY);
        ctx.stroke();
    }
    else if (selectedTool==="rectangle") {
        drawRect(e);
        
    }else if (selectedTool==="circle") {
        drawCircle(e);
        
    } else if (selectedTool==="triangle") {
        drawTri(e);
        
    }else {
        
    }

}

toolBtns.forEach(btn =>{
    btn.addEventListener("click",()=>{
        document.querySelector(".options .active").classList.remove("active");
        btn.classList.add("active");
        selectedTool=btn.id;
        console.log(selectedTool);
    });
});

sizeslider.addEventListener("change",()=>brushWidth=sizeslider.value);
colorBtns.forEach(btn=>{
    btn.addEventListener("click",()=>{
        document.querySelector(".options .selected").classList.remove("selected");
        btn.classList.add("selected");
        console.log(btn);
        selectedColor=window.getComputedStyle(btn).getPropertyValue("background-color");
    })
})

colorPicker.addEventListener("change",()=>{
    colorPicker.parentElement.style.background=colorPicker.value;
    colorPicker.parentElement.click();
});

clearcanvas.addEventListener("click",()=>{
    ctx.clearRect(0,0,canvas.width,canvas.height);
    setCanvasbackground();
})
saveImage.addEventListener("click",()=>{
    const link=document.createElement("a");
    link.download=`${Date.now()}.jpg`;
    link.href=canvas.toDataURL();
    link.click();
})

canvas.addEventListener("mousemove",drawing);
canvas.addEventListener("mousedown",startDraw);
canvas.addEventListener("mouseup",()=>isDrawing=false);