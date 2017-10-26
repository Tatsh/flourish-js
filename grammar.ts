/**
 * @private
 */
interface StringStringMap {
    [s: string]: {
        [s: string]: string;
    };
}

/**
 * @private
 */
let GlobalCache: StringStringMap = {
    humanize: {},
    underscorize: {},
};

export class Grammar {
    private cache: StringStringMap;
    private rules: StringStringMap = {
        humanize: {},
        underscorize: {},
    };

    constructor(useGlobalCache: boolean = false) {
        if (!useGlobalCache) {
            this.cache = GlobalCache;
        } else {
            this.cache = {
                humanize: {},
                underscorize: {},
            };
        }
    }

    underscorize(str: string) {
        if (this.rules.underscorize[str]) {
            return this.rules.underscorize[str];
        }

        if (this.cache.underscorize[str]) {
            return this.cache.underscorize[str];
        }

        const original = str;
        str = str[0].toLowerCase() + str.substr(1);

        if (str.indexOf('_') !== -1 && str.toLowerCase() === str) {
        } else if (str.indexOf(' ') !== -1) {
            str = str.replace(/\s+/g, '_').toLowerCase();
        } else {
            let old;
            const delimiter = '_';
            do {
                old = str;
                str = str.replace(/([a-zA-Z])([0-9])/, '$1' + delimiter + '$2');
                str = str.replace(/([a-z0-9A-Z])([A-Z])/, '$1' + delimiter + '$2');
            } while (old !== str);
            str = str.toLowerCase();
        }

        this.cache.underscorize[original] = str;

        return str;
    }

    humanize(str: string, delimiterRegex: RegExp|null = null) {
        if (this.rules.humanize[str]) {
            return this.rules.humanize[str];
        }
        if (this.cache.humanize[str]) {
            return this.cache.humanize[str];
        }

        const original = str;

        if (str.indexOf(' ') === -1) {
            if (str.indexOf('_') === -1) {
                str = this.underscorize(str);
            }

            str = str.replace(/_/g, ' ');
            if (delimiterRegex) {
                str = str.replace(delimiterRegex, ' ');
            }

            // Upper-case every word
            let split = str.split(' ');
            split.forEach((v: string, i: number) => {
                split[i] = v[0].toUpperCase() + split[i].substr(1);
            });
            str = split.join(' ');

            const regex = /(\b(api|css|gif|html|id|jpg|js|mp3|pdf|php|png|sql|swf|url|xhtml|xml)\b)/gi;
            str = str.replace(regex, (m0: string) => {
                return m0.toUpperCase();
            });

            // Finally, to satisfy "somefile.doc" -> Somefile.Doc
            str = str.replace(/\.(\w+)$/, (m0: string, m1: string) => {
                return `.${m1[0].toUpperCase()}${m1.substr(1)}`;
            });
        }

        this.cache.humanize[original] = str;

        return str;
    }
}
