const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

let html = "";

async function getHtml() {
    try {
        return await axios.get("http://ncov.mohw.go.kr/bdBoardList_Real.do?brdId=1&brdGubun=11&ncvContSeq=&contSeq=&board_id=&gubun=");
    } catch (error) {

    }
}

async function getPatientsInfo() {
    if (!html) {
        html = await getHtml();
    }

    const dataArr = [];
    const dataPath = "./patientsInfo.json";
    const $ = cheerio.load(html.data);

    $(".wrap.nj #form1 .container #content .caseTable").each(async function (
        index,
        item
    ) {
        // 확진자
        var confirmed = {
            totalSum: $(item).find(".ca_body .ca_value").first().text(),
            yesterdayCompare: {
                subTotal: $(item).find(".ca_body li:nth-child(2) ul li:nth-child(1) .inner_value").text(),
                domesticOcurrence: $(item).find(".ca_body li:nth-child(2) ul li:nth-child(2) .inner_value").text(),
                overseasInflow: $(item).find(".ca_body li:nth-child(2) ul li:nth-child(3) .inner_value").text(),
            }
        }
        // 격리 해제
        var released = {
            totalSum: $(item).find("div:nth-child(2) li:nth-child(1) .ca_value").text(),
            yesterdayCompare: $(item).find("div:nth-child(2) li:nth-child(2) .ca_value .txt_ntc").text(),
        }
        // 격리중
        var quarantine = {
            totalSum: $(item).find("div:nth-child(3) li:nth-child(1) .ca_value").text(),
            yesterdayCompare: $(item).find("div:nth-child(3) li:nth-child(2) .ca_value .txt_ntc").text(),
        }
        // 사망
        var gone = {
            totalSum: $(item).find("div:nth-child(4) li:nth-child(1) .ca_value").text(),
            yesterdayCompare: $(item).find("div:nth-child(4) li:nth-child(2) .ca_value .txt_ntc").text(),
        }

        dataArr.push({
            patientsTableInfo: {
                confirmed: confirmed,
                released: released,
                quarantine: quarantine,
                gone: gone,
            }
        })

        fs.writeFileSync(dataPath, JSON.stringify(dataArr))
    });
}

module.exports = { getPatientsInfo };
