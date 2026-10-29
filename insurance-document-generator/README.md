# Insurance Document Generator

A simple browser-based tool that generates insurance documents:
policy certificate, quotation and claim form.

## Files
- index.html - page structure and form
- style.css  - styling (light/dark mode and print layout)
- script.js  - premium calculation and document generation

## How to run
Open index.html in any modern browser (Chrome, Edge, Firefox). No installation or server needed.

## How to use
1. Choose the insurance type and fill in the policyholder details.
2. Pick Policy certificate, Quotation or Claim form.
3. Click "Print / save as PDF" to print or save the document.

## Customising
- Premium rates: edit the RATE object in script.js
- Cover wording: edit the COVER object in script.js
- Currency: edit the inr() function in script.js
