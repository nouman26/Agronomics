module.exports = ()=>{
     const alphabet = 'aaabbbcccdddeeefffggghhhiiijjjkkklllmmmnnnooopppqqqrrrssstttuuuvvvwwwxxxyyyzzz';
     let random1 = Array.from({ length: 3 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join('');
     let random2 = Array.from({ length: 3 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join('');
     
     let my_string = random1+Date.now()+random2;
     
     return my_string;
}