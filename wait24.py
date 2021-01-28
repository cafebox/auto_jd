import time
import datetime
import logging
import sys

sleep_gap = 3
if len(sys.argv) == 2:
    sleep_gap = float(sys.argv[1])

target_hour = datetime.datetime.now().hour + 1
if target_hour == 24:
    target_hour = 0
    
while datetime.datetime.now().hour != target_hour:
    logging.warn(f'{datetime.datetime.now()}未到{target_hour}点')
    time.sleep(sleep_gap)
