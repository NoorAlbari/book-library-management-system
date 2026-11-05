

const searchBarInput = document.querySelector('#search-input')
const booksElements = document.querySelectorAll('.book')



searchBarInput.addEventListener('input', (event) => {
    const input = event.target.value.toLowerCase()
    //console.log(input)

    booksElements.forEach((book) => {
        // console.log(book.textContent)
        const h2BookElement = book.querySelector('h2')
        const wantedBook =  h2BookElement.textContent.toLowerCase()
        // console.log(wantedBook)

        if (wantedBook.includes(input)) {
            book.style.display = ''
        } else {
            book.style.display = 'none'
        }

    })
})


