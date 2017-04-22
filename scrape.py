from bs4 import BeautifulSoup
import requests
import re
import csv
import time
import pprint as pp

pattern = re.compile('https?:\/\/([^\/]*)\/?|$')
response = requests.get('https://www.reddit.com/r/news/top', headers = {'User-agent': 'linux:sample.app:v1.0.0 (by /u/sunnys1d3up)'})
next_url = 'https://www.reddit.com/r/news/top'
for i in range(0,2000):
    with open('ml.csv', 'wb') as csv_file:
        wr = csv.writer(csv_file)
        response = requests.get(next_url)
        soup = BeautifulSoup(response.text, 'lxml')
        posts = soup.select("div#siteTable div.thing")
        for post in posts[0].select("p.title a"):
            temp_array = [post.text, re.match(pattern, post['href']).group(1), "No"]
            pp.pprint(temp_array)
            wr.writerow(temp_array)
        next_url = soup.select("span.next-button")[0].select("a")[0]['href']
        time.sleep(2)
