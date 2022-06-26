/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

'use strict';

const select = {
  templates: {
    book: '#template-book',
  },
  container: {
    form: '.filters > form',
    booksPanel: 'section.books-panel',
    booksList: 'ul.books-list',
  },
  forms: {
    adultsOnly: 'input[value="adults"]',
    nonFiction: 'input[value="nonFiction"]',
  },
  book: {
    bookLi: 'li.book',
    bookName: 'h2.book__name',
    bookPrice: '.product__base-price',
    bookImageLink: 'a.book__image',
    bookImage: '.book__image > figure > img',
    bookRating: '.book__rating__fill',
  },
};

const classNames = {
  book: {
    favorite: 'favorite',
    hidden: 'hidden',
  },
};

const templates = {
  book: Handlebars.compile(document.querySelector(select.templates.book).innerHTML),
};

class BooksList {
  constructor() {
    const bookApp = this;

    bookApp.favourites = [];
    bookApp.filters = [];

    bookApp.getElements();
    bookApp.initData();
    bookApp.initBooks();
    bookApp.filterBooks();
    bookApp.initActions();
    bookApp.initFiltering();
  }
    
  initData() {
    this.data = dataSource;
    // console.log(this.data);
  }

  getElements() {
    const bookApp = this;

    bookApp.dom = {};
    bookApp.dom.form = document.querySelector(select.container.form);
    bookApp.dom.bookList = document.querySelector(select.container.booksList);
  }

  initBooks() {
    const bookApp = this;
    console.log(bookApp);

    for (const book of bookApp.data.books) {

      book.ratingBgc = bookApp.determineRatingBgc(book.rating);
      book.ratingWidth = bookApp.data.rating * 10;

      // generatedHTML based on template
      const generatedHTML = templates.book(book);
    
      // create a DOMelement with utils.createElementFromHTML
      book.element = utils.createDOMFromHTML(generatedHTML);
    
      // find the menu container and insert in DOM element in container
      bookApp.dom.bookList.appendChild(book.element);
    }
  }  

    
  initActions() {
    const thisApp = this;
    const bookList = document.querySelector(select.container.booksList);
    
    bookList.addEventListener('dblclick', function (event) {
      event.preventDefault();
    
      if (event.target && event.target.offsetParent.matches(select.book.bookImageLink)) {
        const targetElement = event.target.offsetParent;
        const dataId = parseInt(targetElement.getAttribute('data-id'));
            
        //* clicked book to favourite
        if (!targetElement.classList.contains(classNames.book.favorite)) {
          targetElement.classList.add(classNames.book.favorite);
              
          //* data-id add to favBooks array
          thisApp.favouriteBooks.push(dataId);
        } else {
          targetElement.classList.remove(classNames.book.favorite);
          const index = thisApp.favouriteBooks.indexOf(dataId);
          thisApp.favouriteBooks.splice(index, 1);
        }
      }
    });
  }

  initFiltering() {
    const thisApp = this;

    const form = document.querySelector('.filters');

    form.addEventListener('click', function (event) {

      if (event.target.tagName === 'INPUT' && event.target.type === 'checkbox' && event.target.name === 'filter') {
        switch (event.target.checked) {
        case true:
          thisApp.filters.push(event.target.value);
          break;
        case false:
          // eslint-disable-next-line no-case-declarations
          const index = thisApp.filters.indexOf(event.target.value);
          thisApp.filters.splice(index, 1);
          break;
        }
      }
      thisApp.filterBooks();
      console.log(thisApp.filters);
    });
  }
    
  filterBooks() {
    const thisApp = this;

    for (let book of thisApp.data.books) {
      let shouldBeHidden = false;

      for (let filter of thisApp.filters) {
        if (book.details[filter]){
          shouldBeHidden = true;
          break;
        }
      }
      if (shouldBeHidden) {
        document.querySelector('.book__image[data-id="' + book.id + '"]').classList.add(classNames.book.hidden);
      } else {
        document.querySelector('.book__image[data-id="' + book.id + '"]').classList.remove(classNames.book.hidden);
      }
    }
  }
    
  determineRatingBgc(rating) {
    let background = '';
    if (rating < 6) {
      background = 'linear-gradient(to bottom, #fefcea 0%, #f1da36 100%);';
    } else if (rating > 6 && rating <= 8) {
      background = 'linear-gradient(to bottom, #b4df5b 0%,#b4df5b 100%);';
    } else if (rating > 8 && rating <= 9) {
      background = 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%);';
    } else {
      background = 'linear-gradient(to bottom, #ff0084 0%,#ff0084 100%);';
    }
    return background;
  }
}
  
new BooksList();