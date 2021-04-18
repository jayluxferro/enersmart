#!/usr/bin/env python3

import db
import json
import func as fx

## init
for _ in db.getMeters():
    meter = _['meter'].rstrip()
    res = fx.cli(['./cli', meter])
    if len(res) > 0 and res.find('balance') != -1:
        # parse data
        data = json.loads(res)
        db.insertLog(_['id'], data)
