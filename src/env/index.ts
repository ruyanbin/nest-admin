import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';

const configFileNameObj = {
    development: 'dev',
    test: 'test',
    production: 'prod',
};

const env = process.env.NODE_ENV || 'development';

export default () => {
    const index = yaml.load(
        readFileSync(join(__dirname, `./index.yml`), 'utf8'),
    ) as Record<string, any>;
    const obj = yaml.load(
        readFileSync(join(__dirname, `./${configFileNameObj[env]}.yml`), 'utf8'),
    ) as Record<string, any>;
    return Object.assign({}, index, obj)
};
