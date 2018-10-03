'use strict'

const TMan = require('tman-wrtc')
const merge = require('lodash.merge')

class TManGPS extends TMan{
    
    constructor (options = {}, parent) {
        super(merge(
            {
                ranking: (neighbor) => (a, b) => {
                
                    const da = (
                        Math.sqrt(
                            Math.pow((a.descriptor.x - neighbor.descriptor.x),2) +
                            Math.pow((a.descriptor.y - neighbor.descriptor.y),2)
                        ))
                    const db = (
                        Math.sqrt(
                            Math.pow((b.descriptor.x - neighbor.descriptor.x),2) +
                            Math.pow((b.descriptor.y - neighbor.descriptor.y),2)
                        ))

                    return (da-db)
                }
            },
            options
        ), parent)

        if(!this.isValidDescriptor(this.options.descriptor)){
            this.options.descriptor.x = Math.round(Math.random()*30)
            this.options.descriptor.y = Math.round(Math.random()*30)
        }

    }

    setDescriptor(descriptor){
        if(this.isValidDescriptor(descriptor)){
            this.options.descriptor = descriptor;
        }
    }


    isValidDescriptor(descriptor){
        return descriptor.x && descriptor.y
    }

}

module.exports = TManGPS