"""
Author: Jay Lux Ferro
Helper functions
"""

import subprocess
import os
from datetime import datetime

def cli(command):
    p = subprocess.Popen(command, stdout=subprocess.PIPE)
    return p.stdout.read().decode().rstrip()

def getTime():
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")
