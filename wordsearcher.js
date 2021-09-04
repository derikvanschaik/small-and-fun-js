
// recursive function used in wordsearcheralgorithm 
const horizSearch = (i, j, idx, array, arrayM, word, matched) =>{ 
    // base case 1 
    if (j+idx >= arrayM || idx >= word.length){
        const foundWord = idx >= word.length; 
        return foundWord;  
    }
    // base case 2 
    if (word[idx].toLowerCase() !== array[i][j+idx].toLowerCase() ){
        return false; 
    }
    // else keep iterating 
    matched.push( [i, j+idx]);  
    idx++;
    return horizSearch(i, j, idx, array, arrayM, word, matched);     
}

// recursive function used in wordsearcheralgorithm -- note changes like arrayN (row length ) from arrayM  (col length)
const vertSearch = (i, j, idx, array, arrayN, word, matched) =>{
        // base case 1 
        if (i+idx >= arrayN || idx >= word.length){
            const foundWord = idx >= word.length; 
            return foundWord;  
        }
        // base case 2 
        if (word[idx].toLowerCase() !== array[i +idx][j].toLowerCase() ){
            return false; 
        }
        // else keep iterating 
        matched.push( [i +idx, j]);  
        idx++;
        return vertSearch(i, j, idx, array, arrayN, word, matched);     

}
// recursive function used in wordsearcheralgorithm 
const leftToRightDiagSearch = (row, col, idx, array, arrayN, arrayM, word, matched) =>{ 
    // base case 1 
    if (row>= arrayN || col>=arrayM || idx >= word.length){ 
        const foundWord = idx >= word.length; 
        return foundWord;  
    }
    // base case 2 
    if (word[idx].toLowerCase() !== array[row][col].toLowerCase() ){ 
        return false; 
    }
    // else keep iterating 
    matched.push( [row++, col++]);   // increment row and cols 
    idx++;
    return leftToRightDiagSearch(row, col, idx, array, arrayN, arrayM, word, matched);      

}
// recursive function used in wordsearcheralgorithm 
const rightToLeftDiagSearch = (row, col, idx, array, arrayN, arrayM, word, matched) =>{  
    // base case 1 
    if (row >= arrayN || col < 0 || idx >= word.length){ 
        const foundWord = idx >= word.length; 
        return foundWord;  
    }
    // base case 2 
    if (word[idx].toLowerCase() !== array[row][col].toLowerCase() ){ 
        return false; 
    }
    // else keep iterating 
    matched.push( [row++, col--]);   // increment row but decrement col  
    idx++;
    return rightToLeftDiagSearch(row, col, idx, array, arrayN, arrayM, word, matched);      

}

// returns false if could not find word
// otherwise returns the coordinates in the array
// which are where the word lies within the array.
// params: arrayN - rows, arrayM - num of cols. 
const wordSearcherAlgorithm = (word, array, arrayN, arrayM) =>{   

    const backwardsWord = word.split("").reverse().join("");

    for (let i = 0; i < arrayN; i++){
        for (let j = 0; j < arrayM; j++){ 

            let matched = []; 
            let row; 
            let col; 
            // searching for horizontal words 
            let idx = 0; 
            if (horizSearch(i, j, idx, array, arrayM, word, matched) ){
                return matched; 
            }
            idx = 0; // reset idx 
            matched = []; // reset array before next type of search 
            if ( horizSearch( i , j, idx, array, arrayM, backwardsWord, matched) ){ 
                return matched; 
            }
            // searching for vertical words 
            idx = 0; 
            matched = [];
            if( vertSearch( i, j,  idx, array, arrayN, word, matched) ){
                return matched; 
            }
            idx = 0; 
            matched = [];
            if( vertSearch( i, j,  idx, array, arrayN, backwardsWord, matched) ){
                return matched; 
            }
            // search for left to right diagonal words 

            idx = 0; // reset idx
            matched = [];
            // init row and col vars
            row = i;
            col = j;
            if (leftToRightDiagSearch(row, col, idx, array, arrayN, arrayM, word, matched) ){
                return matched; 
            }
            idx = 0; // reset idx
            matched = [];
            // reset row and col vars
            row = i;
            col = j;
            if (leftToRightDiagSearch(row, col, idx, array, arrayN, arrayM, backwardsWord, matched) ){  
                return matched; 
            }
            // searching for right to left diagonal words 
            idx = 0; // reset idx
            matched = [];
            // reset row and col vars
            row = i;
            col = j;
            if ( rightToLeftDiagSearch(row, col, idx, array, arrayN, arrayM, word, matched) ){
                return matched; 
            }
            idx = 0; // reset idx
            matched = [];
            // reset row and col vars
            row = i;
            col = j;
            // final search for reverse words in right to left diagonal
            if (rightToLeftDiagSearch(row, col, idx, array, arrayN, arrayM, backwardsWord, matched) ){
                return matched; 
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
            // clear previous error output 
            document.getElementById("error-output").textContent = '';
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
            // clear previous error output 
            document.getElementById("error-output").textContent = '';
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
        // grab user input 
        const searchWord = wordSearcherInput.value;   
        // clear the input 
        wordSearcherInput.value = "";  
        // reset the place holder 
        wordSearcherInput.placeHolder = "Enter word to search in table"; 
        // run word search algorithm 
        const wordSearchValue = wordSearcherAlgorithm(searchWord, array, array.length, array[0].length);
        console.log("word searcher value returned: ", wordSearchValue); 
        if (wordSearchValue){ 
            wordSearchValue.forEach( ([i, j])=>{
                console.log("i and j returned from alg:", i, j); 
                wordSearcherTableArray[i][j].style.color = "red"; 
            } );
            // clear previous error output 
            document.getElementById("error-output").textContent = '';
            return; 
        }
        document.getElementById("error-output").textContent = `Could not find word '${searchWord}'`; 
    }

    
}