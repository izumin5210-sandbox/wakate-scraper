import fs       from "fs";
import request  from "request";
import cheerio  from "cheerio";
import toMd     from "to-markdown";
import moment   from "moment";


const baseUrl = "http://wakate.org";
const maxPage = 39;
const dest = "output";


for (let i = 1; i <= maxPage; i++) {
  const url = `${baseUrl}/${i}`
  console.log(`Get html from ${url} ...`);
  request(url, (err, res, _body) => {
    if (err || res.statusCode != 200) {
      console.log(`${url} returns ${res.statusCode}`)
    } else {
      const $ = cheerio.load(res.body);
      const createdAt = moment(new Date($(".post-foot div").text()));
      const filename = `${createdAt.format('YYYY-MM-DD')}-${i}.html.md`
      let output = "---\n"
      output += `title: ${$(".post-title a").text()}\n`;
      output += `datetime: ${createdAt.format()}\n`;
      output += "---\n\n";
      output += toMd($(".post-body").html());
      fs.writeFile(`${dest}/${filename}`, output, "utf8", err => {
        if (err) { throw err; }
        console.log(`${filename} saved !`);
      });
    }
  });
}
