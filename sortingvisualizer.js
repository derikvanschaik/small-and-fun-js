const createRandArray = (length, max) =>{
    randomArray = []; 
    for (let i = 0; i < length; i++){
        randomArray.push( Math.floor(Math.random() * max) );
    }
    return randomArray; 
}

// helper method used in sort functions 
const copyArray = (array, copy) =>{
    for (let i = 0; i < array.length; i++){
        copy.push(array[i]); 
    }
}

// the different stages that the array goes through
// during each iteration of selection sort will be appended into its own array
// in this returned array.
const selectionSortArray = (array) =>{
    let stagesArray = [];
    let stage_i_array = [];
    copyArray(array, stage_i_array)
    stagesArray.push(stage_i_array); // want the init stage in stages array as well. 
    // Extremely well known algorithm taken from GeeksForGeeks. 
   for (let i = 0; i < array.length-1; i++){
       let min_idx = i; 
       for (let j = i + 1; j < array.length; j++){
           if (array[j] < array[min_idx]){
               min_idx = j; 
           }
       }
       // swap 
       let temp = array[min_idx];
       array[min_idx] = array[i];
       array[i] = temp;
       // push stage array to stages array 
       stage_i_array = []; 
       copyArray(array, stage_i_array); 
       stagesArray.push( stage_i_array); 
   }
   return stagesArray; 

}

const insertionSortArray = (array) =>{
    let stagesArray = [];
    let stage_i_array = [];
    copyArray(array, stage_i_array)
    stagesArray.push(stage_i_array); // want the init stage in stages array as well. 
    // Extremely well known algorithm taken from GeeksForGeeks. 
    for (let i = 1; i < array.length; i++){
        let key = array[i];
        let j = i -1; 
        while( j>= 0 && array[j] > key){ 
            array[j+1] = array[j]; 
            j--; 
        }
        array[j+1] = key;
        console.log("insertion sort array at stage "+ i, array); 
        // copy and push cur stage 
        stage_i_array = []; 
        copyArray(array, stage_i_array); 
        stagesArray.push( stage_i_array); 
    }
   return stagesArray; 
}

const clearCanvas = (ctx, width, height) =>{
    ctx.clearRect(0,0, width, height);  
}

 
window.onload = (event) =>{
    // canvas elements and contexts. 
    const selectCanvas = document.getElementById("selection-canvas"); // canvas for selection sort animation
    const insertCanvas = document.getElementById("insertion-canvas");
    const ctx = selectCanvas.getContext('2d');
    const insertCtx = insertCanvas.getContext('2d');
    // other html elements 
    const slider = document.getElementById("range");
    const startAnimation = document.getElementById("animate");
    const input = document.getElementById("input");
    const speedSelector = document.getElementById("animate-speed"); 
    // event handlers 
    slider.oninput = (event) =>{
        document.getElementById("slider-output").textContent = `Or generate random array of length: ${slider.value}`;  
    }
    // for now we will just do this on the button click -- later we can have it reset for any
    // event triggering if we want that. 
    startAnimation.onclick = (event) =>{
        let arrayToSort;
        let animateSpeed = speedSelector.value;  
        if (input.value){
            arrayToSort = input.value.split(",").map( (strNum) =>parseInt(strNum) ); 
        }
        else{
            arrayToSort = createRandArray(slider.value, 100); // length is sliders val
        } 
        rect_width = selectCanvas.width / arrayToSort.length; // float values work i guess 
        let insertArrayToSort = []; 
        copyArray(arrayToSort, insertArrayToSort); // need to maintain reference to init value for insert sort ..
        selectSortArray = selectionSortArray(arrayToSort);
        insertSortArray = insertionSortArray(insertArrayToSort);  
        let cur_stage = 0;

        const animate = setInterval(() =>{
            // animate canvases 
            clearCanvas(ctx, selectCanvas.width, selectCanvas.height);
            clearCanvas(insertCtx, insertCanvas.width, insertCanvas.height);

            selectSortStage = selectSortArray[cur_stage];
            insertSortStage = insertSortArray[cur_stage]; 

            selectSortStage.forEach( (number, index) =>{
                ctx.strokeRect(index*rect_width, selectCanvas.height , rect_width, -number);
            });
            insertSortStage.forEach( (number, index) =>{
                insertCtx.strokeRect(index*rect_width, selectCanvas.height , rect_width, -number); 
            });

            cur_stage++;

            // stop the animation 
            if (cur_stage === selectSortArray.length){
                clearInterval(animate);
                console.log("Animation finished. "); 
            }

        }, animateSpeed); 
    }   

}