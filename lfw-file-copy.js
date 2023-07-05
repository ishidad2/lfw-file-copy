const fs = require('fs').promises;
const path = require('path');
const readFile = process.argv[2];

const readFileList = async (filePath) => {
  const data = await fs.readFile(filePath, 'utf-8');
  return data.split('\n');
};

const copyFile = async (source, dest) => {
  console.log(
    `copy file: ${source} -> ${dest}`
  );
  await fs.copyFile(source, dest);
};

const copyFilesFromList = async (dirPath, fileList, destDir) => {
  for await (const file of fileList) {
    //検索対象のフォルダパスのリスト取得
    const targetFolder = path.join(dirPath, getFoloderName(file));
    await fs.readdir(targetFolder, { withFileTypes: true })
      .then(async (dirents) => {
        //ディレクトリに入ってるファイル分ループ
        for await (const dirent of dirents) {
          console.log(dirent.name.toString(), file.toString());
          if (file.toString() === dirent.name.toString()) {
            console.log("ファイルが見つかりました");
            await copyFile(path.join(targetFolder, dirent.name), path.join(destDir, dirent.name));
          }
        }
      });
  }
};

const getFoloderName = (str) => {
  let delimiter = '_';
  let reversedStr = str.split('').reverse().join(''); // 文字列を反転
  let reversedDelimiter = delimiter.split('').reverse().join(''); // デリミタも反転

  let index = reversedStr.indexOf(reversedDelimiter);

  if (index !== -1) {
    let firstPart = reversedStr.substring(index + delimiter.length).split('').reverse().join('');
    let secondPart = reversedStr.substring(0, index).split('').reverse().join('');
    return firstPart;
  } else {
    console.log('Delimiter not found in string');
    return null;
  }
}

const main = async () => {
  const fileList = await readFileList(readFile);
  await fs.mkdir('copy', { recursive: true });
  console.log(
    `-------------- file copy start --------------`
  );
  await copyFilesFromList('./lfw', fileList, './copy');
};

main().catch(console.error);
