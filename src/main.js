import chalk from 'chalk';
import fs from 'fs';
import ncp from 'ncp';
import path from 'path';
import { promisify } from 'util';
import execa from 'execa';
import Listr from 'listr';
import { projectInstall } from 'pkg-install';

const access = promisify(fs.access);
const copy = promisify(ncp);

async function copyTemplateFiles(options) {
    return copy(options.templateDirectory, options.targetDirectory, { clobber: false });
}

async function gitInit(options) {
    const result = await execa('git', ['init'], {
        cwd: options.targetDirectory
    });
    if (result.failed) {
        return Promise.reject(new Error('Failed to initialize Git.'));
    }
    return;
}

async function setENV(options) {
    const line1 = '\ndbURL=mongodb://localhost:27017/' + options.project;
    fs.appendFileSync(options.targetDirectory + '/.env', line1);
    const base64data = Buffer.from(options.project).toString('base64');
    const line2 = '\nJWT_SECRET_KEY=' + base64data;
    fs.appendFileSync(options.targetDirectory + '/.env', line2);
    return;
}

export async function generateProject(options) {

    if (!fs.existsSync('./' + options.project)) {
        await fs.mkdirSync('./' + options.project);
        process.chdir(options.project);
    }

    options = {
        ...options,
        targetDirectory: options.targetDirectory || process.cwd()
    };

    const srcTemplate = options.advanced === true ? 'advanced' : 'basic';
    // const currentFileUrl = import.meta.url;
    // let templateDir = path.resolve(
    //     new URL(currentFileUrl).pathname,
    //     '../../templates',
    //     // options.template.toLowerCase()
    //     srcTemplate
    // );

    const srcApps = path.join(__dirname, '..', 'templates', srcTemplate);
    
    // const templateRefine = templateDir.split(':');
    // if (templateRefine.length > 2) {
    //     templateDir = templateRefine[1] + ':' + templateRefine[2];
    // }
    options.templateDirectory = srcApps;

    try {
        await access(options.templateDirectory, fs.constants.R_OK);
    } catch (err) {
        console.log(err);
        console.error(`%s Invalid template name`, chalk.red.bold('ERROR'));
        process.exit(1);
    }

    if (options.advanced) {
        const tasks = new Listr([
            {
                title: 'Copy project files',
                task: () => copyTemplateFiles(options)
            },
            {
                title: 'Set environments',
                task: () => setENV(options)
            },
            {
                title: 'Initialize git',
                task: () => gitInit(options),
                enabled: () => options.git
            },
            {
                title: 'Install dependencies',
                task: () => projectInstall({
                    cwd: options.targetDirectory
                }),
                skip: () => !options.runInstall ? 'Pass --install / -i to automatically install dependencies!' : undefined
            }
        ]);
    
        await tasks.run();
    
        console.log(`%s ${options.project} - API express application was ready!`, chalk.green.bold('DONE'));
        console.log(chalk.yellow(`Never forget to specifies the db name in the .env file`));
        return true;
    } else {
        const tasks = new Listr([
            {
                title: 'Copy project files',
                task: () => copyTemplateFiles(options)
            },
            {
                title: 'Initialize git',
                task: () => gitInit(options),
                enabled: () => options.git
            },
            {
                title: 'Install dependencies',
                task: () => projectInstall({
                    cwd: options.targetDirectory
                }),
                skip: () => !options.runInstall ? 'Pass --install / -i to automatically install dependencies!' : undefined
            }
        ]);
    
        await tasks.run();
    
        console.log(`%s ${options.project} - API express application was ready!`, chalk.green.bold('DONE'));
        return true;
    }   
}