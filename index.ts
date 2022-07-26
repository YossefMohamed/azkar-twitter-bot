const express = require("express");
const app = express();
const {client} = require("./handler/clientHandler");
const axios = require('axios');
const path = require('path');
const delayTime = 60000 * 2 ;

app.get("/", (_:any, res:any) => {
  res.send("<h1>Server Is Running :)</h1>")
})

let hadithOrAyah = 1;
const singleTweet = async () => {
  let quranApi = 'https://api.alquran.cloud/ayah/';
  try {
    let ayahNumber = Math.floor(Math.random() * 6236) + 1
    if(hadithOrAyah % 2 == 0){
      const hadithNumber =  Math.floor(Math.random() * (300 - 2) + 2)
      console.log(hadithNumber , "r");
      let {data} = await axios(`https://api.hadith.sutanlab.id/books/bukhari?range=${hadithNumber}-${hadithNumber}`)
      const {hadiths} = data.data
      await client.v1.tweet(hadiths[0].arab + '\n' + "رواه البخاري"+'\n' + '#حديث' )
     
      hadithOrAyah++
      return
    }
    let {data} = await axios(quranApi + ayahNumber + "/ar.asad")
    
    let numberOfAyahs = data.data.surah.numberOfAyahs;
    let surah = await JSON.stringify([data.data.surah.name]);
    let ayah = await JSON.stringify(data.data.text);
    await client.v1.tweet(ayah + '\n' + surah + ' - ' + ' رقم الآيــة: '+ numberOfAyahs +'\n' +'#قرآن' )
    hadithOrAyah++ 
    console.log("tweet successfully created")
    return
  } catch (e) {
    console.log(e.message)
  }
}

singleTweet()
setInterval(() => {
  singleTweet();
}, delayTime);


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("server is running on port 3000")
});
