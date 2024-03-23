const Banner = require("../models/bannerModel")


/*....................................................show banner......................................................*/
const getBanner = async (req,res,next) => {
    try{
        const data = await Banner.find({}).lean()
        res.render('admin/banner',{data})

    }catch(error){
        console.error(error);
        const err = new Error('Internal server error');
        err.statusCode = 500;
        next(err);
    }
}

/*............................................get banner page....................................................*/
const showPage = async (req,res,next) => {
    try{
        res.render('admin/addBanner')
    }catch(error){
        console.error(error)
        const err = new Error('Internal server error')
        err.statusCode = 500
        next(err)
    }
}


/*...................................................add banner.................................................*/
const addBanner = async (req,res,next) => { 
    try{
        const filepath = req.file.filename;
        console.log(filepath)
        const banner = await Banner.create(req.body)
        const bannerId = banner._id
        const ban = await Banner.findByIdAndUpdate(
            bannerId,
            { image: filepath }
        );
        res.redirect('banner')
    }catch(error){
        console.error(error);
        const err = new Error();
        err.statusCode = 500;
        next(err);
    }
}

/*......................................................delete banner..............................................................*/
const deleteBanner = async (req,res,next) => {
    const bannId = req.params.id 
    try{
        const deleteBann = await Banner.deleteOne({_id: bannId})
        if(deleteBann){
            const banner = await Banner.find().lean();
            res.redirect('/admin/banner')
        }else{
            res.render('admin/banner',{Error:'Banner not found..'})
        }

    }catch (error){
        console.error(error)
        const err = new Error();
        err.statusCode = 404;
        next(err);
    }
}


const addOther = async(req,res,next) => {
    console.log(req.body)
    try{
        await Banner.updateOne({},{$set:{text1:req.body.text1,
            text2:req.body.text2,
            description1:req.body.description1,
            description2:req.body.description2,
            redirectionUrl:req.body.url,}})
            res.redirect('banner')
    }catch(error){
        console.error(error);
        const err = new Error();
        err.statusCode = 500;
        next(err);
    }
}
module.exports={getBanner,showPage,addBanner,deleteBanner,addOther}