const fs = require("fs-extra");
const path = require("path");
const cheerio = require("cheerio");

const BUILD_PATH = "./build/";
const SEARCH_DATA_LOCATION = "./src/theme/SearchBar/search-data.js";

const SEARCH_DATA = [];
const sectionHeaderElements = ["h2", "h3"];

const getContent = element => {
  const text =
    element.is("table") || element.find("table").length !== 0
      ? element.html().replace(/<[^>]*>/g, " ")
      : element.text();
  return text.replace(/\s\s+/g, " ").replace(/(\r\n|\n|\r)/gm, " ");
};

const getSectionContent = function(section) {
  let content = "";
  section = section.next();
  while (section.length) {
    if (sectionHeaderElements.some(s => section.is(s))) break;
    content += getContent(section) + " ";
    section = section.next();
  }
  return content;
};

const searchDirectory = (startPath, extension, callback) => {
  if (!fs.existsSync(startPath)) {
    return;
  }

  const files = fs.readdirSync(startPath);
  files.forEach(file => {
    const filePath = path.join(startPath, file);
    const stats = fs.lstatSync(filePath);
    if (stats.isDirectory()) {
      searchDirectory(filePath, extension, callback);
    } else if (path.extname(filePath) === extension) {
      callback(filePath);
    }
  });
};

// Build search data for a html
const buildSearchData = filePath => {
  const htmlFile = fs.readFileSync(filePath);
  //   const dom = new JSDOM(htmlFile);
  const $ = cheerio.load(htmlFile);

  const article = $("article");
  if (!article.length) {
    return;
  }
  const markdown = article.find(".markdown");
  if (!markdown.length) {
    return;
  }

  let baseUrl = filePath.split(path.sep);
  // remove build folder path from url
  baseUrl.splice(0, 1);
  // remove index.html from the path
  baseUrl.pop();
  baseUrl = baseUrl.join("/");
  const pageTitleElement = article.find("h1");
  if (!pageTitleElement.length) {
    return;
  }
  const pageTitle = article.find("h1").text();
  const sectionHeaders = sectionHeaderElements.reduce((acc, selector) => {
    acc = acc.concat(Array.from(markdown.find(selector)));
    return acc;
  }, []);

  SEARCH_DATA.push({
    title: pageTitle,
    type: 0,
    sectionRef: "#",
    url: baseUrl,
    // If there is no sections then push the complete content under page title
    content: sectionHeaders.length === 0 ? getContent(markdown) : ""
  });

  sectionHeaders.forEach(sectionHeader => {
    sectionHeader = $(sectionHeader);
    const title = sectionHeader.text().slice(1);
    const sectionRef = sectionHeader
      .children()
      .first()
      .attr("id");
    const url = `${baseUrl}#${sectionRef}`;
    const content = getSectionContent(sectionHeader);
    SEARCH_DATA.push({
      title,
      type: 1,
      pageTitle,
      url,
      content
    });
  });
};

const init = () => {
  searchDirectory(BUILD_PATH, ".html", buildSearchData);
  fs.writeFile(
    SEARCH_DATA_LOCATION,
    `
    export default ${JSON.stringify(SEARCH_DATA, null, 2)}
    `
  );
};

init();
