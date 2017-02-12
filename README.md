## Optimization of index.html

 I use grunt to compress the css and javascript files, and inline the style.css to reduce the critical rendering resource number;

 I add the async attribute to the script tag, so that it won't delay the rendering; 

 I add media query to the print.css so it won't prevent delay the rendering;

 I move the inline script to the bottom of the page, so it is excuting after the whole dom content loaded;

 I compress the images use grunt, reduce the file size, and it would reduce the critical rendering bytes;