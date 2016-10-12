'use strict';

var AlexaSkill = require('./AlexaSkill.js');
var config = require('config');
var _ = require('underscore');
var APP_ID = "amzn1.ask.skill.ab6a9153-909e-4024-96a8-b6f9e3154e4d";
var kamasutraPositionsArray = ["Cross", "Fantastic Rocking Horse", "Clip", "Peg", "Bridge", "Slide", "Crossed Keys", "Close Up", "Amazon",
                               "Catherine Wheel", "Eagle", "Ape", "Star", "Kneel", "Glowing Juniper", "Squat Balance", "Lustful Eg", "Bandoleer",
                               "Curled Angel", "Hero", "Glowing Triangle", "Padlock", "Crouching tiger", "Ascent To Desire", "Double Decker",
                               "Reclining Lotus", "Super 8", "Splitting Bamboo", "Nirvana", "Balancing Act", "Hound", "Deckchair", "Rowing Boat",
                               "Frog", "Seduction", "X Rated", "Rock And Roller", "Doggy Style", "Triumph Arch", "Classic", "Suspended Scissors",
                               "Erotic v", "Propeller", "Ship", "Plough", "Magic Mountain", "Fan", "Butterfly", "Reverse cowgirl", "Dolphin"];

var KamasutraPositionRetriever = function () {
    AlexaSkill.call(this, APP_ID);
};

KamasutraPositionRetriever.prototype = Object.create(AlexaSkill.prototype);
KamasutraPositionRetriever.prototype.constructor = KamasutraPositionRetriever;

KamasutraPositionRetriever.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("onSessionStarted requestId: " + sessionStartedRequest.requestId + ", sessionId: " + session.sessionId);
};

KamasutraPositionRetriever.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    var output = 'Welcome to Kamasutra Bible. Start by listing all the possible Kamasutra positions and later ask for the description of one in particular.';
    var reprompt = 'Okay. Whenever you\'re ready, you can start asking for any Kamasutra position.';
    response.ask(output, reprompt);
    console.log("onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
};

KamasutraPositionRetriever.prototype.intentHandlers = {
    'GetAllKamasutraPositions': function (intent, session, response) {
        var speechOutput = {
            speech: "<speak>" +
                    "<p>I sent you an Alexa Card with all the Kamasutra positions. Please go ahead an open your Alexa App and ask for the description of one in particular!</p>" +
                    "</speak>",
            type: AlexaSkill.speechOutputType.SSML
        };

        response.tellWithCard(speechOutput, 'KAMASUTRA POSITIONS', kamasutraPositionsArray.join("\n "));
    },

    'GetKamasutraPosition': function (intent, session, response) {
        var position = intent.slots.Position.value;
        console.log(position);

        var key = intent.slots.Position.value.toLowerCase().split(' ').join('_');
        console.log('Kamasutra Position = ' + key);

        if (config.has(key)) {
            var speechOutput = {
                speech: "<speak>" +
                        "<p>I sent you an Alexa Card with the description of the Kamasutra position you requested. Please go ahead an open your Alexa App to find more information about it!</p>" +
                        "</speak>",
                type: AlexaSkill.speechOutputType.SSML
            };

            // response.tellWithCardAndImage(speechOutput, position.toUpperCase(), config.get(key + '.' + 'description'),
            //                               'https://s3.amazonaws.com/alexa-kamasutra/small/' + config.get(key + '.' + 'image_index') + '.png',
            //                               'https://s3.amazonaws.com/alexa-kamasutra/large/' + config.get(key + '.' + 'image_index') + '.png');

            response.tellWithCard(speechOutput, position.toUpperCase(), config.get(key + '.' + 'description'));

        } else {
            response.tell('I was not able to find the position you requested, please try again!')
        }
    },

    'GetRandomKamasutraPosition': function (intent, session, response) {
        var position = _.sample(kamasutraPositionsArray);
        console.log(position);

        var key = intent.slots.Position.value.toLowerCase().replace(' ', '_');
        console.log('Kamasutra Position = ' + key);

        var speechOutput = {
            speech: "<speak>" +
                    "<p>I sent you an Alexa Card with a random Kamasutra position. Please go ahead an open your Alexa App to find more information about it!</p>" +
                    "<p>Ohh by the way," + "<break time='0.5s'/>" + "Good Luck!</p>" +
                    "</speak>",
            type: AlexaSkill.speechOutputType.SSML
        };

        // response.tellWithCardAndImage(speechOutput, position.toUpperCase(), config.get(key + '.' + 'description'),
        //                               'https://s3.amazonaws.com/alexa-kamasutra/small/' + config.get(key + '.' + 'image_index') + '.png',
        //                               'https://s3.amazonaws.com/alexa-kamasutra/large/' + config.get(key + '.' + 'image_index') + '.png');

        response.tellWithCardAndImage(speechOutput, position.toUpperCase(), config.get(key + '.' + 'description'));
    },

    'AMAZON.HelpIntent': function (intent, session, response) {
        response.ask('Welcome to Kamasutra Bible.' + 'Start by listing all the possible Kamasutra positions and later ask for description of one in particular.',
                     'Which Kamasutra position would you like to learn today?');
    },

    'AMAZON.CancelIntent': function (intent, session, response) {
        response.tell('Okay. Whenever you\'re ready, you can start asking for any Kamasutra position.');
    },

    'AMAZON.StopIntent': function (intent, session, response) {
        response.tell('Okay. Whenever you\'re ready, you can start asking for any Kamasutra position.');
    }
};

exports.handler = function (event, context) {
    var skill = new KamasutraPositionRetriever();
    skill.execute(event, context);
};
