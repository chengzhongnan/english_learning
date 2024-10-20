interface MaterialConfig {
    name: string,
    desc: string,
    image: string
}
export function getMaterialTypes(): MaterialConfig[] {
    return [
        {
            "name": "news",
            "desc": "News articles from various sources.",
            "image": "https://pub-3294fa67962142329433e7edea572259.r2.dev/news.jpg"
        },
        {
            "name": "storys",
            "desc": "A collection of storys.",
            "image": "https://pub-3294fa67962142329433e7edea572259.r2.dev/storys.jpg"
        }
    ];
}

export function getReadingMaterialTableName(type: string): string | undefined {
    switch (type) {
        case 'storys':
            return 'tb_jokes_material'
        case 'news':
            return 'tb_news_material'
    }

    return undefined;
}

export function getQuestionsTableName(type: string): string | undefined {
    switch (type) {
        case 'storys':
            return 'tb_jokes_questions'
        case 'news':
            return 'tb_news_questions'
    }

    return undefined;
}