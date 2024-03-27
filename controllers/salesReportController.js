const {jsPDF} = require('jspdf')
                require('jspdf-autotable')

const { JSDOM } = require("jsdom");
const Order = require('../models/orderModel');
const fastCsv = require('fast-csv');
const fs = require('fs');
const path = require('path');
const { table } = require('console');

const salesReport = async (req,res) => {
   res.render('admin/salesReport')
}

const getSalesReport = async (req,res,next) => {
    try{
        const date = req.query.date;
        const selectedDate = new Date(date);
        const orders = await Order.find({})
        const final = orders.map((order)=>{
            const dateString = order.date;
            order.date = new Date(dateString).toISOString().split('T')[0];
            return order;
        })
        const data = final.filter((order)=> order.date===date && order.status==='Delivered')
    }catch(error){
      console.error(error)
      const err = new Error()
      err.statusCode = 404
      next(err);
    }
  }

  const getSales = async (req,res,next) => {
    try{
        const date = req.body.selectedDate;
        const selectedDate = new Date(date);
        const orders = await Order.find({}).lean()
        const final = orders.map((order)=>{
            const dateString = order.date;
            order.date = new Date(dateString).toISOString().split('T')[0];
            return order;
        })
        const type='daily'
        const start = date
        const data = final.filter((order)=> order.date===date && order.status==='Delivered')
        res.render('admin/salesReport',{data,start,type})
    }catch(error){
        console.error(error)
        const err = new Error()
        err.statusCode = 500
        next(err)
    }
  }

  const dailyCsv = async(req,res,next)=>{
    try{
        const date = req.query.date;
        const selectedDate = new Date(date);
        const orders = await Order.find({}).lean()
        const final = orders.map((order)=>{
            const dateString = order.date;
            order.date = new Date(dateString).toISOString().split('T')[0];
            return order;
        })
        const data = final.filter((order)=> order.date===date && order.status==='Delivered')
        const csvStream = fastCsv.format({ headers: true });
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', `attachment; filename=dailyorders.csv`);
            csvStream.pipe(res);
            data.forEach((order) => {
                csvStream.write(order);
            });
            csvStream.end();
    }catch(error){
        console.error(error)
        const err = new Error()
        err.statusCode = 500
        next(err)
    }
  }


  const customReport = async (req,res,next) => {
    try{
        const start = req.body.start
        const end = req.body.end
        const orders = await Order.find({}).lean()
        const final = orders.map((order)=>{
            const dateString = order.date;
            order.date = new Date(dateString).toISOString().split('T')[0];
            return order;
        })
        const type= 'custom'
        const data = final.filter((order)=>{
            return order.date >= start && order.date <= end && order.status==='Delivered'})
        res.render('admin/salesReport',{data,start,end,type})
    }catch(error){
        console.error(error);
        const err = new Error();
        err.statusCode = 500
        next(err)
    }
}

