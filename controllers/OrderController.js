import Order from "../models/Order.js"
import Product from "../models/Product.js"


export async function createOrder(req,res){
    if (!req.user) {
        res.status(403).json(
            {
                message : "Please loging and try again"
            }
        )
        return
    }
    if (req.body.name==null) {
        req.body.name = req.user.firstName+" "+req.user.lastName;
    }
    
    let orderId = "ORD000001"

    const lastOrder = await Order.find().sort({date : -1}).limit(1)

    if (lastOrder.length>0) {
        const orderIdString = lastOrder[0].orderId.replace("ORD","");
        const orderIdNumber = parseInt(orderIdString);
        const genarateNewOrderId = orderIdNumber + 1;
        const newOrderIdToString = String(genarateNewOrderId).padStart(6,"0");
        orderId = "ORD" + newOrderIdToString;
    }
    try{
    let total = 0;
    let labeledTotal = 0;
    const products = [];

    for(let i = 0; i < req.body.products.length; i++){
        const item = await Product.findOne({productId : req.body.products[i].productId})
        if(item==null){
            res.status(404).json(
                {
                    message : "Product with productId "+req.body.products[i].productId+" not found"
                }
            )
            return
        }
        if (item.isAvailabe==false) {
            res.status(404).json(
                {
                    message : "Product with productId "+req.body.products[i].productId+" is not available"
                }
            )
            return
        }
        products[i] = {
            productInfo : {
                productId : item.productId,
                name : item.productName,
                altNames : item.altNames,
                description : item.description,
                img : item.img,
                labeledPrice : item.labeledPrice,
                price : item.price
            },
            quantity : req.body.products[i].quantity
        }
        total = total + (req.body.products[i].quantity * item.price);
        labeledTotal = labeledTotal + (req.body.products[i].quantity * item.labeledPrice)
        
    }

    const order = new Order (
        {
            orderId : orderId,
            name : req.body.name,
            address : req.body.address,
            phone : req.body.phone,
            status : req.body.status,
            total : total,
            labeledTotal : labeledTotal,
            products : products
        }
    )
    const savedOrder = await order.save()
    res.json(
        {
            message : "Order is saved",
            order : savedOrder
        }
    )

    }catch(err){
        console.log(err)
        res.json(
            {
                message : "Order is not saved"
            }
        )
    }

    
}