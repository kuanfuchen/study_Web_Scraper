const cheerio = require('cheerio');
const axios = require('axios');
const http = require('http');
const url = 'https://rate.bot.com.tw/xrt?Lang=zh-TW';
const header = {
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
  'Content-Type': 'application/json',
};
const getWebScraper = (req, res)=>{
  console.log('----------')
  if(req.url === '/crawler'){
    const result = [];
    axios.get(url).then((response)=>{
      if(!response.data)return
      const data = response.data;
      const $ = cheerio.load(data);
      const tr = $("tbody tr");
      for(let i = 0 ; tr.length > i; i++){
        const coinType = tr.eq(i).find('.hidden-phone.print_show').text().trim();
        const buyCashCoinPrice = tr.eq(i).children().eq(1).text();
        const sellCashCoinPrice = tr.eq(i).children().eq(2).text();
        const buySpotRateCoinPrice = tr.eq(i).children().eq(3).text().trim();
        const sellSpotRateCoinRate = tr.eq(i).children().eq(4).text().trim();
        if(i===0) console.log(tr.eq(0).children().eq(3));
        result.push({
          '種類':coinType,
          '現金買入':buyCashCoinPrice,
          '現金賣出':sellCashCoinPrice,
          '即期匯率買入':buySpotRateCoinPrice,
          '即期匯率賣出':sellSpotRateCoinRate,
        });
      }
      res.writeHeader(200,header);
      res.write(JSON.stringify({
      data:result,
      status:'success'
    }));
    res.end();
    })
    
  }
}
http.createServer(getWebScraper).listen(8086);

