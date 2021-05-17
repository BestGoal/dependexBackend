const baseController = require("./baseController")
const baseConfig = require("../config/index")

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
    if (cryptoData && cryptoData.status.error_code == "0") {
        let totalCount = cryptoData.data.totalCount;
        let list = cryptoData.data.cryptoCurrencyList;
        let rdata = [];
        for (let i = 0; i < list.length; i++) {
            let tempData = {
                img: `https://s2.coinmarketcap.com/static/img/coins/32x32/${list[i].id}.png`,
                name: list[i].name,
                currency: list[i].symbol,
                price: (list[i].quotes[0].price).toFixed(2),
            }
            rdata.push(tempData);
        }
        return res.json({ status: true, data: rdata, count: totalCount })
    } else {
        return res.json({ status: false })
    }
}

exports.getAssetsWithTrade = async (req, res) => {
    let condition = req.body;
    let sendData = {
        start: condition.start,
        limit: condition.limit,
        sortBy: 'market_cap',
        sortType: 'desc',
        convert: condition.convert
    }

    let cryptoData = await baseController.sendJsonRequest('GET', 'https://api.coinmarketcap.com/data-api/v3/cryptocurrency/listing', sendData, {});
    if (cryptoData && cryptoData.status.error_code == "0") {
        let totalCount = cryptoData.data.totalCount;
        let list = cryptoData.data.cryptoCurrencyList;
        let rdata = [];
        for (let i = 0; i < list.length; i++) {
            let tradeHistory = await this.getTradeHistory(condition, list[i].symbol);
            let tempData = {
                img: `https://s2.coinmarketcap.com/static/img/coins/32x32/${list[i].id}.png`,
                name: list[i].name,
                usdt: "0.00",
                crypto: "0",
                currency: list[i].symbol,
                price: (list[i].quotes[0].price).toFixed(2),
                time: "0.75 % 24hrs",
                tradeData: tradeHistory
            }
            rdata.push(tempData);
        }
        return res.json({ status: true, data: rdata, count: totalCount })
    } else {
        return res.json({ status: false })
    }
}

exports.getTradeHistory = async (condition, symbol) => {
    let sendData = {
        convert: condition.convert,
        format: "chart_crypto_details",
        symbol,
        interval: "30m",
        time_start: new Date().valueOf() - (60 * 60 * 24 * 1000),
        time_end: new Date().valueOf()
    }
    let header = {
        'X-CMC_PRO_API_KEY': baseConfig.COIN_MARKET_KEY,
        'Accept': 'application/json'
    }
    let data = await baseController.sendJsonRequest('GET', 'https://web-api.coinmarketcap.com/v1.1/cryptocurrency/quotes/historical', sendData, header);
    let tradeData = [];
    if (data && data.status.error_code == "0") {
        for (const i in data.data) {
            let element = data.data[i];
            for (const j in element) {
                let temp = {
                    time: new Date(i).toLocaleString(),
                    price: element[j][0]
                }
                tradeData.push(temp);
            }
        }
        return tradeData;
    } else {
        return [];
    }
}

exports.exchangeCard = async (req, res) => {
    let {
        value,
        curreny1,
        curreny2
    } = req.body;

    let sendData = {
        convert: curreny2,
        format: "chart_crypto_details",
        symbol: curreny1,
        interval: "1d",
        time_start: new Date().valueOf() - (60 * 60 * 24 * 1000),
        time_end: new Date().valueOf()
    }
    let header = {
        'X-CMC_PRO_API_KEY': baseConfig.COIN_MARKET_KEY,
        'Accept': 'application/json'
    }
    let data = await baseController.sendJsonRequest('GET', 'https://web-api.coinmarketcap.com/v1.1/cryptocurrency/quotes/historical', sendData, header); 

    if (data && data.status.error_code == "0") {
        if(Object.keys(data.data).length) {
            for (const i in data.data) {
                let element = data.data[i];
                for (const j in element) {
                    let price = element[j][0]
                    return res.json({ status: true, data: price * value })
                }
            }
        } else {
            return res.json({ status: false })            
        }
    } else {
        return res.json({ status: false })
    }
}