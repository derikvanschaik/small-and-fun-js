// NOT COMPLETED YET -- JUST THE FOUNDATION FOR A WORDSEARCHER
// PROGRAM WHERE USER PUTS IN THEIR WORD AND PROGRAM FINDS IT

// **INCLUSIVE random function**

// returns false if could not find word
// otherwise returns the coordinates in the array
// which are where the word lies within the array.
// params: arrayN - rows, arrayM - num of cols. 
const wordSearcherAlgorithm = (word, array, arrayN, arrayM) =>{ 

    let startRow = 0;  
    let startCol = 0;
    let coordinatePairs = []; 
    for (let i = 0; i < arrayN; i++){
        for (let j = 0; j < arrayM; j++){ 
            // checking forward words 
            let idx = 0;
            startRow = i; 
            startCol = j; 
            while( word[idx].toLowerCase() == array[i][j + idx].toLowerCase() ){  
                coordinatePairs.push( [i, j+idx++]); // increment idx  
                if (idx == word.length){
                    endRow = i; 
                    endCol = j + idx -1;  	
                    return coordinatePairs; // we found it 
                }
                if ( (j+idx >= arrayM ) ){ 

                    break; // exit out loop 
                }
            }
            coordinatePairs = []; // reset array  
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

window.onload = () =>{
    // dom elements 
    const wordSearcherInput = document.getElementById("word-to-search");
    const root = document.getElementById("word-search-table-container");
    const wordSearcherButton = document.getElementById("search-for-word"); 
    let array = createArray(4, 5);
    const wordSearcherTable = createTable(array);  
    root.appendChild(wordSearcherTable);
    const tableElements = wordSearcherTable.querySelectorAll("td");  

    wordSearcherButton.onclick = () =>{
        if (!wordSearcherInput.value){ 
            return console.log('please return a valid value'); 
        }
        const wordSearchValue = wordSearcherAlgorithm(wordSearcherInput.value, array, 4, 5); 
        if (wordSearchValue){ 
            wordSearchValue.forEach( ([i, j])=>{
                const rowLength = array[0].length; 
                const index = (i*rowLength) + j; 
                console.log("index", index); 
                tableElements[index].style.color = 'red';  
            } ); 
            return; 
        }
        console.log("could not find word: ", wordSearcherInput.value); 
    }
    tableElements.forEach( (tableCol, index) =>{
        // Reflects changes user makes in table
        // to corresponding array we run our wordsearch
        // algorithms on 
        tableCol.oninput = ()=>{
            const col = index % array[0].length;
            const row = Math.floor( index/ array[0].length ); 
             array[row][col] = tableCol.innerText;  
             console.log(array[row][col]); 
             console.log(array);   
        }
        // user might be using keys to navigate down and up and left and right in table
        // kind of tedious to just click and write into each textbox in table....   
        tableCol.onkeydown = (event)=>{
            if(event.key === "ArrowDown"){
                if (index + array.length +1 < tableElements.length ){ 
                    tableElements[index + array.length + 1 ].focus();
                }
            }
            if(event.key === "ArrowUp"){ 
                if (index - array.length -1 >= 0){ 
                    tableElements[index - array.length -1].focus();
                }   
            }
            if(event.key === "ArrowLeft"){
                if (index -1 >= 0){
                    tableElements[index -1].focus(); 
                }
            }
            if(event.key === "ArrowRight"){ 
                if (index +1 < tableElements.length){
                    tableElements[index + 1].focus();  
                } 
            }

       }
    }); 
    

    
}