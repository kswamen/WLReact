const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
var keyData = fs.readFileSync("./secretkey.json");
const key = JSON.parse(keyData);

let html = "";

async function getHtml() {
    try {
        return await axios.get("http://ncov.mohw.go.kr/bdBoardList_Real.do?brdId=1&brdGubun=11&ncvContSeq=&contSeq=&board_id=&gubun=");
    } catch (error) {

    }
}

function getDateStr(myDate) {
    var year = myDate.getFullYear();
    var month = (myDate.getMonth() + 1);
    var day = myDate.getDate();

    month = (month < 10) ? "0" + String(month) : month;
    day = (day < 10) ? "0" + String(day) : day;

    return year + month + day;
}

function today() {
    var d = new Date();
    return getDateStr(d);
}

function lastWeek() {
    var d = new Date();
    var dayOfMonth = d.getDate();
    d.setDate(dayOfMonth - 7);
    return getDateStr(d);
}

async function getPatientsInfo() {
    if (!html) {
        html = await getHtml();
    }

    const dataArr = [];
    const dataPath = "./patientsInfo.json";
    const $ = cheerio.load(html.data);
    var patientsGraphInfo = []

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
    });

    var url = 'http://openapi.data.go.kr/openapi/service/rest/Covid19/getCovid19InfStateJson';
    var queryParams = '?' + encodeURIComponent('ServiceKey') + '=' + key.coronaAPIKey; /* Service Key*/
    queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /* */
    queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('10'); /* */
    queryParams += '&' + encodeURIComponent('startCreateDt') + '=' + encodeURIComponent(lastWeek()); /* */
    queryParams += '&' + encodeURIComponent('endCreateDt') + '=' + encodeURIComponent(today()); /* */

    axios({
        method: 'get',
        url: url + queryParams
    }).then((response) => {
        result = response.data.response.body.items.item
        for (idx in result) {
            if (idx == result.length - 1)
                break;
            patientsGraphInfo.push({
                createdDate: result[idx].createDt.split(' ')[0],
                newConfirmed: result[idx].decideCnt - result[parseInt(idx) + 1].decideCnt
            })
        }
        dataArr.push({
            patientsGraphInfo
        })
        fs.writeFileSync(dataPath, JSON.stringify(dataArr));
    });
}



module.exports = { getPatientsInfo };
