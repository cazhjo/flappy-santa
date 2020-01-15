fetch('About.txt')
.then(response => response.text())
.then(myText => {
    document.getElementById('textArea').innerHTML = myText;
})
.catch(error => console.error(error));