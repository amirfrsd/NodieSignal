var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var oneSignal = require('onesignal')('[ENTER API KEY]', '[ENTER APP ID]', false);
var app = express();
var port = process.env.port || 7575;
var router = express.Router();
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use('/',router);
mongoose.connect('mongodb://localhost/nodiesignal');
var deviceSchema = new mongoose.Schema({
    playerToken:{type:String, unique:true},
    playerOneSignalID:String,
    osType:String
});
var device = mongoose.model('devices',deviceSchema);
router.get('/', function(req, res){
    res.send('<h4>Add new device - POST /newplayer</h4><h5>Parameters:</h5> {"token" : device_token_from_onesignal,"os": ios_or_android}<h4>Update existing device - PUT /player</h4><h5>Parameters:</h5> {"token" : old_device_token,"newtoken": latest_token_from_onesignal}<h4>Send Push Notification - POST /sendmessage</h4><h5>Parameters:</h5> {"message" : message_to_send,"data":additional_payload_data}');
});
router.post('/newplayer', function(req, res){
    var deviceObject = new device({playerToken:req.body.token,playerOneSignalID:"",osType:req.body.os});
    deviceObject.save(function(err){
        if (err) res.json({success:false, message:err});
        oneSignal.addDevice(req.body.token,req.body.os).then(function(osid){
            device.findOneAndUpdate({playerToken:req.body.token},{playerOneSignalID:osid},function(err,obj){
                if (err) res.json({success:false, message:err});
                res.json({success:true, message:'everything done'});        
            });
        });
    });
});
router.put('/player', function(req, res){

});
router.post('/sendmessage', function(req,res) {
    
});
app.listen(port);
console.log('Hey there, Mate :P');