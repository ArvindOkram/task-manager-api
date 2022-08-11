const sgMail = require('@sendgrid/mail')

//const sendgridAPIKey = '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'

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

// sgMail.send({
//     to: '2020pis5663@mnit.ac.in',
//     from: '2020pis5663@mnit.ac.in',
//     subject: 'My email creation',
//     text: 'Hope this email gets to you well!'
// })

const sendWelcomeEmail = (email, name) =>{
    sgMail.send({
        to: email,
        from: '2020pis5663@mnit.ac.in',
        subject: 'Thanks for joining in',
        text: `Welcome to the app, ${name}`,
        html:'' //can create complex email with picture!
    })
}

const sendCancelationEmail = (email, name) =>{
    sgMail.send({
        to: email,
        from: '2020pis5663@mnit.ac.in',
        subject: 'Are you sure you want to cancel your account',
        text: `What can we do to keep you onboard, ${name}`,
        html:'' //can create complex email with picture!
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}