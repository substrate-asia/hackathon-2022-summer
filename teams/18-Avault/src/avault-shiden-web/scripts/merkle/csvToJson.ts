import fs from 'fs';
import path from 'path';
import readline from 'readline';
import csv from 'csvtojson';
import { parseBalanceMap } from './utils/parse-balance-map';

const csvFilePath = './airdropRecords.csv';
// console.log(path.resolve(__dirname, csvFilePath));
const rl: any = readline.createInterface({
  input: fs.createReadStream(path.resolve(__dirname, csvFilePath)),
  output: fs.createWriteStream(path.resolve(__dirname, 'src/config/constants/merkle.json')),
  terminal: false,
});
rl.on('close', function () {
  csv()
    .fromFile(path.resolve(__dirname, csvFilePath))
    .preFileLine((fileLine, lineIdx) => {
      if (lineIdx === 0) {
        fileLine = fileLine
          .split(',')
          .map((header) => header.toLowerCase())
          .join(',');

        return fileLine;
      }
      return fileLine;
    })
    .then((data: { address: string; amount: number }[]) => {
      const _data = {};
      for (let i = 0; i < data.length; i++) {
        _data[data[i].address] = (data[i].amount * 1000000000000000000).toString(16);
      }
      const { claims, merkleRoot, tokenTotal } = parseBalanceMap(_data);
      // console.log(claims, merkleRoot, tokenTotal);

      fs.writeFileSync(
        'src/config/constants/merkle.json',
        JSON.stringify({
          merkleRoot: merkleRoot,
          tokenTotal: tokenTotal,
          claims: claims,
        }),
      );
      // rl.output.write(JSON.stringify(data));
    });
});

rl.input.on('error', (error) => {
  console.log(error);
});

rl.output.on('error', (error) => {
  console.log(error);
});
