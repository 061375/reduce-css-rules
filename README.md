# reduce-css-rules
Experiment to reduce unused rules in a style sheet by getting actually calculated rules from browser

View the unminified javascript code in _/components/js/script.js

View the PHP code in _/php/ajax.php

View the SASS stylesheet this is queing off og _/components/sass/style.scss

## Version

1.3 July 28, 2017
- Support for media queries

1.2 July 27, 2017
- Created simple interface
  - Run
  - Reset ( clears the date for the current domain )
  - Close
- Demo spans two pages to show how multiple pages may have different rules that can be combined
- Demo page 3 shows a page with all rules using the reduced stylesheet.
- Demo page 3 shows the size statistics before and after
- Added rendered bookmarklet

1.1 July 26, 2017
- Tested code fixed bugs
- made ajax more dynamic 
- ajax added ability to send multi-dimensional array in POST
- POST data is parsed before send
- program runs onload with php url specified in init
- added PHP to set and get data and stylesheet in location (folder based on current domain)
- stylesheet are sorted and combined

1.0 July 26, 2017
- At this point I haven't tested this code at all. I simply wrote out exactly what I thought it would need. Although, from experience I am sure (with a few bugs here and there) that it will do what I want it to do.
- The next step is to write a simple PHP handler to store the results as JSON and CSS

## Bugs
- Empty root selectors are being added [fixed]
- Removed rules are being left in the sheet. This is not really a bug as it is the behavior expected by multiple pages but I may need to find some way to handle this behavior or perhaps provide a button to "purge"
- First run doesn't display results in console [fixed]

## TODO
- Currently no support for events like :hover
- No specific support for a tag events :visited and such (it should catch them regardless of state)
- Media queries catch bulk rules and are not filterd based on DOM usage
- No specific support for transitions (it can pick up in-line but complex animations will be skipped)