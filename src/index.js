const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio");
const lunr = require('lunr');
const utils = require('./utils');

const sectionHeaderElements = ["h2", "h3"];

module.exports = function (context, options) {
  options = options || {};
  const languages = utils.generateLunrClientJS(options.languages);
  return {
    name: "docusaurus-lunr-search",
    getThemePath() {
      return path.resolve(__dirname, "./theme");
    },
    configureWebpack() {
      // Ensure that algolia docsearch css is its own chunk
      return {
        optimization: {
          splitChunks: {
            cacheGroups: {
              algolia: {
                name: "algolia",
                test: /algolia\.css$/,
                chunks: `all`,
                enforce: true,
                // Set priority higher than docusaurus single-css extraction
                priority: 60,
              },
            },
          },
        },
      };
    },
    async postBuild({ routesPaths = [], outDir, baseUrl }) {
      console.log("docusaurus-lunr-search:: Building search docs and lunr index file")
      const files = utils.getFilePaths(routesPaths, outDir, baseUrl);
      const searchDocuments = [];
      const lunrIndex = lunr(function () {
        languages && this.use(languages);
        this.ref("id");
        this.field("title", { boost: 200 });
        this.field("content", { boost: 2 });
        this.field("keywords", { boost: 100 });
        this.metadataWhitelist = ["position"];
        addToSearchData = (d) => {
          this.add({
            id: searchDocuments.length,
            title: d.title,
            content: d.content,
            keywords: d.keywords
          });
          searchDocuments.push(d);
        }
        buildSearchData(files, addToSearchData);
      });
      console.log("docusaurus-lunr-search:: writing search-doc.json")
      fs.writeFileSync(
        path.join(outDir, "search-doc.json"),
        JSON.stringify(searchDocuments)
      );
      console.log("docusaurus-lunr-search:: writing lunr-index.json")
      fs.writeFileSync(
        path.join(outDir, "lunr-index.json"),
        JSON.stringify(lunrIndex)
      );
      console.log("docusaurus-lunr-search:: End of process")
    },
  };
};

// Build search data for a html
function buildSearchData(files, addToSearchData) {
  files.forEach(({ path, url }) => {
    if (!fs.existsSync(path)) return;

    const htmlFile = fs.readFileSync(path);
    const $ = cheerio.load(htmlFile);

    const article = $("article");
    if (!article.length) {
      return;
    }
    const markdown = article.find(".markdown");
    if (!markdown.length) {
      return;
    }

    const pageTitleElement = article.find("h1");
    if (!pageTitleElement.length) {
      return;
    }
    const pageTitle = article.find("h1").text();
    const sectionHeaders = sectionHeaderElements.reduce((acc, selector) => {
      acc = acc.concat(Array.from(markdown.find(selector)));
      return acc;
    }, []);

    keywords = $("meta[name='keywords']").attr("content");
    if (typeof keywords !== "undefined" && keywords) {
      keywords = keywords.replace(",", " ");
    }

    addToSearchData({
      title: pageTitle,
      type: 0,
      sectionRef: "#",
      url,
      // If there is no sections then push the complete content under page title
      content: sectionHeaders.length === 0 ? getContent(markdown) : "",
      keywords: keywords,
    })

    sectionHeaders.forEach((sectionHeader) => {
      sectionHeader = $(sectionHeader);
      const title = sectionHeader.text().replace("#", "");
      const sectionRef = sectionHeader.children().first().attr("id");
      const content = getSectionContent(sectionHeader);
      addToSearchData({
        title,
        type: 1,
        pageTitle,
        url: `${url}#${sectionRef}`,
        content,
      });
    });
  });
}

function getContent(element) {
  const text =
    element.is("table") || element.find("table").length !== 0
      ? element.html().replace(/<[^>]*>/g, " ")
      : element.text();
  return text.replace(/\s\s+/g, " ").replace(/(\r\n|\n|\r)/gm, " ");
}

function getSectionContent(section) {
  let content = "";
  section = section.next();
  while (section.length) {
    if (sectionHeaderElements.some((s) => section.is(s))) break;
    content += getContent(section) + " ";
    section = section.next();
  }
  return content;
}
