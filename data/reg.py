import re
import csv

pattern=re.compile('(?:http:\/\/|https:\/\/|^)(?:(\w*)\.\w*\/|\w*\.(\w*)\.)')
with open('in_data.csv', 'rb') as in_csvfile:
    with open('out_data.csv', 'w') as out_csvfile:
        reader = csv.reader(in_csvfile)
        writer = csv.writer(out_csvfile)
        for i, line in enumerate(reader):
            if(re.match(pattern,line[1])):
                temp_array = []
                temp_array.append(line[0])
                if(re.match(pattern,line[1]).group(1)):
                    temp_array.append(re.match(pattern,line[1]).group(1))
                elif(re.match(pattern,line[1]).group(2)):
                    temp_array.append(re.match(pattern,line[1]).group(2))
                else:
                    print "Invalid URL in row: {}".format(i)
                temp_array.append(line[2])
                writer.writerow(temp_array)

