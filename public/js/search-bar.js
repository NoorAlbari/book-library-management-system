

const searchBarInput = document.querySelector('#search-input')
const booksElements = document.querySelectorAll('.book')



searchBarInput.addEventListener('input', (event) => {
    const input = event.target.value.toLowerCase()
   

    booksElements.forEach((book) => {
        const h2BookElement = book.querySelector('h2')
        const wantedBook =  h2BookElement.textContent.toLowerCase()
       

        if (wantedBook.includes(input)) {
            book.style.display = ''
        } else {
            book.style.display = 'none'
        }

    })
})


