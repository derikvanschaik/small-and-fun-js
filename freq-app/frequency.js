
const getData = (wordListKeys, wordFreqValues) =>{

    const data = {
        labels: wordListKeys ,
        datasets: [{
          label: 'Word Frequency Analysis', 
          backgroundColor: 'rgb(255, 99, 132)', 
          borderColor: 'rgb(255, 99, 132)',   
          data: wordFreqValues, 
        }]
      };
    return data; 
}

const getConfig = (data) =>{  
    const config = {
        type: 'bar', 
        data: data, 
        options: {
            responsive: false, 
        }
    };
    return config; 
}
const createWordCountDict = (wordList) =>{ 
    let wordCountObj = {}; 
    wordList.forEach( (word) =>{
        if (word in wordCountObj){
            wordCountObj[`${word}`] += 1; 
        }else if (word){ 
            wordCountObj[`${word}`] = 1; 
        } 
    });
    console.log(wordCountObj);  
    return wordCountObj;  
}

const filterPunctuation = (word) =>{ 
    // alphabet 
    const alpha = "abcdefghijklmnopqrstuvwxyz".split("");
    // array of chars 
    const chars = word.split("");

    if (chars.length === 0 ){ 
        return; 
    } 
    // splice indices 
    let start = 0;
    let end = chars.length -1; 
    // if there is any non alpha chars in beginning of word
    while( !alpha.includes( chars[start].toLowerCase()) ){
        start++; 
    }
    // eliminate all non alpha chars at end of word 
    while( !alpha.includes( chars[end].toLowerCase()) ){ 
        end--; 
    }
    // end + 1 as slice extracts up to but not including end 
    return chars.slice(start, end + 1).join("").toLowerCase(); // to lower case to compare equivalent words 

}


// takes a string and returns an array 
const processText = (text, splitChar, callback ) =>{   
    const wordList = text.split(splitChar).map( word=> callback(word) );                         
    return wordList;  
}
const getSortFunction = (sortType, a, b) =>{
    if (sortType === "ascending"){
        return a-b; 
    }
    return b-a; 
    
}
// freqEntryArray: array of arrays, where inner array is [string, int]
// sortCallBack: comparison function depending on if sort is ascending or descending. 
// sortType: string "ascending" or "descending" 
// freqNum: int 
const sortEntries = (freqEntryArray, sortCallBack, sortType, freqNum) =>{
    if (freqNum <= freqEntryArray.length){ 
        return freqEntryArray.sort( (a,b) => sortCallBack(sortType, a[1],b[1])).slice(0, freqNum);  
    }
    return freqEntryArray.sort( (a,b) => sortCallBack(sortType, a[1],b[1])).slice(0, freqEntryArray.length);  
}

window.onload = () =>{  
    
    // globals 
    const canvasContainer = document.getElementById("canvas-container"); 
    let freqNumber = 7; // default 
    let sortType = "descending"; // default 

    // event for generating frequency analysis 
    document.getElementById("button").addEventListener("click", () =>{
        // removes any previously created canvases 
        canvasContainer.replaceChildren();
        // creates new canvas 
        canvas = document.createElement("canvas");  
        canvas.id = "myChart";
        canvas.width = "200"; 
        canvas.height = "250"; 
        canvasContainer.appendChild(canvas);
        // remove line breaks from input in case they copied and pasted from something on web -- count as space 
        const text = document.getElementById("text").value.replace( /[\r\n]+/gm, " " );
        // run word frequency on user input 
        const wordList =  processText( text, " ", filterPunctuation );    
        const wordFreqDict = createWordCountDict( wordList);
        // get maximum for whatever lol 
        
        const wordFreqEntries = sortEntries(Object.entries(wordFreqDict), getSortFunction, sortType, freqNumber)
        console.log("word freq after filter", wordFreqEntries); 
        // 
        const data = getData( wordFreqEntries.map( (entry) => entry[0]), wordFreqEntries.map( (entry) => entry[1]) );  
        // creates canvas with data 
        const myChart = new Chart( 
            document.getElementById('myChart'), 
            getConfig(data)   
          );
         
    }); 
     
    
}