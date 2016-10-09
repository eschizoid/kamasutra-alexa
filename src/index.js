'use strict';

var AlexaSkill = require('./AlexaSkill.js');
var config = require('config');
var _ = require('underscore');
var APP_ID = "amzn1.ask.skill.ab6a9153-909e-4024-96a8-b6f9e3154e4d";
var kamasutraPositionsArray = ["The Cross", "The Fantastic Rocking Horse", "The Clip", "The Peg", "The Bridge", "The Slide", "The Crossed Keys", "The Close Up", "The Amazon",
                               "The Catherine Wheel", "The Eagle", "The Ape", "The Star", "The Kneel", "The Glowing Juniper", "The Squat Balance", "The Lustful Eg", "Bandoleer",
                               "The Curled Angel", "The Hero", "The Glowing Triangle", "The Padlock", "The Crouching tiger", "The Ascent To Desire", "The Double Decker",
                               "The Reclining Lotus", "The Super 8", "The Splitting Bamboo", "The Nirvana", "The Balancing Act", "The Hound", "The Deckchair", "The Rowing Boat",
                               "The Frog", "The Seduction", "The X Rated", "The Rock And Roller", "Doggy Style", "The Triumph Arch", "The Classic", "The Suspended Scissors",
                               "The Erotic v", "The Propeller", "The Ship", "The Plough", "The Magic mountain", "The Fan", "The Butterfly", "The Reverse cowgirl", "The Dolphin"];

var KamasutraPositionRetriever = function () {
    AlexaSkill.call(this, APP_ID);
};

KamasutraPositionRetriever.prototype = Object.create(AlexaSkill.prototype);
KamasutraPositionRetriever.prototype.constructor = KamasutraPositionRetriever;

KamasutraPositionRetriever.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("onSessionStarted requestId: " + sessionStartedRequest.requestId + ", sessionId: " + session.sessionId);
};

KamasutraPositionRetriever.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    var output = 'Welcome to Kamasutra. Start by listing all the possible Kamasutra positions and later ask for the description of one in particular.';
    var reprompt = 'Okay. Whenever you\'re ready, you can start asking for any Kamasutra position.';
    response.ask(output, reprompt);
    console.log("onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
};

KamasutraPositionRetriever.prototype.intentHandlers = {
    'GetAllKamasutraPositions': function (intent, session, response) {
        var speechOutput = {
            speech: "<speak>" +
                    "<p>I sent you an Alexa Card with all the Kamasutra positions. Please go ahead an open your Alexa App and ask for the description of one in particular.</p>" +
                    "</speak>",
            type: AlexaSkill.speechOutputType.SSML
        };

        response.tellWithCard(speechOutput, 'KAMASUTRA POSITIONS', kamasutraPositionsArray.join("\n"));
    },

    'GetKamasutraPosition': function (intent, session, response) {
        var position = intent.slots.Position.value;
        console.log(position);

        var key = intent.slots.Position.value.toLowerCase().replace(' ', '_');
        console.log('Kamasutra Position = ' + key);

        if (config.has(key)) {
            var speechOutput = {
                speech: "<speak>" +
                        "<p>I sent you an Alexa Card with the description of the position you requested. Please go ahead an open your Alexa App</p>" +
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
                    "<p>I sent you an Alexa Card with a random Kamasutra position you requested. Please go ahead an open your Alexa App.</p>" +
                    "<p>Ohh by the way," + "<break time='0.5s'/>" + "Good Luck!</p>" +
                    "</speak>",
            type: AlexaSkill.speechOutputType.SSML
        };

        response.tellWithCardAndImage(speechOutput, position.toUpperCase(), config.get(key + '.' + 'description'),
                                      'https://s3.amazonaws.com/alexa-kamasutra/small/' + config.get(key + '.' + 'image_index') + '.png',
                                      'https://s3.amazonaws.com/alexa-kamasutra/large/' + config.get(key + '.' + 'image_index') + '.png');
    },

    'AMAZON.HelpIntent': function (intent, session, response) {
        response.ask('Welcome to Kamasutra.' + 'Start by listing all the possible Kamasutra positions and later ask for the description of one in particular.',
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
