
// creates an n x n 2d array for table 
const create_array = (word) =>{
    const n = word.length;
    let wordArray = []; 
    for (let i = 0; i < n; i++){
        let inner = []; 
        for (let j = 0; j < n; j++){
            inner.push(null); // instantiate null array for now 
        }
        wordArray.push(inner); 
    }
    return wordArray;  

}
// helper function for couple of functions 
const random = (max) =>{
    return Math.floor(
        Math.random() * (max) + 0 
        ); 
}
const choose_word_orientation = () =>{
    // orientation mappings: 
    // 0 : left, 1: right, 2: up, 3: down, 4: diagonal left, 5: diagonal right. 
    return random(6);  // return number which reps the orientation. 

}
// fill array with random letters
const fill_array = (array) =>{
    const choices = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");  
    for (let i = 0; i < array.length; i++){
        for (let j = 0; j< array.length; j++){
            array[i][j] = choices[random(choices.length)]; 
        }
    }
    // console.log(array); 
    return array; 
}
const put_word = (word, array, orientation) =>{ 
     // random integer (0-5) 
    // diag right (top left corner to bott right corner)
    let wordIndices = []; // track the indices 
    if (orientation == 5){
        for (let i = 0; i < word.length; i++){
            array[i][i] = word.charAt(i).toUpperCase();
            wordIndices.push([i,i]);   
        }

    }
    // diag left (top right corner to bott left corner)
    if (orientation == 4){
        for( let i =0, j= word.length-1; i < word.length; i++, j--){
            array[i][j] = word.charAt(i).toUpperCase();
            wordIndices.push([i,j]); 
        }

    }
    // down (word goes from top to bottom)
    if (orientation == 3){
        let j = random(word.length-1); // choose random col 
        for (let i =0; i < word.length; i++){
            array[i][j] = word.charAt(i).toUpperCase();
            wordIndices.push([i,j]); 
        }

    }
    // up (word goes from bottom to top)
    if (orientation == 2){  
        let j = random(word.length-1); 
        for (let i = word.length-1; i >= 0; i--){
            array[i][j] = word.charAt(word.length - i -1).toUpperCase();
            wordIndices.push([i,j]); 
        }
    }
    //right (word goes from left to right) 
    if (orientation == 1){
        let i = random(word.length -1);
        for(let j = 0; j < word.length; j++){
            array[i][j] = word.charAt(j).toUpperCase();
            wordIndices.push([i,j]);
        } 
        
    }
    // left (word goes from right to left)
    if (orientation == 0){
        let i = random(word.length-1);
        for( let j = word.length-1; j >= 0; j--){
            array[i][j] = word.charAt(word.length-j -1).toUpperCase();
            wordIndices.push([i,j]);   
        } 
    }
    // console.log("word indices", wordIndices); 
    return wordIndices; // return tracker array 

}
const create_table_from_array = (array) =>{
    const table = document.createElement("table");
    array.forEach( (row) =>{
        const tableRow = document.createElement("tr");
        table.appendChild(tableRow); 
        row.forEach( (character) =>{
            const tableCol = document.createElement("td");
            tableCol.textContent = character; 
            tableRow.appendChild(tableCol); 
        })
    });
    return table; 
}
const highlightWordInTable = (table, wordIndices) =>{ 
    let tableElements = []; 
    const tableRows = table.querySelectorAll("tr");
    tableRows.forEach( (row) =>{
        const cols = row.querySelectorAll("td");
        let tableRow = []; 
        cols.forEach( (col) =>{ 
            tableRow.push(col); 
        }); 
        tableElements.push(tableRow); 
    }); 

    wordIndices.forEach( (list) =>{
        [i, j] = list; // unpack indices 
        // highlight the character of searched word in table 
        tableElements[i][j].style.backgroundColor= '#ADD8E6'

    } )
}

const create_word_search = (word, root) =>{
    let array = create_array(word);
    choose_word_orientation(word.length); 
    array = fill_array(array); 
    const trackerIndices = put_word(word, array, choose_word_orientation() );
    const tableElement = create_table_from_array(array);
    root.appendChild(tableElement);
    return trackerIndices; 
}

window.onload = () =>{
    const root = document.getElementById("root");
    const input = document.getElementById("user-word"); 
    const button = document.getElementById("generate-word-search");
    const findWord = document.getElementById("find-word"); 
    // tracker variable
    let trackerIndices;
    // event handlers 
    button.onclick = () => {
        if (!input.value){
            input.placeholder = "Please enter a word here!";
            return; 
        }
        input.placeholder = "type word here";
        if (root.childNodes){
            root.removeChild(root.childNodes[0]); 
        }
        document.getElementById("find-word").style.visibility = 'visible'; 
        trackerIndices = create_word_search(input.value, root); 
    }
    findWord.onclick = () =>{
        console.log(root.childNodes);  
        highlightWordInTable(root.childNodes[0], trackerIndices);     
    }


}
