#!/usr/bin/env python3

import db

with open("../data/avl.txt", "w") as f:
    f.write(str(db.getAvailability()))
