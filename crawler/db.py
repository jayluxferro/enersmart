"""
Author: Jay Lux Ferro
Database helper
"""

import sqlite3
import func as fx

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

