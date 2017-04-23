import re
import csv

pattern=re.compile('(?:^http:\/\/)|(?:^https:\/\/)?(?:[a-zA-Z0-9]*\.)?([a-zA-Z0-9]*)\..*')
with open('in_data.csv', 'rb') as in_csvfile:
    with open('out_data.csv', 'w') as out_csvfile:
        reader = csv.reader(in_csvfile, dialect=csv.excel_tab)
        writer = csv.writer(out_csvfile)
        for i, line in enumerate(reader):
            if(not(re.match(pattern,line[1]))):
                print line[1]
                #temp_array = []
                #temp_array.append(line[0])
                #temp_array.append(re.match(pattern,line[1]).group(1))
                #temp_array.append(line[2])
                #writer.writerow(temp_array)

