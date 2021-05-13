# BookShelf

A full stack mobile-first JavaScript application for readers who want to find new books to read, keep track of and rate books they've already read, and develop a reading plan for the books next on their list. 

<img width="450" alt="Screen Shot 2021-05-13 at 3 13 54 PM" src="https://user-images.githubusercontent.com/74999873/118194301-feed6280-b3fd-11eb-94b8-ee8bc19e29d5.png">


## Technologies & Tools Used

- HTML5
- JavaScript
- CSS3
- React
- Express.js
- Node.js
- Babel
- webpack
- PostgreSQL / pgweb
- Argon2
- JWT

## Link

[BookShelf](https://personal-book-manager.herokuapp.com/)

## Features

1. User Can Search For Books
3. User Can See Results of Search
4. User Can View Details
5. User Can Save Books to Library
6. User Can View Library
7. User Can Rate Books in Library
8. User Can Add Books to Reading List
9. User Can View Reading List
10. User Can Delete Books from Library & Reading List
11. User Can Create an Account
12. User Can Sign In and Save books to their Account
13. User Can View A Reading Plan for Books in their Reading List

## Examples

![user can search](https://user-images.githubusercontent.com/74999873/115622739-1a58c800-a2ad-11eb-9cc0-2a31b6997d0e.gif) ![user can save and add](https://user-images.githubusercontent.com/74999873/115622765-26448a00-a2ad-11eb-9b5a-ddb79d9adc75.gif) 

![user can rate and delete](https://user-images.githubusercontent.com/74999873/115622810-32304c00-a2ad-11eb-91d3-5e8fd0a10e32.gif) ![user can view details and delete](https://user-images.githubusercontent.com/74999873/115622846-3c524a80-a2ad-11eb-8aff-89ae0076a21d.gif)

## Development

### System Requirements
- Node.js 10 or higher
- NPM 6 or higher

### Getting Started

1. Clone the repository.

`
git clone https://github.com/danielwrosenbaum/bookshelf
cd bookshelf
`

2. Install all dependencies with NPM.

`
npm install
`

3. Create a new database called bookShelf.

`createdb bookShelf`

4. Import the database schema.

`
npm run db:import
`

5. Start the project. Once started you can view the application by opening http://localhost:3000 in your browser.

`
npm run dev
`

6. Database can bee seen at seen at http://localhost:8081. To examine run the following:

`pgweb --db=bookShelf`


