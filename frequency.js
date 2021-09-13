
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
        }else{
            wordCountObj[`${word}`] = 1; 
        }
    });
    console.log(wordCountObj);  
    return wordCountObj;  
}
// takes a string and returns an array of words. 
const stripWordsFromText = (text) =>{
    // alphabet plus space char 
    const alphaSpace = "abcdefghijklmnopqrstuvwxyz".split(""); 
    // filters all punctuation out of whatever is given 
    const wordList = text.split(" ")
                        .map( 
        (word) => word.split("").filter( (char) => alphaSpace.includes( char.toLowerCase() )  ).join("")  
                            );
    
    console.log(wordList); 
    return wordList;
    

}

window.onload = () =>{ 
    console.log("loaded!");
    // globals 
    const canvasContainer = document.getElementById("canvas-container");
    // event for generating frequency analysis 
    document.getElementById("button").addEventListener("click", () =>{
        // removes any previously created canvases 
        canvasContainer.replaceChildren(); 
        // creates new canvas 
        canvas = document.createElement("canvas");  
        canvas.id = "myChart";
        canvas.width = "500"; 
        canvas.height = "500"; 
        canvasContainer.appendChild(canvas);
        // run word frequency on user input 
        const wordList =  stripWordsFromText( document.getElementById("text").value );  
        const wordFreqDict = createWordCountDict( wordList);
        const data = getData( Object.keys(wordFreqDict), Object.values(wordFreqDict) ); 
        // creates canvas with data 
        const myChart = new Chart( 
            document.getElementById('myChart'), 
            getConfig(data)   
          );
         
    }); 
     
    
}