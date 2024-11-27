//code for adding event listener to tools to check which tool was clicked 
/* select the tool
 add addEventListener
 apply changes*/

 //select tool
const pencilelem=document.querySelector("#pencil");//const to not change value
//query selector to select from html
const eraserelem=document.querySelector("#eraser");
const stickyelem=document.querySelector("#sticky");
const uploadelem=document.querySelector("#upload");
const downloadelem=document.querySelector("#download");
const undoelem=document.querySelector("#undo");
const redoelem=document.querySelector("#redo");

//event listener
pencilelem.addEventListener("click",function tellpencil()
{
    console.log("Pencil is clicked");
    
})

eraserelem.addEventListener("click",function telleraser()
{
    console.log("Eraser is clicked");
    
})

stickyelem.addEventListener("click",function tellsticky()
{
    console.log("Sticky Notes is clicked");
    
})

uploadelem.addEventListener("click",function tellupload()
{
    console.log("Upload is clicked");
    
})

downloadelem.addEventListener("click",function telldownload()
{
    console.log("Download is clicked");
    
})

undoelem.addEventListener("click",function tellundo()
{
    console.log("Undo is clicked");
    
})

redoelem.addEventListener("click",function tellredo()
{
    console.log("Redo is clicked");
    
})

// select canvas and give full heigth and width
let canvas=document.querySelector("#board");
canvas.width=window.innerWidth;
canvas.height=window.innerHeight;
let tool=canvas.getContext("2d");

/************tool selector logic****************/
let toolsArr=document.querySelectorAll(".tool");
let currentTool= "pencil";
for(let i=0;i<toolsArr.length;i++)
{
    toolsArr[i].addEventListener("click",function(e)
{
    const toolName = toolsArr[i].id;
    if(toolName== "pencil")
    {
        currentTool="pencil";
        tool.strokeStyle="black";
        tool.lineWidth=2;
    }
    else if(toolName=="eraser")
    {
        currentTool="eraser";
        tool.strokeStyle="white"; 
        tool.lineWidth=20;
    }
    else if(toolName=="sticky")
    {
       currentTool="sticky";
       createSticky();
    }
    else if(toolName=="upload")
    {
        currentTool="upload";
        uploadFile();
    }
    else if(toolName=="download")
    {
       currentTool="download";
       downloadFile();
    }
    else if(toolName=="undo")
    {
        currentTool="undo";
        undoFn();
    }
    else if(toolName=="redo")
    {
        currentTool="redo";
        redoFn();
    }
    
})
}

// //draw something on canvas
// let tool=canvas.getContext("2d");
// //u want to start drawing path part 
// tool.beginPath();
// //starting path of drawing
// tool.moveTo(0,0);
// //ending point | move the pencil to a point
// tool.lineTo(200,200);
// tool.stroke();

// //begin path to change property from previous path
// tool.beginPath();
// //color change
// tool.strokeStyle="red";
// tool.lineWidth=5;

// tool.moveTo(100,100);
// tool.lineTo(150,200);
// tool.stroke();


/*********pencil*****************/
let toolBar=document.querySelector(".toolbar");
let draw=false;

//for undo purpose
let undoStack=[];
let redoStack=[];
canvas.addEventListener("mousedown",function(e)
{
    // console.log("Mouse down",e);
    let sidx=e.clientX;
    let sidy=e.clientY;
    let toolbarheight=getYDelta();
    draw=true;
     //start drawing
 tool.beginPath();
 //from where user has started
 tool.moveTo(sidx,sidy-toolbarheight);
 
 //for undo purpose
 let pointDesc={
    x : sidx ,
    y : sidy-toolbarheight,
    desc : "md"//adding descriptor as mousedown
 }
 //add it in last
 undoStack.push(pointDesc);
})


canvas.addEventListener("mousemove",function(e)
{
    if(draw == false)
    {
        return;
    }
    let eidx=e.clientX;
    let eidy=e.clientY;
    let toolbarheight=getYDelta();
    tool.lineTo(eidx,eidy-toolbarheight);
    tool.stroke();

    //for undo purpose
 let pointDesc={
    x : eidx ,
    y : eidy-toolbarheight,
    desc : "mm"//adding descriptor as mousemove
 }
 //add it in last
 undoStack.push(pointDesc);

})

//when you remove mouse
canvas.addEventListener("mouseup",function(e)
{
    console.log("Mouse up",e);
    draw=false;
    
})


/**************helper function*******************/
//writing our own function to adjust y for drawing (not adjusting )

function getYDelta()
{
    let heightofToolbar=toolBar.getBoundingClientRect().height;
    return heightofToolbar;
}