const customCsv = async(req,res,next)=>{
    try{
        const start = req.query.start
        const end = req.query.end
        const orders = await Order.find({}).lean()
        const final = orders.map((order)=>{
            const dateString = order.date;
            order.date = new Date(dateString).toISOString().split('T')[0];
            return order;
        })
        const data = final.filter((order)=>{
            return order.date >= start && order.date <= end && order.status==='Delivered'})
            const csvStream = fastCsv.format({ headers: true });
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=customorders.csv`);
        csvStream.pipe(res);
        data.forEach((order) => {
            csvStream.write(order);
        });
        csvStream.end();
    }catch(error){
        console.error(error)
        const err = new Error()
        err.statusCode = 500
        next(err)
    }
}
  
const monthlyReport = async(req,res,next) =>{
    try{
        const date = req.body.selectedDate;
        const currentDate = new Date();
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59, 999);
        const start = startOfMonth.toISOString().split('T')[0];
        const end = endOfMonth.toISOString().split('T')[0];
        const orders = await Order.find({}).lean()
        const final = orders.map((order)=>{
            const dateString = order.date;
            order.date = new Date(dateString).toISOString().split('T')[0];
            return order;
        })
        const type='monthly'
        const data = final.filter((order)=>{
            return order.date > start && order.date <= end && order.status==='Delivered' })
            res.render('admin/salesReport',{data,type})
    }catch(error){
        console.error(error)
        const err = new Error()
        err.statusCode = 500
        next(err);
    }
}

const monthlyCsv = async(req,res,next)=>{
    try{
        const date = req.query.month;
        console.log(date)
        const currentDate = new Date(date);
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59, 999);
        const start = startOfMonth.toISOString().split('T')[0];
        const end = endOfMonth.toISOString().split('T')[0];
        const orders = await Order.find({}).lean()
        const final = orders.map((order)=>{
            const dateString = order.date;
            order.date = new Date(dateString).toISOString().split('T')[0];
            return order;
        })
        const data = final.filter((order)=>{
            return order.date > start && order.date <= end && order.status==='Delivered'})
        const csvStream = fastCsv.format({ headers: true });
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=monthlyorders.csv`);
        csvStream.pipe(res);
        data.forEach((order) => {
            csvStream.write(order);
        });
        csvStream.end();
       
    }catch(error){
        console.error(error)
        const err = new Error()
        err.statusCode = 500
        next(err)
    }
}

const yearlyReport = async (req,res,next) =>  {
    try{
        const year = req.body.year;
        const startOfYear = new Date(year, 0, 1);
        const endOfYear = new Date(year, 11, 31, 23, 59, 59, 999);
        const starts = startOfYear.toISOString().split('T')[0];
        const end = endOfYear.toISOString().split('T')[0];
        const orders = await Order.find({}).lean()
        const final = orders.map((order)=>{
            const dateString = order.date;
            order.date = new Date(dateString).toISOString().split('T')[0];
            return order;
        })
        const type='yearly'
        const start=year
        const data = final.filter((order)=>{
            return order.date > starts && order.date <= end && order.status==='Delivered'})
        res.render('admin/salesReport',{data,type,start})    
    }catch(error){
        console.error(error)
        const err = new Error()
        err.statusCode = 500
        next(err)
    }
}

