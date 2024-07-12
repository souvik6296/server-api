const nodemailer = require('nodemailer');



const sendEmail = async (req, res) => {
    const data =req.body;
    // Create a transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: 'gmail', // e.g., use 'smtp.mailtrap.io' for Mailtrap or other SMTP servers
        auth: {
            user: 'btechcodingwallah@gmail.com', // your Gmail account
            pass: 'ivqdjxlgtgmeobqr',  // your Gmail password (consider using environment variables)
        },
    });

    const usermsg = data.msg.toString()+`\nfrom: (${data.name}) ${data.from}\ncontact: ${data.phone}`;
    // https://web.whatsapp.com/send/?phone=9932360557&text=Hello for whatsapp

    // Set up email data
    let mailOptions = {
        from: data.from, // sender address
        to: 'btechcodingwallah@gmail.com', // fixed receiver address
        subject: `Message from ${data.name}`, // subject line
        text: usermsg, // plain text body
    };

    try {
        // Send mail with defined transport object
        let info = await transporter.sendMail(mailOptions);
        if(info){
            res.status(200).send({msg: "Message send to BtechCodingWallah Authority."});
            console.log('Message sent: %s', info.messageId);
        }
    } catch (error) {
        console.error('Error sending email: ', error);
    }
};

module.exports = {sendEmail};
