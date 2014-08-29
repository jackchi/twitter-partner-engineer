#!/usr/bin/python -tt
# Jack Chi @_jackchi_

# Twitter's Partner Engineer Question

"""TopSites exercise

The main() below is already defined and complete. It calls top_sites()

HTTP allows clients and servers to set 'cache-control' to adjust how statis & dynamic
contents are stored on both client devices and proxy store. For example, storing images on
the ISPs servers instead of making a full request to the server. The correct cache-control 
settings could be advantageous for a site getting lots of traffic; both in speed performance 
and cost savings. 

Incremental Development

1. Get the HTTP Response 'cache-control' header out from any URL
2. Parse and store top 100 most visited sites in the World
3. Makes asyncronous requests and comes back

"""

import sys
import requests
import re
import threading


# Look at 4 static HTML pages for top sites
alexa = ['http://www.alexa.com/topsites', 'http://www.alexa.com/topsites/global;1',
'http://www.alexa.com/topsites/global;2', 'http://www.alexa.com/topsites/global;3']
topSites_url = []
topSites_Dict = {}

def parseTopSites(links):
  """
    Parse out top 100 most visited websites 
    Store into topSites_url
  """
  print "Parsing Top 100 Global Websites..."

  # Regex for extracting site URI
  rSite = re.compile(r'<p class="desc-paragraph">[\t\n\r]*<a href=".+">(.+)</a>')
  for a in links:
    r = requests.get(a)
    sites = re.findall(rSite, r.text)
    for site in sites: # encode and store
      topSites_url.append("http://" + site.lower().encode('ascii'))

  return

# HTTP gets from url extracts and returns an Header tuple (url, header)
def cache_control_header(url):
  """
    Stores (url, header.cache-control) HTTP Header information
  """
  setting = ()
  try:
    r = requests.get(url, timeout=0.5)
    setting = (url, r.headers['cache-control'])
    topSites_Dict[url] = setting
    print "Connecting to : " + url + " : " + r.reason
  except:    # This is the correct syntax
    print "Error Connecting to " + url
  
  return 

# Main launches threads to make HTTP connections
def main():
  threads = []

  # Time the program 
  import timeit
  start = timeit.default_timer()
  
  # Async HTTP call
  for i in range(len(topSites_url)):
    t = threading.Thread(target=cache_control_header, args=(topSites_url[i],))
    threads.append(t)
    
  [t.start() for t in threads]
  [t.join() for t in threads]
  
  print "HTTP Response cache-control ... "
  for i in range(len(topSites_url)):
    if topSites_url[i] in topSites_Dict:
      print "%d: %s" % (i+1, topSites_Dict[topSites_url[i]])
    else:
      print "%d: %s" % (i+1, (topSites_url[i] , 'not able to reach' ))  
  
  stop = timeit.default_timer()
  print 'Total Running Time: %d seconds' % (stop - start)
  exit(1)

if __name__ == '__main__':
  parseTopSites(alexa)
  main()
