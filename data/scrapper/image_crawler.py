# data/scrapper/image_crawler.py

from icrawler.builtin import GoogleImageCrawler

# Define your categories and keywords
keywords = {
    'fertilizer': [
        'YaraMila fertilizer Kenya packaging',
        'Mavuno Fertilizer Kenya packaging',
        'Safi Organic fertilizer Kenya packaging',
        'Fanisi fertilizer Kenya packaging',
        'Amiran Kenya fertilizer packaging'
    ],
    'pesticide': [
        'Syngenta Actara pesticide Kenya packaging',
        'Osho pesticide Kenya packaging',
        'Termidor pesticide Kenya packaging',
        'Baygon insecticide Kenya packaging',
        'Jopestkil pesticide Kenya packaging'
    ],
    'animal_feed': [
        'Sigma Feeds Kenya packaging',
        'Belmill animal feed Kenya packaging',
        'Unga Group animal feed Kenya packaging',
        'De Heus Kenya animal feed packaging',
        'Kenchick poultry feed Kenya packaging'
    ]
}

def crawl_all():
    for category, kw_list in keywords.items():
        for kw in kw_list:
            company = kw.split()[0]  # safe company name
            folder = f"data/raw/{category}/{company}"
            crawler = GoogleImageCrawler(storage={'root_dir': folder})
            crawler.crawl(keyword=kw, max_num=100)

if __name__ == '__main__':
    crawl_all()
