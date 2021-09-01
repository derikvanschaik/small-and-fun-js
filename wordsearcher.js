
// returns false if could not find word
// otherwise returns the coordinates in the array
// which are where the word lies within the array.
// params: arrayN - rows, arrayM - num of cols. 
const wordSearcherAlgorithm = (word, array, arrayN, arrayM) =>{   

    console.log("serching for ", word); 
    const backwardsWord = word.split("").reverse().join("");
    let coordinatePairs = []; 
    for (let i = 0; i < arrayN; i++){
        for (let j = 0; j < arrayM; j++){ 
            // checking forward words 
            let idx = 0;
            while( word[idx].toLowerCase() === array[i][j + idx].toLowerCase() ){

                coordinatePairs.push( [i, j+idx]); // increment idx
                idx++; 
                
                if (idx >= word.length){
                    return coordinatePairs; // we found it 
                }
                if ( (j+idx >= arrayM ) ){ 

                    break; // exit out loop 
                }
            }
            coordinatePairs = []; // reset array before next type of search 

            idx = 0; // reset idx 
            // checking backwards words 
            // console.log('checking backwards word'); 
            while( backwardsWord[idx].toLowerCase() === array[i][j + idx].toLowerCase() ){ 
                
                coordinatePairs.push( [i, j+idx]); // increment idx  
                idx++; 
                if (idx >= word.length){
                    return coordinatePairs; // we found it  
                }
                if ( (j+idx >= arrayM ) ){ 

                    break; // exit out loop 
                }
            }
            
            coordinatePairs = []; // reset array
            idx = 0; 
            // checking for straight line words - iterate through rows for each columns
            while(word[idx].toLowerCase() == array[i + idx][j].toLowerCase() ){
                coordinatePairs.push( [i +idx, j]);
                idx++;  // increment idx 
                if (idx >= word.length){
                    return coordinatePairs; 
                }
                if ( (i+ idx>= arrayN ) ){ // row error  //??
                    break; // exit out the loop 
                }
            }
            coordinatePairs = [];
            // checking for straight line words that are backwards
            // aka straigth line up words 
            // - iterate through rows for each columns
            idx = 0;
            while(backwardsWord[idx].toLowerCase() == array[i + idx][j].toLowerCase() ){
                coordinatePairs.push( [i + idx, j]);
                idx++; 
                if (idx >= word.length){
                    console.log("found your word in straight line down backwards words");
                    return coordinatePairs; 
                }
                if ( (i+ idx>= arrayN ) ){ // row error  //??
                    break; // exit out the loop 
                }
            }
            coordinatePairs = [];  
            // checking diagonals which go from left to right
            idx = 0; 
            let row = i; 
            let col = j; 
            while( row < arrayN && col < arrayM){

                if (word[idx].toLowerCase() === array[row][col].toLowerCase() ){
                    coordinatePairs.push([row++, col++]); // increment after appending 
                    idx++;
                    if (idx >= word.length){ 
                        return coordinatePairs; // found in diagonal  
                    }
                }else{
                    break; 
                }
            }
            coordinatePairs = [];
            // checking diagonals left to right - reverse word 
            idx = 0; 
            row = i; 
            col = j; 
            while( row < arrayN && col < arrayM){

                if (backwardsWord[idx].toLowerCase() === array[row][col].toLowerCase()){
                    coordinatePairs.push([row++, col++]); // increment after appending 
                    idx++;
                    if (idx >= word.length){
                        return coordinatePairs; // found in diagonal  
                    }
                }else{
                    break; 
                }
            }
            coordinatePairs = [];
            // checking for diagonals that go from right to left 
            idx = 0;
            row = i; 
            col = j; 
            while( row < arrayN && col >= 0 ){
                if ( word[idx].toLowerCase() === array[row][col].toLowerCase()){  
                    coordinatePairs.push([row, col]); 
                    row++; 
                    col--; // we decrement the column 
                    idx++;  
                    if (idx >= word.length){
                        return coordinatePairs; 
                    }
                }else{
                    break; 
                }
            }
            coordinatePairs = []; 
            // checking for diagonals that go from right to left 
            idx = 0;
            row = i; 
            col = j; 
            while( row < arrayN && col >= 0 ){
                if ( backwardsWord[idx].toLowerCase() === array[row][col].toLowerCase()){ 
                    coordinatePairs.push([row, col]); 
                    row++; 
                    col--; // we decrement the column 
                    idx++;  
                    if (idx >= word.length){
                        return coordinatePairs; 
                    }
                }else{
                    break; 
                }
            }


        }
    }
    return false; // did not find word  
    
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
    [array, wordSearcherTable, wordSearcherTableArray ] = initWordSearcher(4, 4, wordSearcherTable,root, array); 

    wordSearcherTableM.oninput = () =>{
        if (! (wordSearcherTableN.value && wordSearcherTableM.value) ){
            return; 
        }
        if (wordSearcherTable){
            root.removeChild(wordSearcherTable); 
        }
        [array, wordSearcherTable, wordSearcherTableArray ] = initWordSearcher(
            wordSearcherTableN.value, wordSearcherTableM.value, wordSearcherTable,root, array
            );
    }
    wordSearcherTableN.oninput = () =>{
        if (! (wordSearcherTableN.value && wordSearcherTableM.value) ){
            return; 
        }
        if (wordSearcherTable){
            root.removeChild(wordSearcherTable);  
        }
        [array, wordSearcherTable, wordSearcherTableArray ] = initWordSearcher(
            wordSearcherTableN.value, wordSearcherTableM.value, wordSearcherTable,root, array
            );
    }

    wordSearcherButton.onclick = () =>{ 
        if (!wordSearcherInput.value){ 
            return wordSearcherInput.placeHolder = "Please return a value"; 
        }
        wordSearcherInput.placeHolder = "Enter word to search in table"; 
        const wordSearchValue = wordSearcherAlgorithm(wordSearcherInput.value, array, array.length, array[0].length); 
        if (wordSearchValue){ 
            wordSearchValue.forEach( ([i, j])=>{
                console.log("i and j returned from alg:", i, j); 
                wordSearcherTableArray[i][j].style.color = "red"; 
            } ); 
            return; 
        }
        console.log("could not find word: ", wordSearcherInput.value); 
    }

    
}