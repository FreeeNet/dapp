(function(){

angular.module('safemarket').factory('Court',function(utils,ticker){

function Court(addr){
	this.addr = addr
	this.contract = web3.eth.contract(this.abi).at(addr)
	this.update()
}

window.Court = Court

Court.prototype.code = Court.code = '0x'+contractDB.Court.compiled.code
Court.prototype.abi = Court.abi = contractDB.Court.compiled.info.abiDefinition

Court.create = function(meta,feeTenths){
	var meta = typeof meta === 'string' ? meta : utils.convertObjectToHex(meta)
		,deferred = Q.defer()
		,CourtContract = web3.eth.contract(Court.abi)
		,txObject = {
			data:Court.code
			,gas:this.estimateCreationGas(meta,feeTenths)
			,gasPrice:web3.eth.gasPrice
			,from:web3.eth.accounts[0]
		},txHex = CourtContract.new(meta,feeTenths,txObject).transactionHash

	utils.waitForTx(txHex).then(function(tx){
		var court = new Court(tx.contractAddress)
		deferred.resolve(court)
	},function(error){
		deferred.reject(error)
	}).catch(function(error){
		console.error(error)
	})

	return deferred.promise
}

Court.check = function(meta,feeTenths){
	utils.check(meta,{
		name:{
			presence:true
			,type:'string'
		},info:{
			type:'string'
		}
	})

	if(typeof feeTenths!== 'string')
		feeTenths = feeTenths.toString()

	utils.check({fee:feeTenths},{
		fee:{
			presence:true
			,type:'string'
			,numericality:{
				integersOnly:true
				,greaterThanOrEqualTo:0
				,lessThanOrEqualTo:100
			}
		}
	})
}

Court.estimateCreationGas = function(meta,feeTenths){
	meta = typeof meta === 'string' ? meta : utils.convertObjectToHex(meta)

	var deferred = Q.defer()
		,CourtContract = web3.eth.contract(this.abi)

	return CourtContract.estimateGas(meta,feeTenths,{
		data:Court.code
	})
}

Court.prototype.set = function(meta,feeTenths){
	meta = utils.convertObjectToHex(meta)

	var deferred = Q.defer()
		,court = this
		,txHex = this.contract.setMeta(meta,feeTenths,{gas:this.contract.setMeta.estimateGas(meta)})

	utils.waitForTx(txHex).then(function(){
		court.update()
		deferred.resolve(court)
	},function(error){
		deferred.reject(error)
	})

	return deferred.promise
}


Court.prototype.update = function(){
	this.meta = utils.convertHexToObject(this.contract.getMeta())
	this.judge = this.contract.getJudge()
	this.feeTenths = this.contract.getFeeTenths()
}

function Product(data){
	this.name = data.name
	this.price = new BigNumber(data.price)
	this.info = data.info
	this.quantity = 0
}

return Court

})

}())