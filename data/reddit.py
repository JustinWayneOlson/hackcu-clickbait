import praw
import requests
import csv

reddit = praw.Reddit(client_id='',
         client_secret='-_4',
         user_agent='',
         username='',
         password='')
with open('ml.csv', 'wb') as csv_file:
    wr = csv.writer(csv_file)
    for submission in reddit.subreddit('news').top(limit=500):
        submissionTitle = submission.title.encode('utf-8')
        submissionUrl = submission.url.encode('utf-8')
        wr.writerow([submissionTitle,submissionUrl,"No"])
