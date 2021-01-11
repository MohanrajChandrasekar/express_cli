import arg from 'arg';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { generateProject } from './main';

function parseArgumentsIntoOptions(rawArgs) {
    const args = arg(
        {
            '--git': Boolean,
            '--yes': Boolean,
            '--install': Boolean,
            '-g': '--git',
            '-y': '--yes',
            '-i': '--install'
        },
        {
            argv: rawArgs.slice(2)
        }
    );
    return {
        skipPrompts: args['--yes'] || false,
        git: args['--git'] || false,
        runInstall: args['--install'] || false,
        project: args._[0] || ''
    };
}

async function promptForMissionOptions(opt) {
    let questions = [];
        let options = {
            project: opt.project,
            runInstall: opt.runInstall,
            advanced: false
        };

        if (!options.project || options.project === '') { // project name
            questions.push({
                type: 'input',
                name: 'project',
                message: 'Please provide a project name: '
            });
            const answer1 = await inquirer.prompt(questions);
            options.project = answer1.project.replace(/[^A-Z0-9]/ig, "");
            if (options.project === '') {
                console.log('Invalid project name');
                process.exit(1);
            }
        }

        questions = [];
        questions.push({ // mongoDB ?
            type: 'list',
            name: 'advanced',
            message: `Is project ${options.project} needs to be configured with mongoDB, JWT authentication, global error handling and default users schema? (Y/N)`,
            choices: ['Y', 'N'],
            default: false
        });
        const answer2 = await inquirer.prompt(questions);
        options.advanced = answer2.advanced === 'Y' ? true : false;

        questions = [];
        if (!options.git) {
            questions.push({
                type: 'list',
                name: 'git',
                message: 'Initialize a git repository? (Y/N)',
                choices: ['Y', 'N'],
                default: false
            });
        }
        const finalAnswers = await inquirer.prompt(questions);
        options.git = finalAnswers.git === 'Y' ? true : false;
        return options;
}

export async function cli(args) {
    let options = parseArgumentsIntoOptions(args);
    options = await promptForMissionOptions(options);
    await generateProject(options);
}