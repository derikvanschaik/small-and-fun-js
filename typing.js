
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
    }, 500); // flashes every half second 
}



window.addEventListener("load", () =>{
    const textOut = document.getElementById("text"); 
    // global variables to game 
    let cursor = 0; 
    let cursorAnimate; // points to a setInterval function for animating the cursor flash
    let word = 'The red Below made me eat tonight. Then they were cool.'; 
    let lastCharCorrect = true; // boolean variable used for styling characters red if wrong 
    let mistakeCount = 0; // tracks number of mistakes

    // wrap each character in word into span elements 
    textOut.innerHTML = word.split("")
                            .map((char, i) =>`<span id="${i}" >${char}</span>` )
                            .join("");
    // init textoutput to be colored differently on the init cursor 
    document.getElementById("0").style.backgroundColor = 'black';
    document.getElementById("0").style.color = 'white';


    // animate flashing cursor 
    cursorAnimate = animateFlashingCursor(cursor); 

    window.addEventListener("keydown", (event) =>{
        // outof bounds 
        if ( !(cursor >= 0 && cursor < word.length -1 ) ){ 
            return; 
        }
        console.log(event.key); 
        if (event.key === word[cursor]){ 
            // stops flashing cursor animation 
            if (cursorAnimate){
                clearInterval(cursorAnimate);  
            }
            const lastChar = document.getElementById(`${cursor++}`); 
            // reset the last char cursor  
            lastChar.style.backgroundColor = null;
            // if last char incorrect style char red 
            lastChar.style.color = lastCharCorrect? null: 'red';
            // color new cursor 
            const curChar = document.getElementById(`${cursor}`); 
            curChar.style.backgroundColor = 'black';
            curChar.style.color = 'white';
            // animate flashing cursor for now updated cursor 
            cursorAnimate = animateFlashingCursor(cursor);
            lastCharCorrect = true; 
        }else if (event.key === "Shift" || event.key === "CapsLock"){ 
            // if we do not account for shifts then user will get all capitalized 
            // chars incorrectly identified as wrong 
            if (lastCharCorrect){
                lastCharCorrect = true; 
            } 
        }else if (event.key === "Backspace"){
             const lastChar = document.getElementById(`${cursor--}`);
              // stops flashing cursor animation 
            if (cursorAnimate){
                clearInterval(cursorAnimate);   
            }
            // reset the last char cursor  
            lastChar.style.backgroundColor = null;
            // if last char incorrect style char red 
            lastChar.style.color = lastCharCorrect? null: 'red';
            // color new cursor 
            const curChar = document.getElementById(`${cursor}`); 
            curChar.style.backgroundColor = 'black';
            curChar.style.color = 'white';
            // animate flashing cursor for now updated cursor 
            cursorAnimate = animateFlashingCursor(cursor); 
        }else{
            lastCharCorrect = false; 
            mistakeCount++; 
        }         
    }); 
}); 