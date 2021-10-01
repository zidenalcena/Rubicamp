const process = require('process');
const fs = require('fs');

const help = `
$ node todo.js <command>
$ node todo.js list
$ node todo.js task <task_id>
$ node todo.js add <task_content>
$ node todo.js delete <task_id>
$ node todo.js complete <task_id>
$ node todo.js uncomplete <task_id>
$ node todo.js list:outstanding asc|desc
$ node todo.js list:completed asc|desc
$ node todo.js tag <task_id> <tag_name_1> <tag_name_2> ... <tag_name_N>
$ node todo.js filter:<tag_name>
`;

if (process.argv.length < 3) {
  console.log('>>> JS TODO <<<');
  console.log(help);
} else {
  const command = process.argv[2];
  // console.log(command);
  const tempInput = [];

  for (let i = 3; i < process.argv.length; i++) {
    tempInput.push(process.argv[i]);
  }
  // console.log(tempInput);

  let input = '';

  tempInput.forEach((string, index) => {
    if (index === tempInput.length - 1) input += string;
    else input += `${string} `;
  });
  // console.log(input);

  let writeData;
  let id;
  let file;
  let readData;

  if (fs.existsSync('data.json')) {
    file = fs.readFileSync('data.json');
    readData = JSON.parse(file);

    writeData = [...readData];
    id = readData.length;
  } else {
    writeData = [];
    id = 0;
  }

  let filtered = '';

  for (let i = 7; i < command.length; i++) {
    filtered += command[i];
  }

  // console.log(filtered);

  switch (command) {
    case 'help':
      console.log('>>> JS TODO <<<');
      console.log(help);
      break;

    case 'list':
      // console.log(readData);
      console.log('Daftar Pekerjaan');
      for (let i = 0; i < readData.length; i++) {
        console.log(`${readData[i].id}. ${readData[i].content}`);
      }
      break;

    case 'task':
      let choosenIndex = process.argv[3];

      for (let i = 0; i < readData.length; i++) {
        if (choosenIndex == readData[i].id) {
          console.log(`${readData[i].id}. ${readData[i].content}`);
        }
      }
      break;

    case 'add':
      // console.log('add - jalan');
      id++;
      writeData.push({ id: id, content: `[ ] ${input}`, tags: [] });

      fs.writeFileSync('./data.json', JSON.stringify(writeData));
      console.log(`"${input}" telah di tambahkan`);
      break;

    case 'delete':
      // console.log(typeof process.argv[3]);
      let deletedIndex = process.argv[3];
      writeData = [];
      for (let i = 0; i < readData.length; i++) {
        if (readData[i].id != deletedIndex) {
          // console.log(readData[i]);
          writeData.push(readData[i]);
        } else {
          let deletedContent = readData[i].content;
          let tempContent = '';

          for (let i = 4; i < deletedContent.length; i++) {
            tempContent += deletedContent[i];
          }

          console.log(`'${tempContent}' telah di hapus dari daftar`);
        }
      }
      // console.log(writeData);
      let tempData = [];
      for (let i = 0; i < writeData.length; i++) {
        // console.log(writeData[i].id -= 1);
        if (writeData[i].id > Number(process.argv[3])) {
          writeData[i].id -= 1;
          tempData.push(writeData[i]);
        } else {
          tempData.push(writeData[i]);
        }
      }
      // console.log(tempData);
      writeData = tempData;
      // console.log(writeData);
      fs.writeFileSync('./data.json', JSON.stringify(writeData));
      break;

    case 'complete':
      writeData = [];

      for (let i = 0; i < readData.length; i++) {
        if (readData[i].id != process.argv[3]) {
          writeData.push(readData[i]);
        } else {
          let updatedContent = readData[i].content;
          let tempContent = '';

          for (let i = 4; i < updatedContent.length; i++) {
            tempContent += updatedContent[i];
          }

          console.log(`'${tempContent}' telah selesai.`);

          let completedContent = '';

          for (let i = 0; i < updatedContent.length; i++) {
            if (i === 1) completedContent += 'X';
            else completedContent += updatedContent[i];
          }

          // console.log(completedContent);

          readData[i].content = completedContent;
          writeData.push(readData[i]);
        }
      }

      // console.log(writeData);
      fs.writeFileSync('./data.json', JSON.stringify(writeData));
      break;

    case 'uncomplete':
      writeData = [];

      for (let i = 0; i < readData.length; i++) {
        if (readData[i].id != process.argv[3]) {
          writeData.push(readData[i]);
        } else {
          let updatedContent = readData[i].content;
          let tempContent = '';

          for (let i = 4; i < updatedContent.length; i++) {
            tempContent += updatedContent[i];
          }

          console.log(`'${tempContent}' status selesai dibatalkan.`);

          let completedContent = '';

          for (let i = 0; i < updatedContent.length; i++) {
            if (i === 1) completedContent += ' ';
            else completedContent += updatedContent[i];
          }

          // console.log(completedContent);

          readData[i].content = completedContent;
          writeData.push(readData[i]);
        }
      }

      // console.log(writeData);
      fs.writeFileSync('./data.json', JSON.stringify(writeData));
      break;

    case 'list:outstanding':
      const outstandingList = [];

      for (let i = 0; i < readData.length; i++) {
        if (readData[i].content[1] === ' ') {
          outstandingList.push(readData[i]);
        }
      }

      console.log('Daftar Pekerjaan');
      if (process.argv[3] === 'asc') {
        for (let i = 0; i < outstandingList.length; i++) {
          console.log(
            `${outstandingList[i].id}. ${outstandingList[i].content}`
          );
        }
      } else if (process.argv[3] === 'desc') {
        for (let i = outstandingList.length - 1; i >= 0; i--) {
          console.log(
            `${outstandingList[i].id}. ${outstandingList[i].content}`
          );
        }
      } else {
        console.log('Maaf, gunakan asc atau desc');
      }
      break;

    case 'list:completed':
      const completedList = [];

      for (let i = 0; i < readData.length; i++) {
        if (readData[i].content[1] === 'X') {
          completedList.push(readData[i]);
        }
      }

      console.log('Daftar Pekerjaan');
      if (process.argv[3] === 'asc') {
        for (let i = 0; i < completedList.length; i++) {
          console.log(`${completedList[i].id}. ${completedList[i].content}`);
        }
      } else if (process.argv[3] === 'desc') {
        for (let i = completedList.length - 1; i >= 0; i--) {
          console.log(`${completedList[i].id}. ${completedList[i].content}`);
        }
      } else {
        console.log('Maaf, gunakan asc atau desc');
      }
      break;

    case 'tag':
      let idTag = process.argv[3];
      // console.log(idTag);
      const tags = [];

      for (let i = 4; i < process.argv.length; i++) {
        // console.log(process.argv[i]);
        tags.push(process.argv[i]);
      }
      // console.log(tags);

      let dataWithTag = [];
      let tempTags;
      for (let i = 0; i < readData.length; i++) {
        if (readData[i].id == idTag) {
          // console.log(readData[i].tags);
          tempTags = [...readData[i].tags, ...tags];
          // console.log(tempTags);
          readData[i].tags = [...tempTags];
          dataWithTag.push(readData[i]);
        } else {
          dataWithTag.push(readData[i]);
        }
      }

      // console.log(dataWithTag);
      writeData = dataWithTag;
      fs.writeFileSync('./data.json', JSON.stringify(writeData));
      break;

    case `filter:${filtered}`:
      // console.log('jalan filternya');
      console.log('Daftar Pekerjaan');
      for (let i = 0; i < readData.length; i++) {
        // console.log(readData[i].tags.length);
        if (readData[i].tags.length > 0) {
          for (let j = 0; j < readData[i].tags.length; j++) {
            if (readData[i].tags[j] === filtered) {
              console.log(`${readData[i].id} ${readData[i].content}`);
            }
          }
        }
      }
      break;

    default:
      console.log('Maaf, keyword salah.');
      break;
  }
}
