const cheerio = require('cheerio');
// const axios = require('axios');
const resquest = require('request');
const nodemailer = require('nodemailer');
const http = require('http');
const dotenv = require('dotenv');
dotenv.config({'path':'./config.env'});
const url = 'https://rate.bot.com.tw/xrt?Lang=zh-TW';
// let transferIndex = 0;
const header = {
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
  'Content-Type': 'application/json',
};
const transporter = nodemailer.createTransport({
  service:'hotmail',
  auth:{
    user:'your@hotmail.com',
    pass:'your.EMAIL_PASSWORD',
  }
});
const mailOptions = {
  from: 'creazy_fu@hotmail.com',
  to: 'creazykfc@gmail.com',
  subject:'賣美金了',
} 
const getWebScraper = (req, res)=>{
  if(req.url === '/crawler'){
    const result = [];
    resquest({
      url,
      method:"GET"
    },(err, response, body)=>{
      // console.log(response.statusCode);
      // console.log(response.headers['content-type']);
      const $ = cheerio.load(body);
        const tr = $("tbody tr");
      for(let i = 0 ; tr.length > i; i++){
        const coinType = tr.eq(i).find('.hidden-phone.print_show').text().trim();
        const buyCashCoinPrice = tr.eq(i).children().eq(1).text();
        const sellCashCoinPrice = tr.eq(i).children().eq(2).text();
        const buySpotRateCoinPrice = tr.eq(i).children().eq(3).text().trim();
        const sellSpotRateCoinRate = tr.eq(i).children().eq(4).text().trim();
        if(i === 0) console.log(tr.eq(0).children().eq(3));
        result.push({
          'type':coinType,
          'cash buy':buyCashCoinPrice,
          'cash sell':sellCashCoinPrice,
          'spot rate buy':buySpotRateCoinPrice,
          'spot rate sell':sellSpotRateCoinRate,
        });
        const sellSpotRateCoinRateToNumber = Number(sellSpotRateCoinRate)
        // console.log(typeof sellSpotRateCoinRate,'buySpotRateCoinPriceToNumber')
        if(coinType.indexOf('美金') !== -1 && sellSpotRateCoinRateToNumber > 31.9){
          console.log({
            'type':coinType,
            'cash buy':buyCashCoinPrice,
            'cash sell':sellCashCoinPrice,
            'spot rate buy':buySpotRateCoinPrice,
            'spot rate sell':sellSpotRateCoinRate,
          })
          console.log(transporter)
          const writeText = `<body><h4>賣美金啦</h4><p>目前買美金匯率${sellSpotRateCoinRate}</p></body>`
          mailOptions.html = writeText;
          // transporter.sendMail(mailOptions, (err, info)=>{
          //   if(err){
          //     return console.log(err)
          //   }else{
          //     console.log('massage:' + info.response)
          //   }
          // })
        }
      };
      // }
      res.writeHeader(200,header);
      res.write(JSON.stringify({
      data:result,
      status:'success'
    }));
    res.end();
  });

    // axios.get(url).then((response)=>{
    //   if(!response.data)return
    //   const data = response.data;
    //   const $ = cheerio.load(data);
    //   const tr = $("tbody tr");
    //   for(let i = 0 ; tr.length > i; i++){
    //     const coinType = tr.eq(i).find('.hidden-phone.print_show').text().trim();
    //     const buyCashCoinPrice = tr.eq(i).children().eq(1).text();
    //     const sellCashCoinPrice = tr.eq(i).children().eq(2).text();
    //     const buySpotRateCoinPrice = tr.eq(i).children().eq(3).text().trim();
    //     const sellSpotRateCoinRate = tr.eq(i).children().eq(4).text().trim();
    //     if(i === 0) console.log(tr.eq(0).children().eq(3));
    //     result.push({
    //       '種類':coinType,
    //       '現金買入':buyCashCoinPrice,
    //       '現金賣出':sellCashCoinPrice,
    //       '即期匯率買入':buySpotRateCoinPrice,
    //       '即期匯率賣出':sellSpotRateCoinRate,
    //     });
    //   };
    //     console.log(result,'result')
    //     res.writeHeader(200,header);
    //     res.write(JSON.stringify({
    //     data:result,
    //     status:'success'
    //   }));
    //   res.end();
    // })
  }
}
const repeatUsedTransfer = (req,res)=>{
  // if(transferIndex === 0){
    getWebScraper(req,res);
  // }else{
    setInterval(() => {
      getWebScraper(req,res)
    }, 600000);
  // };
  // i++
}

http.createServer(repeatUsedTransfer).listen(8086);

