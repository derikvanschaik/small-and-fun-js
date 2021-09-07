
const animateFlashingCursor = (cursor) =>{  
    return setInterval( ()=>{
        const curChar = document.getElementById(`${cursor}`); 
        if (curChar.style.backgroundColor){ 

            curChar.style.backgroundColor = null;
            curChar.style.color = null;
        }else{
            curChar.style.backgroundColor = "black";
            curChar.style.color = "white"; 
        }
    }, 350); // flashes every 350 milliseconds 
}

const calculateWpm = (startMilliseconds, numWords) =>{ 
    const endMilliseconds = Date.now(); 
    const secondsElapsed = (endMilliseconds/1000) - (startMilliseconds/1000 );  
    const minutes =secondsElapsed / 60; 
    return Math.floor( numWords / minutes ); // returns wpm 
}

window.addEventListener("load", () =>{
    const textOut = document.getElementById("text"); 
    // global variables to game 
    let cursor = 0; 
    let cursorAnimate; // points to a setInterval function for animating the cursor flash
    let word = 'The red Below made me eat tonight. Then they were cool.'; 
    let lastCharCorrect = true; // boolean variable used for styling characters red if wrong 
    let mistakeCount = 0; // tracks number of mistakes
    let startedTyping = false;
    let startMilliseconds; // tracking for wpm 

    // wrap each character in word into span elements 
    // Apparently this is unsafe to do according to https://stackoverflow.com/questions/1358810/how-do-i-change-the-text-of-a-span-element-using-javascript
    textOut.innerHTML = word.split("")
                            .map((char, i) =>`<span id="${i}" >${char}</span>` ) 
                            .join("");
    // init textoutput to be colored differently on the init cursor 
    document.getElementById("0").style.backgroundColor = 'black';
    document.getElementById("0").style.color = 'white'; 


    // animate flashing cursor 
    cursorAnimate = animateFlashingCursor(cursor);

    window.addEventListener("keyup", ()=>{
        if (cursorAnimate){
            return; 
        }
        cursorAnimate = animateFlashingCursor(cursor); 
    }); 

    window.addEventListener("keydown", (event) =>{ 
        // update error count 
        document.getElementById("error-count").textContent = `Errors: (${mistakeCount})`;
        // user has started typing words 
        if (!startedTyping){
            // calculate current date time for wpm
            startMilliseconds = Date.now(); 
            console.log("starting seconds!", startMilliseconds); 
            startedTyping = true; 
        }
        // user has finished typing words
        if (cursor === word.length -1){ 
            // update wpm
            const numWords = word.split(" ").length; 
            const wpm = calculateWpm(startMilliseconds, numWords);  
            document.getElementById("speed").textContent = `Speed: ${wpm} wpm`; 
            //  reset variables 
            mistakeCount = 0; 
            startedTyping = false;
            // undo styling on last char 
            document.getElementById(`${cursor}`).style.backgroundColor = null; 
            document.getElementById(`${cursor}`).style.color = null; 
            // reset cursor 
            cursor = 0;
            // color first char
            document.getElementById(`${cursor}`).style.backgroundColor = 'black'; 
            document.getElementById(`${cursor}`).style.color = 'white';
            // clear flashing animation 
            clearInterval(cursorAnimate); 
            // flashing cursor 
            cursorAnimate = animateFlashingCursor(cursor);
            // undo all coloring 
            word.split("").forEach( (_, index) => { 
                const span = document.getElementById(`${index}`); 
                span.style.backgroundColor = null; 
                span.style.color = null; 
            }); 
            return;  
        }
        // stops flashing cursor animation  
        if (cursorAnimate){
            // freeze cursor color to be black and white
            const curChar = document.getElementById(`${cursor}`); 
            curChar.style.backgroundColor = 'black';
            curChar.style.color = 'white';
            // stop flashing animation 
            clearInterval(cursorAnimate);
            cursorAnimate = null;    
        }
        if (event.key === word[cursor]){ 

            const lastChar = document.getElementById(`${cursor++}`); 
            // reset the last char cursor  
            lastChar.style.backgroundColor = null;
            // if last char incorrect style char red 
            lastChar.style.color = lastCharCorrect? null: 'red';
            // color new cursor 
            const curChar = document.getElementById(`${cursor}`); 
            curChar.style.backgroundColor = 'black';
            curChar.style.color = 'white';
            lastCharCorrect = true; 

        }else if (event.key === "Shift" || event.key === "CapsLock"){ 
            // if we do not account for shifts then user will get all capitalized 
            // chars incorrectly identified as wrong 
            if (lastCharCorrect){
                lastCharCorrect = true; 
            } 
        }else if (event.key === "Backspace"){ 
             const lastChar = document.getElementById(`${cursor--}`); 
            // reset the last char cursor  
            lastChar.style.backgroundColor = null;
            lastChar.style.color = null;
            // color new cursor 
            const curChar = document.getElementById(`${cursor}`);  
            curChar.style.backgroundColor = 'black';
            curChar.style.color = 'white';
        }else{
            lastCharCorrect = false;  
            mistakeCount++;  
            document.getElementById("error-count").textContent = `Errors: (${mistakeCount})`;    
        }         
    }); 
}); 