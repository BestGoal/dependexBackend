const baseController = require("./baseController")

exports.getAssets = async (req, res) => {
    let condition = req.body;
    let sendData = {
        start: condition.start,
        limit: condition.limit,
        sortBy: 'market_cap',
        sortType: 'desc',
        convert: condition.convert
    }

    let cryptoData = await baseController.sendJsonRequest('GET', 'https://api.coinmarketcap.com/data-api/v3/cryptocurrency/listing', sendData, {});
    if(cryptoData && cryptoData.status.error_code == "0") {
        let totalCount = cryptoData.data.totalCount;
        let list = cryptoData.data.cryptoCurrencyList;
        let rdata = [];
        for(let i = 0; i < list.length ; i ++) {
            // let tradeHistory = await this.getTradeHistory(condition, list[i].symbol);
            let tempData = {
                img: `https://s2.coinmarketcap.com/static/img/coins/32x32/${list[i].id}.png`,
                name: list[i].name,
                usdt: "0.00",
                crypto: "0",
                currency: list[i].symbol,
                price: (list[i].quotes[0].price).toFixed(2),
                time: "0.75 % 24hrs"
            }
            rdata.push(tempData);
        }
        return res.json({ status: true, data: rdata, count: totalCount })
    } else {
        return res.json({ status: false })
    }
}

exports.getTradeHistory = async(condition, symbol) => {
    let sendData = {
        convert: condition.convert,
        format: "chart_crypto_details",
        symbol,
        interval: "30m",
        time_start: new Date().valueOf() - (60 * 60 * 24 * 1000),
        time_end: new Date().valueOf()
    }
    // let data = await baseController.sendJsonRequest('GET', 'https://web-api.coinmarketcap.com/v1.1/cryptocurrency/quotes/historical', sendData, {});
}