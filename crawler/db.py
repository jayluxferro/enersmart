"""
Author: Jay Lux Ferro
Database helper
"""

import sqlite3
import func as fx
import datetime

def init():
    conn = sqlite3.connect("data")
    conn.row_factory = sqlite3.Row
    return conn

def getMeters():
    db = init()
    cursor = db.cursor()
    cursor.execute("select * from meters")
    return cursor.fetchall()

def insertLog(meterId, data):
    db = init()
    cursor = db.cursor()
    cursor.execute("insert into log(meterId, lastTopupAmount, balance, lastTopupDate, weekConsumption, highestConsumptionDay, maximumConsumption, lowestConsumptionDay, minimumConsumption, averageConsumption, date) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", (meterId, data["lastTopupAmount"], data["balance"], data["lastTopupDate"], data["weekConsumption"], data["highestConsumptionDay"], data["maximumConsumption"], data["lowestConsumptionDay"], data["minimumConsumption"], data["averageConsumption"], fx.getTime()))
    db.commit()

def getLog():
    db = init()
    cursor = db.cursor()
    cursor.execute("select * from log")
    return cursor.fetchall()


def getDay(date):
    fmt = "%Y-%m-%d %H:%M:%S"
    return datetime.datetime.strptime(date, fmt).weekday()

def getAvailability():
    data = [0 for x in range(7)]

    log = getLog()
    for x in log:
        data[getDay(x["date"])] += 1

    # convert to percentages
    avl = [ ((y/float(len(log))) * 100) for y in data]
    avl.insert(0, avl.pop())
    return avl
