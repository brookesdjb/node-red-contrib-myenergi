# node-red-contrib-myenergi

A simple node-red node for getting the status of myenergi products. This is a work in progress, see below for the planned features. 


## Get all Devices

### To get all devices, keep msg.product and msg.serial blank. The returned object holds 3 arrays, one for each type of product: havi, eddi and zappi

## Get all of one type of device
### To get the stats of all of one type of device, set msg.product to the type of product you wish to get stats about. E.g. msg.product='zappi' would return an array of objects, one for each of your zappis

## Get one specific device
### To get the stats of one device set both the msg.product (to be the product type) and msg.serial to be the serial of the device you wish to get data about

# Future Development
Future development will include a config node for the hub serial and API key. I also plan to split the getters into seperate nodes, if no serial is passed so the single getters it will return the first in the array which should be fine for msot people: 
`
getStatusAll
getStatusZappiAll
getStatusZappi
getStatusHarviAll
getStatusHarvi
getStatusEddiAll
getStatusEddi
`
Finally I will work on the setters for the Zappi and Havi

I am not responsible for the underlying API (myenergi-api), all credit for the api to bisand - https://github.com/bisand/myenergi-api
