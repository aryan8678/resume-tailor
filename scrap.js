import * as cheerio from "cheerio";

export default async function getData(url){
  const $ = await cheerio.fromURL(url);


  const data = $.extract({
    releases: [
      {
        // First, we select individual release sections.
        selector: "section",
        // Then, we extract the release date, name, and notes from each section.
        value: {
          // Selectors are executed within the context of the selected element.
          name: "h2",
          date: {
            selector: "relative-time",
            // The actual release date is stored in the `datetime` attribute.
            value: "datetime",
          },
          notes: {
            selector: ".markdown-body",
            // We are looking for the HTML content of the element.
            value: "innerHTML",
          },
        },
      },
    ],
  });
}
