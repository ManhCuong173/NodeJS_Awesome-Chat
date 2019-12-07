import { notification, contact, message } from '../service/index'
import { bufferToBase64, lastItemOfArray, convertTimestamptoHumenstamp } from './../helpers/clientHelper'
import request from 'request'

let getICETurnServer = () => {
  return new Promise(async (resolve, reject) => {
    // Node Get ICE STUN and TURN list
    let o = {
      format: "urls"
    };

    let bodyString = JSON.stringify(o);
    let options = {
      url: 'https://global.xirsys.net/_turn/MyFirstApp',
      // host: "global.xirsys.net",
      // path: "/_turn/MyFirstApp",
      method: "PUT",
      headers: {
        "Authorization": "Basic " + Buffer.from("manhcuong173:8f73ca1c-18b2-11ea-a9fe-0242ac110004").toString("base64"),
        "Content-Type": "application/json",
        "Content-Length": bodyString.length
      }
    };

    //Call a request to get ICE list of turn server
    //Thông thường config iceServers sẽ dùng mặc định module https của node theo xirsys.com config nhưng nên dùng module
    //request cho gọn và dễ hiểu hơn 
    //Tham số đầu options sẽ cần 2 prop là method và header đã được cấu hình bên trên

    request(options, function(error, response, body) {
      
      if(error) {
        console.log('Error when get ICE list', error)
        return reject(error);
      }
      //Vì dữ liêu trả về hiện tại là string, mình cần đưa về phía client là 1 json object
      let bodyJson = JSON.parse(body);
      resolve(bodyJson.v.iceServers);
    });
  })
}

let homeController = async (req, res) => {
  let errors = [];
  try {
    errors = [];
    //Take notifications from database by req.user._id only 10 items 
    let notifications = await notification.getNotifications(req.user._id);

    //Get amount notifications unread
    let countNotifUnread = await notification.countNotifUnread(req.user._id);

    //get 10 contacts on time
    let contacts = await contact.getContacts(req.user._id)
    //get contacts send(10 item one time)
    let contactsSent = await contact.getContactsSent(req.user._id)
    //get contacts receive(10 item one time)
    let contactsReceived = await contact.getContactsReceived(req.user._id)

    //count all contacts
    let countAllContacts = await contact.countAllContacts(req.user._id);
    let countAllContactsSent = await contact.countAllContactsSent(req.user._id);
    let countAllContactsReceived = await contact.countAllContactsReceived(req.user._id);

    let getAllConversationItems = await message.getAllConversationItems(req.user._id);
    let allConversations = getAllConversationItems.allConversations;
    let userConversations = getAllConversationItems.userConversations;
    let groupConversations = getAllConversationItems.groupConversations;

    //all messages with conversations, max 30 items
    let allConversationWithMessages = getAllConversationItems.allConversationWithMessages;

    //get ICE list from xirsys turn server 
    let  iceServerList = await getICETurnServer();

    res.render('main/home/home', {
      errors: req.flash('errors'),
      success: req.flash('success'),
      user: req.user,
      notifications: notifications,
      errors: errors,
      countNotifUnread: countNotifUnread,
      contacts: contacts,
      contactsSent: contactsSent,
      contactsReceived: contactsReceived,
      countAllContacts: countAllContacts,
      countAllContactsSent: countAllContactsSent,
      countAllContactsReceived: countAllContactsReceived,
      allConversationWithMessages: allConversationWithMessages,
      bufferToBase64: bufferToBase64,
      lastItemOfArray: lastItemOfArray,
      convertTimestamptoHumenstamp: convertTimestamptoHumenstamp,
      iceServerList: JSON.stringify(iceServerList)
    });
  } catch (error) {
    errors.push(error);
  }
};

module.exports = {
  homeController: homeController
};