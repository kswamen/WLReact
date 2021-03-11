const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

let html = "";

async function getHtml() {
  try {
    return await axios.get("https://www.yna.co.kr/news");
  } catch (error) {
    console.log(err)
  }
}

async function getNewestNews() {
  if (!html) {
    html = await getHtml();
  }

  const dataArr = [];
  const dataPath = "./newestNewsData.json";
  const $ = cheerio.load(html.data);

  $(".container .content03 .section01 .list li").each(async function (
    index,
    item
  ) {
    var src = "http:" + $(item).find("img").attr("src");
    var title = $(item).find("img").attr("alt");
    var subtitle = $(item).find(".lead").text();
    var a = $(item).find(".img-con").find("a").attr("href");

    if (src != null && title != null && subtitle != null && a != null) {
      var data = {
        title: title,
        subtitle: subtitle,
        src: src,
        a: a.replace("//", "https://"),
      };

      dataArr.push(data);

      if (index > 20) {
        fs.writeFileSync(dataPath, JSON.stringify(dataArr));
      }
    }
  });
}

module.exports = { getNewestNews };
