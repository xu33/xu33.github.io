## Optimization of index.html

- I use grunt to compress the css and javascript files, and inline the style.css to reduce the critical rendering resource number;
- I add the async attribute to the script tag, so that it won't delay the rendering; 
- I add media query to the print.css so it won't prevent delay the rendering;
- I load js file async, so it is loading and invoke after the whole dom content loaded;
- I compress the images use grunt, reduce the file size, and it would reduce the critical rendering bytes;

## Optimization of view/js/main.js

- I added the translateZ (0) to the .mover element to make it render alone;
- I use a variable to hold the body.scrollTop to prevent the forced sync layout;
- Set the #randomPizzas element to flexbox, set flex-wrap to wrap, remove the floating style of the .randomPizzaContainer element, use the elastic box model to optimize the layout;
- Modify the resizePizzas function, remove the code to trigger the mandatory synchronization layout;

##run note

Open https://xu33.github.io/ to view the website.

##use grunt to build assets

Open ternimal in the project root dir, type grunt, then press enter.