###

A pub/sub and variable exchange for CAGEN

@author Destin Moulton
@git https://github.com/destinmoulton/cagen
@license MIT

Subscribe and publish to a channel.
Set and get global variables.

###

class Bus

    constructor:()->
        @_channels = {}
        @_vault = {}

    subscribe: (channel, callback)=>
        if not @_channels.hasOwnProperty(channel)
            @_channels[channel] = []

        @_channels[channel].push(callback)

    broadcast: (channel, payload)->
        if @_channels.hasOwnProperty(channel)
            for subscriber in @_channels[channel]
                subscriber(payload)
        else console.log("Bus: Unable to find #{channel} channel.")

    set: (name, variable)->
        @_vault[name] = variable

    get: (name)->
        if not @_vault.hasOwnProperty(name)
            console.log("Bus: Unable to find #{name} in variable vault.")
        else return @_vault[name]