const axios = require("axios")
const rp = require('request-promise');

exports.getAssets = async(req, res) => {
    var serverURL = 'https://api.stellar.expert/explorer/public/asset/?limit=60&order=desc&sort=rating';
    if (search && search != null) {
        serverURL += '&search=';
    }

    let assets = await axios.get(serverURL);
    if (assets.status === 200) {
        assets = assets.data._embedded.records;

        for (let index = 0; index < assets.length; index++) {
            //Set image key for asset
            if (
                assets[index].tomlInfo && 
                Object.keys(assets[index].tomlInfo).length != 0 && 
                (assets[index].tomlInfo.image || assets[index].tomlInfo.orgLogo)) {

                if (assets[index].tomlInfo.image) {
                    assets[index]['asset_image'] = assets[index].tomlInfo.image;
                } else if(assets[index].tomlInfo.orgLogo) {
                    assets[index]['asset_image'] = assets[index].tomlInfo.orgLogo;
                }
            } else {
                assets[index]['asset_image_text'] = assets[index].asset.slice(0, 1)
            }

            //Set name key for asset
            if (assets[index].tomlInfo && Object.keys(assets[index].tomlInfo).length != 0 && assets[index].tomlInfo.name) {
                assets[index]['asset_name'] = assets[index].tomlInfo.name;
            } else {
                assets[index]['asset_name'] = assets[index].asset.slice(0, assets[index].asset.indexOf('-'));
            }

            //Set anchorName key for asset
            assets[index]['asset_anchorName'] = assets[index].asset.slice(0, assets[index].asset.indexOf('-'));

            //Set issuer key for asset
            assets[index]['asset_issuer'] = assets[index].asset.slice(assets[index].asset.indexOf('-') + 1, assets[index].asset.lastIndexOf('-'))
        }

        return({status: true, data: assets})        
    } else {
        return({status: false, message: "Something problem happened with server!"});
    }
}

console.log(1)

const requestOptions1 = {
    method: 'GET',
    uri: 'https://pro-api.coinmarketcap.com/v1/exchange/map',
    qs: {
        // 'id': '1',
        // 'symbol': 'BTC',
        // 'time_start': '021-05-07T10:14:22.401Z',
        // 'time_end': '021-05-07T12:14:22.401Z',
        // 'slug': 'bitcoin',    
        'start': '1',
        'limit': '100',
        'sort': 'volume_24h',
        // 'sort_dir': 'desc',
        // 'matched_symbol': 'USD/BTC',
        // 'interval': '1h',
        // 'convert': 'EUR',
        'crypto_id': '1',
    },
    headers: {
        'X-CMC_PRO_API_KEY': "94a561c6-d365-4924-969a-ec9650d1eacc"
    },
    json: true,
    gzip: true
};

rp(requestOptions1).then(response => {
    console.log(response)
    // console.log('API call response:', response);
    // return res.send(response);
}).catch((err) => {
    console.log('API call error:', err.message);
    // return res.send(err.message);
});