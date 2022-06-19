
const express = require('express')
const uuid =  require("uuid") //Library to generate the id 
const cors = require("cors")

const port = 3001
const app = express()
app.use(express.json())
app.use(cors())


const orders = []

//Middlewares to compare my id 

const checkOrderId = (request, response, next) => {
 const {id} = request.params
 const index = orders.findIndex(order => order.id === id)

 if(index < 0){
     return response.status(404).json({message:"user not found"})
 }

 request.clientIndex = index
 request.clientId = id

 next()
}

//Middlewares to discover method
const  checkMethod = (request, response, next) =>{

    console.log(request.method)
    console.log(request.url)


    next()
}

//GET method to see all orders placed

app.get('/orders',checkMethod, (request, response) =>{
    return response.json(orders)
})

// POST method to creat new ordes

app.post('/orders', checkMethod, (request, response) =>{

    const {income, clientName} = request.body

    const order = {id: uuid.v4(), income, clientName, status:"em preparação"}

    orders.push(order)

    console.log( `pedido do(a) cliente ${clientName} em preparação`)

    return response.status(201).json(order)

})

// PUT method to upadate orders 

app.put('/orders/:id', checkOrderId, checkMethod, (request, response) => {
    
    const id = request.clientId
    const index = request.clientIndex

 const {income, clientName, price } = request.body
 const updadetUser = { id, income, clientName, price, status:"em preparação"}


 orders[index] = updadetUser

 return response.json(updadetUser)

})

// DELETE method 

app.delete('/orders/:id', checkOrderId, checkMethod,(request, response)=> {

    const index = request.clientIndex
     
orders.splice(index,1)
return response.status(204).json()
})

// GET method to show a specific order


app.get('/orders/:id', checkOrderId,  checkMethod,(request, response) => {

    const index = request.clientIndex
    const id = request.clientId

    const order = orders.find(order => order.id === id)

    return response.json(order)
} )

// PATCH method to update the order status

app.patch('/orders/:id', checkOrderId, checkMethod, (request, response) =>{

    const index = request.clientIndex
    const id = request.clientId
    const {status} = request.body
    const {income, clientName, price} = orders.find(order => order.id === id)

   const order = {id, income, clientName, price, status}

   return response.json(order)
})

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})
