const got = require('got');
const cheerio = require('cheerio');
const colors = require('colors');
const Table = require('cli-table');

const states = require('./states');
const URLS = require('./urls');

const table = new Table({
    head: [
        ' ',
        'STATE'.yellow.bold,
        'LIVE PRICE'.yellow.bold,
        'CHANGE'.yellow.bold,
        'MINIMUM'.yellow.bold,
        'MAXIMUM'.yellow.bold,
        'DATE'.yellow.bold
    ],
    colWidths: [5, 7, 15, 15, 15, 15, 15]
});

const data_currency = [];

const scrap = () => {
    got(URLS.URLS_CURRENCY)
        .then(response => {
            const $ = cheerio.load(response.body);
            const size = Object.keys(states).length;

            $('.data-table > tbody').find('tr').each((i, el) => {
                if (size >= ++i) {
                    const price = $(el).find('td').eq(0).text();
                    const change = $(el).find('td').eq(1).text();
                    const min = $(el).find('td').eq(2).text();
                    const max = $(el).find('td').eq(3).text();
                    const date = $(el).find('td').eq(4).text();

                    const state = states[i];
                    const obj = {};

                    obj[state] = {
                        id: i,
                        state: states[i],
                        livePrice: price,
                        change: change,
                        minimum: min,
                        maximum: max,
                        date: date
                    };

                    table.push(
                        [i, state.grey.bold, price.cyan.bold, change.magenta.bold, min.green.bold, max.red.bold, date.blue.bold]
                    );

                    data_currency.push(obj);
                }
            });
            console.log(table.toString());
        })
        .catch(error => {
            console.log(error.response.body);
        });
}

module.exports = scrap();
