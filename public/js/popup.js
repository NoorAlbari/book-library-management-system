
const bookImages = document.querySelectorAll('.book-image');
const bookPopup = document.querySelector('#book-popup');
const closePopup = document.querySelector('.close-popup');
const editForm = document.querySelector('#edit-form');
const deleteForm = document.querySelector('#delete-form');

bookImages.forEach((image) => {

    image.addEventListener('click', () => {

        bookPopup.style.display = 'flex';

        document.querySelector('#popup-title').textContent = image.dataset.title;
        document.querySelector('#popup-description').textContent = image.dataset.description;
        document.querySelector('#popup-category').textContent = image.dataset.category;
        document.querySelector('#popup-author').textContent = image.dataset.author;
        const rating = Number(image.dataset.rating);
        if (rating === 5) {
            document.querySelector('#popup-rating').textContent = '⭐⭐⭐⭐⭐';
        } else if (rating === 4) {
            document.querySelector('#popup-rating').textContent = '⭐⭐⭐⭐';
        } else if (rating === 3) {
            document.querySelector('#popup-rating').textContent = '⭐⭐⭐';
        } else if (rating === 2) {
            document.querySelector('#popup-rating').textContent = '⭐⭐';
        } else if (rating === 1) {
            document.querySelector('#popup-rating').textContent = '⭐';
        }
        document.querySelector('#popup-year').textContent = image.dataset.year;
        document.querySelector('#popup-status').textContent = image.dataset.status;

        document.querySelector('#popup-image').src = image.src;

        // Get the clicked book's ID
        const bookId = image.dataset.id;

        console.log(image);
        console.log(bookId);

        // Update the forms
        editForm.action = `/${bookId}/edit`;
        deleteForm.action = `/${bookId}?_method=DELETE`;

    });

});

closePopup.addEventListener('click', () => {
    bookPopup.style.display = 'none';
});
