const request = require("request");
const rl = require("readline");

const endpoint = "https://westeurope.api.cognitive.microsoft.com/luis/v2.0/apps/";
const luisAppId = process.env.LUIS_APP_ID;
const luisSubscriptionKey = process.env.LUIS_SUBSCRIPTION_KEY;

function getLuisIntent(utterance, handler) {
    // Set the LUIS_SUBSCRIPTION_KEY environment variable
    // to the value of your Cognitive Services subscription key
    var queryParams = {
        "subscription-key": luisSubscriptionKey,
        "bing-spell-check-subscription-key": "b591fd351c174a0e8abef6727f689646",
        "timezoneOffset": "0",
        "verbose": true,
        "q": utterance
    }

    request({
        url: `${endpoint}${luisAppId}`,
        qs: queryParams
    }, function (err, response, body) {
        if (err)
            console.log(err);
        else {
            var data = JSON.parse(body);
            console.log(`Query: ${data.query}`);
            console.log(`Top Intent: ${data.topScoringIntent.intent}`);
            if (data.sentimentAnalysis.score > 0.7) {
                console.log("Strong sentiment detected:", data.sentimentAnalysis.label);
            }
            !!handler && !!handler[data.topScoringIntent.intent] &&
                !!handler[data.topScoringIntent.intent](data);
        }
    })
}

const intentHandler = {
    "FindPaymentStatus": (data) => {
        const paymentIDs = data.entities.filter((e) => e.type === "PaymentID");
        if (paymentIDs.length > 0) {
            console.log("Let's see...Give me just a moment as I gather all the data...")
            if (paymentIDs.length === 1) {
                console.log(
                    `I see that the payment ${paymentIDs[0].entity} is now accepted.`
                );
            } else {
                console.log("So the payments are as follows: ");
                for (let i = 0; i < paymentIDs.length; i++) {
                    console.log(
                        `${paymentIDs[i].entity} is now accepted.`
                    )
                }
            }
        } else {
            console.log(
                "You can send me the payment's ID if you want to know its status."
            );
        }
    },
    "FindPaymentDate": (data) => {
        const paymentIDs = data.entities.filter((e) => e.type === "PaymentID");
        const paymentStatuses = data.entities.filter((e) => e.type === "PaymentStatus");
        if (paymentIDs.length > 0) {
            if (paymentIDsa.length > 1) {
                console.log("Let's see...Give me just a moment as I gather all the data...")
                for (let i = 0; i < paymentIDs.length; i++) {
                    switch (i) {
                        case 0:
                            console.log(
                                `So since its creation yesterday, payment ${paymentIDs[i].entity}` +
                                `has gone through Payments Hub successfully, meaning that` +
                                `it's been processed.`
                            );
                            break;
                        case paymentIDs.length - 1:
                            console.log(
                                `Wrapping up, payment ${paymentIDs[i].entity} was created today, ` +
                                `but it was unfortunately rejected by our system. The error ` +
                                `message reads as follows[...]`
                            );
                            console.log("That`s it!")
                            break;
                        default:
                            console.log(
                                `Next up, created last monday, payment ${paymentIDs[i].entity}` +
                                `has gone through Payments Hub successfully, meaning that` +
                                `it's been processed.`
                            );
                    }
                }
            } else {
                console.log(
                    `Hi, I see that the payment ${paymentIDs[0].entity} ` +
                    `was created yesterday and turned ` +
                    `${paymentStatuses[paymentStatuses.length - 1].entity} ` +
                    `today morning.`
                );
            }
        } else {
            console.log("You will need to be more specific if you want any dates!");
        }
    },
    "FindPaymentJourney": (data) => {
        const paymentIDs = data.entities.filter((e) => e.type === "PaymentID");
        if (paymentIDs.length > 0) {
            console.log("Let's see...Give me just a moment as I gather all the data...")
            if (paymentIDs.length > 1) {
                for (let i = 0; i < paymentIDs.length; i++) {
                    switch (i) {
                        case 0:
                            console.log(
                                `So our database says that the payment ${paymentIDs[i].entity} ` +
                                `was created yesterday morning and got accepted the same ` +
                                `day 15 minutes after. That is the last record in this one.`
                            );
                            break;
                        case paymentIDs.length - 1:
                            console.log(
                                `Continuing with payment ${paymentIDs[i].entity}, it seems that it ` +
                                `was created later last monday and got rejected due to a ` +
                                `parsing issue. The error message was[...]`
                            );
                            console.log("That's it! Hope that helped ;)");
                            break;
                        default:
                            console.log(
                                `Finally, payment ${paymentIDs[i].entity} was created yesterday ` +
                                `morning and got accepted the same ` +
                                `day 15 minutes after. That is the last record in this one.`
                            );
                    }
                }
            } else {
                console.log(
                    `So our database says that the payment ${paymentIDs[0].entity} ` +
                    `was created yesterday morning and got accepted the same ` +
                    `day 15 minutes after.`
                );
            }
        } else {
            console.log(
                "Hi, I can give you an update on a payment as long as " +
                "you have the ID, just text me and I will help"
            );
        }
    },
    "None": (data) => {
        console.log("Did you say anything?");
    }
}

// Pass an utterance to the sample LUIS app
process.stdin.on("data", (data) => {
    getLuisIntent(data, intentHandler);
})