const yearlyCsv = async(req,res,next)=>{
    try{
        const val =req.query.year;
        console.log(val)
        const startOfYear = new Date(val, 0, 1);
        const endOfYear = new Date(val, 11, 31, 23, 59, 59, 999);
        const start = startOfYear.toISOString().split('T')[0];
        const end = endOfYear.toISOString().split('T')[0];
        const orders = await Order.find({}).lean()
        const final = orders.map((order)=>{
            const dateString = order.date;
            order.date = new Date(dateString).toISOString().split('T')[0];
            return order;
        })
        const data = final.filter((order)=>{
            return order.date > start && order.date <= end && order.status==='Delivered'})

        const csvStream = fastCsv.format({ headers: true });
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=orders_${val}.csv`);
        csvStream.pipe(res);
        orders.forEach((order) => {
            csvStream.write(order);
        });
        csvStream.end();
   
    }catch(error){
        console.error(error)
        const err = new Error()
        err.statusCode = 500
        next(err)
    }
}

const pdf = async(req,res,next) => {
    const type = req.query.type
    try{
        if(type=='daily'){
            const date = req.query.start
            const orders = await Order.find({}).lean()
            const final = orders.map((order)=>{
            const dateString = order.date;
            order.date = new Date(dateString).toISOString().split('T')[0];
            return order;
            })
        const data = final.filter((order)=> order.date===date && order.status==='Delivered')
        
        let table=[]
        for(let i of data){
            let row=[]
            row.push(i.productname)
            row.push(i.date)
            row.push(i.fname)
            row.push(i.total)
            row.push(i.paymentoption)
            row.push(i.payment)
            row.push(i.status)
            table.push(row)
        }
        const doc= new jsPDF()
        doc.autoTable({
            head:[['Products','Date','Customer','Total','PaymentOption','Payment','Status']],
            body:table,
        })
        doc.save('table.pdf')
        console.log('./table.pdf generated')
        res.download('table.pdf')
        }
        else if(type == 'custom'){
            const start = req.query.start
            const end = req.query.end
            const orders = await Order.find({}).lean()
        const final = orders.map((order)=>{
            const dateString = order.date;
            order.date = new Date(dateString).toISOString().split('T')[0];
            return order;
        })
        const data = final.filter((order)=>{
            return order.date >= start && order.date <= end && order.status==='Delivered'})
        
            let table=[]
            for(let i of data){
                let row=[]
                row.push(i.productname)
                row.push(i.date)
                row.push(i.fname)
                row.push(i.total)
                row.push(i.paymentoption)
                row.push(i.payment)
                row.push(i.status)
                table.push(row)
            }
            const doc= new jsPDF()
            doc.autoTable({
                head:[['Products','Date','Customer','Total','PaymentOption','Payment','Status']],
                body:table,
            })
            doc.save('table.pdf')
            console.log('./table.pdf generated')
            res.download('table.pdf')
        }
        else if(type == 'yearly'){
            const year = req.query.start;
            const startOfYear = new Date(year, 0, 1);
            const endOfYear = new Date(year, 11, 31, 23, 59, 59, 999);
            const start = startOfYear.toISOString().split('T')[0];
            const end = endOfYear.toISOString().split('T')[0];
            const orders = await Order.find({}).lean()
            const final = orders.map((order)=>{
                const dateString = order.date;
                order.date = new Date(dateString).toISOString().split('T')[0];
                return order;
            })
            const data = final.filter((order)=>{
                return order.date > start && order.date <= end && order.status==='Delivered'})
            
                let table=[]
                for(let i of data){
                    let row=[]
                    row.push(i.productname)
                    row.push(i.date)
                    row.push(i.fname)
                    row.push(i.fname)
                    row.push(i.total)
                    row.push(i.paymentoption)
                    row.push(i.payment)
                    row.push(i.status)
                    table.push(row)
                }
                const doc= new jsPDF()
                doc.autoTable({
                    head:[['Products','Date','Customer','Total','PaymentOption','Payment','Status']],
                    body:table,
                })
                doc.save('table.pdf')
                console.log('./table.pdf generated')
                res.download('table.pdf')
     
        }
        else if(type=='monthly'){
        const currentDate = new Date();
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59, 999);
        const start = startOfMonth.toISOString().split('T')[0];
        const end = endOfMonth.toISOString().split('T')[0];
        const orders = await Order.find({}).lean()
        const final = orders.map((order)=>{
            const dateString = order.date;
            order.date = new Date(dateString).toISOString().split('T')[0];
            return order;
        })
        const data = final.filter((order)=>{
            return order.date > start && order.date <= end && order.status==='Delivered' })
            let table=[]
            for(let i of data){
                let row=[]
                row.push(i.productname)
                row.push(i.date)
                row.push(i.fname)
                row.push(i.fname)
                row.push(i.total)
                row.push(i.paymentoption)
                row.push(i.payment)
                row.push(i.status)
                table.push(row)
            }
            const doc= new jsPDF()
            doc.autoTable({
                head:[['Products','Date','Customer','Total','PaymentOption','Payment','Status']],
                body:table,
            })
            doc.save('table.pdf')
            console.log('./table.pdf generated')
            res.download('table.pdf')

        }
          
    }catch(error){
        console.error(error)
        const err = new Error()
        err.statusCode = 500
        next(err)
    }
}

  module.exports = {salesReport,
    getSalesReport,
    getSales,
    customReport,
    monthlyReport,
    yearlyReport,
    yearlyCsv,
    monthlyCsv,
    dailyCsv,
    customCsv,
    pdf}