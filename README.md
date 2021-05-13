# BookShelf

A full stack, mobile-first JavaScript application created in React for readers who want to find new books to read, keep track of and rate books they've already read, and develop a reading plan for the books next on their list. 

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

![bookshelf 1](https://user-images.githubusercontent.com/74999873/118195541-3fe67680-b400-11eb-9155-94c4deac0f23.gif). 
![bookshelf 2](https://user-images.githubusercontent.com/74999873/118195732-9c499600-b400-11eb-86ab-71649a495628.gif). 
![Bookshelf 3](https://user-images.githubusercontent.com/74999873/118195554-470d8480-b400-11eb-9529-eaea0760263d.gif). 

![bookshelf 4](https://user-images.githubusercontent.com/74999873/118195565-4aa10b80-b400-11eb-8ee4-27201ef39e54.gif). 
![bookshelf 5](https://user-images.githubusercontent.com/74999873/118195569-4c6acf00-b400-11eb-90ac-65f1cff9e5b4.gif). 
![bookshelf 6](https://user-images.githubusercontent.com/74999873/118195839-d5820600-b400-11eb-89da-a5d677ef0980.gif)


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


