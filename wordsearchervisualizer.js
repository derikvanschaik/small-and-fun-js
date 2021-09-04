
// params: arrayN - rows, arrayM - num of cols. 
const wordSearcherAlgorithm = (word, array, arrayN, arrayM, tableArray) =>{   

    let i =0;
    let j = 0; 
    let loop;
    let lastCoord; // array of indices
    let matched = []; //array of pairs of indices
    // idx for each type of loop!
    let horizIdx =0;
    let vertIdx = 0; 
    let increment = true; 

    loop = setInterval( ()=>{
        tableArray[i][j].style.backgroundColor = 'yellow'; 
        if (lastCoord){
            [lastRow, lastCol] = lastCoord; 
            tableArray[lastRow][lastCol].style.backgroundColor = 'white';
        }
        // while loop 
       // this is our first while loop simulator -- checks forward words 
        if (word[horizIdx].toLowerCase() === array[i][j+horizIdx].toLowerCase() ){  
            increment = false;
            tableArray[i][j + horizIdx].style.border = '1px solid grey';
            matched.push( [i, j+horizIdx] ); 
            horizIdx++; 
            if (horizIdx >= word.length){ 
                clearInterval(loop);
                return; 
            }
            if (j+horizIdx >= arrayM){
                console.log("break condition");
                // not sure if needed
                horizIdx = 0;  
                increment = true; 
            }
        
        }else if (word[vertIdx].toLowerCase() === array[vertIdx+i][j].toLowerCase() ){ 
            increment = false;
            tableArray[i + vertIdx][j].style.border = '1px solid grey'; 
            matched.push( [i + vertIdx, j] ); 
            vertIdx++; 
            if (vertIdx >= word.length){  
                clearInterval(loop);
                return; 
            }
            if (i+vertIdx >= arrayN){
                console.log("break condition");
                //not sure if this helps a bug
                vertIdx = 0; 
                increment = true;  
            }

        }
        else{
            vertIdx = 0; 
            horizIdx = 0;
            increment = true; 
        }
        // inner loop simulator -- all while loops have been completed time for next j iteration
        if (increment){
            // unstyle all previously matched cells
            matched.forEach( ([i, j] ) => tableArray[i][j].style.border = null ); 
            lastCoord = [i, j];  
            j++; 
            i += Math.floor(j /arrayM); 
            j = j % arrayM;
        }
        
        if (i>= arrayN){
            console.log("loop finished at", i, j); 
            clearInterval(loop);
            return; 
        } 

    }, 100); 
}

const random = (max) =>{ 
    return Math.floor(
        Math.random() * (max + 1) // +1 makes the random function inclusive   
        ); 
}
const createArray = (n,m) =>{
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");  
    let array = []; 
    for (let i = 0; i < n; i++){
        let row = []; 
        for (let j =0; j< m; j++){
            row.push(
                alphabet[random(alphabet.length -1)]
            ); 
        } 
        array.push(row);   
    }
    return array; 
}
const createTable = (array) =>{ 
    const table = document.createElement("table"); 
    array.forEach( (row) =>{
        const tableRow = document.createElement("tr");
        table.appendChild(tableRow); 
        row.forEach( (character) =>{
            const tableCol = document.createElement("td");
            tableCol.contentEditable = "true"; // this is what allows user to put in their own values 
            tableCol.textContent = character; 
            tableRow.appendChild(tableCol); 
        })
    });
    return table; 
}
// creates 2d array rep of table 
// this lets us index in the same (row, col) manner as 
// with the array where our word values are. 
const createTableElementsArray = (table) =>{
    let tableArray = []; 
    const tableRows = table.querySelectorAll("tr");    
    tableRows.forEach( (tableRow) =>{
        let row = []; 
        const tableCols = tableRow.querySelectorAll("td"); 
        tableCols.forEach( (tableCol) =>{
            row.push(tableCol); 
        }); 
        tableArray.push(row);   
    }); 
    return tableArray; 

}
const createUserEditableTable = (wordSearcherTableArray, array) =>{ 
    // adding event listeners to table
    // this variable fixes the cursor positioning bug 
    // for when user goes up or left in texteditable content
    // the cursor is actually appended to front and not to back
    // so we track their positions in order to account for this 
    let wentUpOrLeft = false;
    for (let i = 0; i < wordSearcherTableArray.length; i++){
        for (let j = 0; j < wordSearcherTableArray[i].length; j++){
            // using add event listener here as we are adding 
            // multiple events to the same element 
            wordSearcherTableArray[i][j].addEventListener("input", () =>{
                array[i][j] = wordSearcherTableArray[i][j].innerText;  
            });
            // for this event we want user to be able to arrows 
            // to navigate through the table to allow for more 
            // smooth user experience.  
            wordSearcherTableArray[i][j].addEventListener("keydown", (event) =>{
                if(event.key === "ArrowDown"){
                    if (i +1 < wordSearcherTableArray.length ){
                        wentUpOrLeft = false;
                        wordSearcherTableArray[i+1][j].focus(); 
                    }
                }
                if(event.key === "ArrowUp"){ 
                    if (i -1 >= 0){
                        wentUpOrLeft = true; 
                        wordSearcherTableArray[i- 1][j].focus();
                    }   
                }
                if(event.key === "ArrowLeft"){
                    if (j - 1 >= 0){
                        wentUpOrLeft = true; 
                        wordSearcherTableArray[i][j -1].focus();
                    }
                }
                if(event.key === "ArrowRight"){  
                    if (j+1 < wordSearcherTableArray[i].length ){
                        if (wentUpOrLeft){
                            wentUpOrLeft = false;
                            return;
                        }
                        wordSearcherTableArray[i][j + 1].focus();
                        
                    } 
                }
            });
        }
    }
}

const initWordSearcher = (tableHeight, tableWidth, wordSearcherTable,root, array) =>{
        array = createArray(tableHeight,tableWidth);
        wordSearcherTable = createTable(array);
         // an array of the table elements in table 
        wordSearcherTableArray = createTableElementsArray(wordSearcherTable); 
        root.appendChild(wordSearcherTable);
        createUserEditableTable(wordSearcherTableArray, array);
        return [array, wordSearcherTable, wordSearcherTableArray]; 
}

window.onload = () =>{
    // dom elements 
    const wordSearcherInput = document.getElementById("word-to-search");
    const root = document.getElementById("word-search-table-container");
    const wordSearcherButton = document.getElementById("search-for-word");
    const wordSearcherTableN  = document.getElementById("table-height");
    const wordSearcherTableM  = document.getElementById("table-width");
    // start with defaults for now 
    let wordSearcherTable;
    let wordSearcherTableArray;
    let array; 
    // init default values -- start with 4 by 4 table for now 
    [array, wordSearcherTable, wordSearcherTableArray ] = initWordSearcher(10, 10, wordSearcherTable,root, array); 

    wordSearcherButton.onclick = () =>{
        const searchWord = wordSearcherInput.value; 
        // run word search algorithm 
        const wordSearchValue = wordSearcherAlgorithm(
            searchWord, array, array.length, array[0].length, wordSearcherTableArray
                            ); 
    }
}