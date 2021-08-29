
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
    if (orientation == 5){
        for (let i = 0; i < word.length; i++){
            array[i][i] = word.charAt(i).toUpperCase(); 
        }

    }
    // diag left (top right corner to bott left corner)
    if (orientation == 4){
        for( let i =0, j= word.length-1; i < word.length; i++, j--){
            array[i][j] = word.charAt(i).toUpperCase(); 
        }

    }
    // down (word goes from top to bottom)
    if (orientation == 3){
        let j = random(word.length-1); // choose random col 
        for (let i =0; i < word.length; i++){
            array[i][j] = word.charAt(i).toUpperCase();  
        }

    }
    // up (word goes from bottom to top)
    if (orientation == 2){  
        let j = random(word.length-1); 
        for (let i = word.length-1; i >= 0; i--){
            array[i][j] = word.charAt(word.length - i -1).toUpperCase();
        }
    }
    //right (word goes from left to right) 
    if (orientation == 1){
        let i = random(word.length -1);
        for(let j = 0; j < word.length; j++){
            array[i][j] = word.charAt(j).toUpperCase(); 
        } 
        
    }
    // left (word goes from right to left)
    if (orientation == 0){
        let i = random(word.length-1);
        for( let j = word.length-1; j >= 0; j--){
            array[i][j] = word.charAt(word.length-j -1).toUpperCase();   
        } 
    }

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

const create_word_search = (word, root) =>{
    let array = create_array(word);
    choose_word_orientation(word.length); 
    array = fill_array(array); 
    put_word(word, array, choose_word_orientation() );
    const tableElement = create_table_from_array(array);
    root.appendChild(tableElement); 
}
window.onload = () =>{
    const testerWord = 'rich'; // for testing and creation
    const root = document.getElementById("root"); 
    create_word_search(testerWord, root);
}
