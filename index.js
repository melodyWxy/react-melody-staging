#!/usr/bin/env node

function runCli(){
//node.js命令行界面的完整解决方案，处理用户输入；
//用户在命令行，输入node bin\mini --help，就会调用通过command或者on，注册的--help的回调函数
const program = require('commander');
//传统的命令行只能单行一次性地输入所有参数和选项，使用这个工具可以自动提供提示信息，并且分步接收用户的输入，体验类似 npm init 时的一步一步输入参数的过程。
const prompt = require('co-prompt')
////异步流程控制工具，koa底层就封装了这个
const co = require('co')
//chalk是一个颜色的插件。可以通过chalk.blue(‘hello world’)来改变颜色
const chalk = require('chalk')
//在控制台输入带图标的文字
const ora = require('ora')
//从github或者gitlab下载模版
const download = require('download-git-repo')
//文件读写的模块
const fs = require('fs')

program
  .command('init')
  .description('生成一个react项目--[react-easy-start]')
  .alias('i')
  .action(() => {
      co(function * () {
        let projectName = yield prompt(chalk.blue('请输入项目名称: (react-moledy-peoject) '));
        let projectVersion = yield prompt(chalk.blue('请输入项目版本: 1.0.0'));
        let name = projectName || "react-melody-staging";
        let version = projectVersion || "1.0.0";
        console.log(chalk.red("项目名称: ", name, "项目版本: ", version));
        const spinner = ora('正在下载，请等待...');
        spinner.start();
        //github项目地址，如果是gitlab需要在前面加上gitlab:
        //要下载到的本地文件夹
        //回调函数
        download("melodyWxy/react-melody-staging", `./${name}`, (err) => {
            if (err) {
                console.log(chalk.red(err))
                spinner.stop()
                return;
            }
            //读取文件
            fs.readFile(`./${name}/package.json`, 'utf8', function (err, data) {
                if(err) {
                  spinner.stop();
                  console.error(err);
                  return;
                }
                const packageJson = JSON.parse(data);
                packageJson.name = name;
                packageJson.version = version;
                var updatePackageJson = JSON.stringify(packageJson, null, 2);
                //写入文件
                fs.writeFile(`./${name}/package.json`, updatePackageJson, 'utf8', function (err) {
                    if(err) {
                        spinner.stop();
                        console.error(err);
                        return;
                    } else {
                        spinner.stop();
                        console.log(chalk.green('项目生成成功!'))
                        console.log(`
                            ${chalk.bgWhite.black('运行项目')}
                            ${chalk.yellow(`cd ${name}`)}
                            ${chalk.yellow('npm install')}
                            ${chalk.yellow('npm start')}
                        `);
                        process.exit()
                    }
                });
            })
        })
    })
  })

program.parse(process.argv)//node.js命令行界面的完整解决方案，处理用户输入；
}
runCli();
