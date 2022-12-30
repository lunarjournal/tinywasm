#  .h descriptor generator
#
#  scripts/notice.py
#
#  Copyright (c) Dylan Muller, 2019
#
#  This program is free software; you can redistribute it and/or
#  modify it under the terms of the GNU General Public License
#  as published by the Free Software Foundation; either version 2
#  of the License, or (at your option) any later version.

import sys;
import re;
import datetime;
import inspect;

argc = len(sys.argv);

ARG_FILE = 1;
ARG_TITLE = 2;
ARG_DESC = 3;

if (argc <= 2 or argc > 4):
    print("usage: ./" + __file__ + " [file]" + " [title]" +
          " [description]");
    sys.exit(0);

f = open(sys.argv[ARG_FILE], 'r+');
f.seek(0);
image = f.read();
f.close();

image = re.sub(r'\/\*(\*(?!\/)|[^*])*\*\/', '', image, 1);

# define custom banner
notice = """/*  {}
 *  
 *  {}
 *  
 *  {}
 *  
 *  This program is free software; you can redistribute it and/or
 *  modify it under the terms of the GNU General Public License
 *  as published by the Free Software Foundation; either version 2
 *  of the License, or (at your option) any later version.
 *  
 *  Version: {}
 */""".format(sys.argv[ARG_TITLE], sys.argv[ARG_FILE].replace("./",''), 
              sys.argv[ARG_DESC], 
              datetime.datetime.now().replace(microsecond=0).isoformat());  
f = open(sys.argv[ARG_FILE], 'w+');
f.seek(0);
f.write(notice + image );
f.close();