//this is a common code for create outer shell in sticky as well as for adding upload img on
function createOuterShell()
{
    //creation of elements
    let stickyDiv = document.createElement("div");
    let navDiv=document.createElement("div");
    let closeDiv=document.createElement("div");
    let minimizeDiv=document.createElement("div");
    
    
    //adding of styling from class
    stickyDiv.setAttribute("class","sticky");
    navDiv.setAttribute("class","nav");
    

    closeDiv.innerText="X";
    minimizeDiv.innerText="min";

    //building html structure(ithe tree banel)
    stickyDiv.appendChild(navDiv);
    // stickyDiv.appendChild(textArea);

    navDiv.appendChild(minimizeDiv);
    navDiv.appendChild(closeDiv);

    //to add to this into the page
    // document.body.appendChild(stickyDiv);

    /************************functionality***********************************/
    //code for closing sticky
    closeDiv.addEventListener("click",function()
{
    stickyDiv.remove();
})
    
//this code just minimizes the text area
// let isMinimized=false;    
// minimizeDiv.addEventListener("click",function()
//     {
//         const textArea = stickyDiv.querySelector(".text-area");
//         if (textArea)
//         {textArea.style.display=isMinimized ? "block" :"none";
//             isMinimized=!isMinimized;
//         } 
//     });

let isMinimized = false;    
minimizeDiv.addEventListener("click", function() {
    // Select all child elements of stickyDiv that are not the navigation bar (.nav)
    const childElements = stickyDiv.querySelectorAll(":scope > *:not(.nav)");
    
    // Loop through each child element and toggle its visibility
    childElements.forEach((el) => {
        el.style.display = isMinimized ? "block" : "none";
    });
    
    // Toggle the minimized state
    isMinimized = !isMinimized;
});


//code for moving sticky
let isStickyDown=false;

navDiv.addEventListener("mousedown",function(e)
{
    //initial point
    initialX=e.clientX;
    initialY=e.clientY;
    // console.log("mousedown",initialX,initialY);   
    isStickyDown=true;
})

navDiv.addEventListener("mousemove",function(e)
{
    if(isStickyDown==true)
    {
        //final point
        let finalX=e.clientX;
        let finalY=e.clientY;
        // console.log("mousemove",finalX,finalY);
        
        //distance
        let dx=finalX-initialX;
        let dy=finalY-initialY;
        //moving sticky
        //original top left
        let{top,left}=stickyDiv.getBoundingClientRect()
        stickyDiv.style.top=top+dy+"px";
        stickyDiv.style.left=left+dx+"px";
        initialX=finalX;
        initialY=finalY;
    }
})

navDiv.addEventListener("mouseup",function()
{
    isStickyDown=false;
})
return stickyDiv;
}

/**************create sticky****************/
// 1)static version
//2) how it will be added to ur ui
//3)How it will be moved / its functionality

//helper function for sticky notes
function createSticky()
{
    let stickyDiv=createOuterShell();
    let textArea=document.createElement("textarea");
    textArea.setAttribute("class","text-area");
    //
    stickyDiv.appendChild(textArea);

     // Add the stickyDiv to the document
     document.body.appendChild(stickyDiv);
     
}

//helper function for uploading file
let inputTag=document.querySelector(".input-tag")
// function uploadFile()
// {
//     inputTag.click();
//     console.log("upload file clicked");
    

//     //for file from filepicker(i.e to read file)
//     inputTag.addEventListener("change",function()
// {
//     let data=inputTag.files[0];

//     //to add ui
//     let img=document.createElement("img");
//     //this is a function that converts anything into url
//     let url=URL.createObjectURL(data);
//     // console.log("url",url);
//     img.src=url;
//     img.setAttribute("class","upload-img");

//     //to add it to body
//     document.body.appendChild(img);
//     let stickyDiv=createOuterShell();
//     stickyDiv.appendChild(img);
// })
// }

function uploadFile() {
    // Trigger the file input dialog
    inputTag.click();

    // Listen for file selection
    inputTag.addEventListener(
        "change",
        function () {
            let data = inputTag.files[0]; // Get selected file

            if (data) {
                // Create a new sticky note
                let stickyDiv = createOuterShell();

                // Create an image element for the uploaded file
                let img = document.createElement("img");
                let url = URL.createObjectURL(data);
                img.src = url;
                img.setAttribute("class", "upload-img");

                // Add the image to the sticky note
                stickyDiv.appendChild(img);

                // Append the sticky note to the document body
                document.body.appendChild(stickyDiv);
            }

            // Reset inputTag value for subsequent uploads
            inputTag.value = "";
        },
        { once: true }
    );
}





//helper function for download
function downloadFile()
{
    //create anchor button
    let a=document.createElement("a");
    //set filename to its download attribute
    a.download="file.jpeg";
    //convert board to url
    let url=canvas.toDataURL("image/jpeg;base64");
    //set as href pf anchor
    a.href=url;
    //click anchor
    a.click();
    //remove anchor
    a.remove();
}

//helper function for redraw(this is common for both undo and redo)
function redraw()
{
for(let i=0;i<undoStack.length;i++)
    {
        let {x,y,desc}=undoStack[i];
        if(desc=="md")
        {
            tool.beginPath();
            tool.moveTo(x,y);
        }
        else if(desc=="mm")
        {
            tool.lineTo(x,y);
            tool.stroke();
        }
    }
}

//helper function for undo
function undoFn()
{
    
    if(undoStack.length>0)
    {
        //clear screen
    tool.clearRect(0,0,canvas.width,canvas.height);
        //removal of last point
        redoStack.push(undoStack.pop());
        redraw();
        
    }
}

//helper function for redo

function redoFn()
{
    if(redoStack.length>0)
    {
        //screen clear
        tool.clearRect(0,0,canvas.width,canvas.height);
        undoStack.push(redoStack.pop());
        redraw();
    }
}
