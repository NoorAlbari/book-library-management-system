const searchBarInput = document.querySelector('#search-input')
const booksElements = document.querySelectorAll('.book')


searchBarInput.addEventListener('input', (event) => {
    const input = event.target.value.toLowerCase()
   

    booksElements.forEach((book) => {
        const bookImage = book.querySelector('.book-image')
          const wantedBook = bookImage.dataset.title.toLowerCase()
       

        if (wantedBook.includes(input)) {
            book.style.display = ''
        } else {
            book.style.display = 'none'
        }

    })
})


