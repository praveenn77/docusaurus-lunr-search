/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio");

const sectionHeaderElements = ["h2", "h3"];

module.exports = function () {
  return {
    name: "docusurus-lunr-search",
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
      const files = routesPaths
        .filter((route) => route !== baseUrl && route !== `${baseUrl}404.html`)
        .map((route) => route.substr(baseUrl.length))
        .map((route) => ({
          path: path.join(outDir, route, "index.html"),
          url: route,
        }));
      const searchData = buildSearchData(files);
      fs.writeFileSync(
        path.join(outDir, "search-data.json"),
        JSON.stringify(searchData)
      );
    },
  };
};

// Build search data for a html
function buildSearchData(files) {
  const searchData = [];
  files.forEach(({ path, url }) => {
    const htmlFile = fs.readFileSync(path);
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

    searchData.push({
      title: pageTitle,
      type: 0,
      sectionRef: "#",
      url,
      // If there is no sections then push the complete content under page title
      content: sectionHeaders.length === 0 ? getContent(markdown) : "",
      keywords: keywords,
    });

    sectionHeaders.forEach((sectionHeader) => {
      sectionHeader = $(sectionHeader);
      const title = sectionHeader.text().slice(1);
      const sectionRef = sectionHeader.children().first().attr("id");
      const content = getSectionContent(sectionHeader);
      searchData.push({
        title,
        type: 1,
        pageTitle,
        url: `${url}#${sectionRef}`,
        content,
      });
    });
  });
  return searchData;
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
