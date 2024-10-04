export class Languages {
    static languages: LanguageFlag[] = [
        {
            lang: 'en',
            name: 'English',
            flag: '../../../assets/images/flags/united-states.svg',
        },
        {
            lang: 'fa',
            name: 'پارسی ',
            flag: '../../../assets/images/flags/iran.svg',
        },
    ];
}

export interface LanguageFlag {
    lang: string;
    name: string;
    flag: string;
    active?: boolean;
}
